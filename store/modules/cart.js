import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { actionPayload, createActionsReducer } from '../utils/createActionsReducer'
import envConfig from '../../config/envConfig'
import { gaEvents } from '../../services/ga'
import { getIn } from '../../utils/getIn'
import { deleteAsyncStorageItem, getAsyncStorageItem, setAsyncStorageItem } from '../../utils/asyncStorage'
import { useActionState } from '../utils/stateHook'
import { asyncRequest, createRequestActions } from './utils/requestAction'
import { alertError, apiPost } from '../api'
import { graphQuery } from '../../services/apollo/apollo'
import { fetchProductsDetailBySku, getProductQuery, getProductQueryVariables } from '../../gql/useProductQuery'
import { algoliaInsights } from '../../services/algolia'
import facebook, { fbEvents } from '../../services/facebook'
import { tealiumEvents } from '../../services/tealium'
import { removeArrayDuplicates, toArray } from '../../utils/array'
import { bigcommerceUtils } from '../../services/bigcommerce'
import { emarsysService } from '../../services/emarsys/emarsys'
import { partnerizeService } from '../../services/partnerize'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import createCheckoutActions from './cart/createCheckoutActions'
import { formatPageIdentifier, formatProductSkuValue } from '../../utils/format'
import { deepClone } from '../../utils/object'
import { isValidArray, isValidObject } from '../../utils/validation'
import branchEvents from '../../services/branch/branchEvents'
import { formatTimestamp, isBeforeTimestamp, now } from '../../utils/date'
import { asyncEach } from '../../utils/asyncEach'
import { compareDate } from '../../utils/sort'
import { getRemoteConfigNumber } from '../../services/useRemoteConfig'
import { remoteLogError } from './utils/remoteLogError'

import { getCartTotals } from '../../components/cart/utils/useCartTotals'

const namespace = 'cart'
const initialState = {
  couponIds: [],
  backordersItems: [],
  request: null,
  checkout: null,
  cartItemsProductDetail: [],
  billingAddress: null,
  orderConfirmation: null,
  addedToCartItems: [],
  promotionItems: null,
  promotions: null,
  paymentMethod: null,
  newBillingAddress: false,
  cartItemsInventory: null,
  productPending: null,
  giftCertificates: [],
  recentlyOrderedProducts: {},
  storeCredits: 0
}

const checkout = actionPayload(payload => payload)
const cartItemsProductDetail = actionPayload(payload => payload)
const billingAddress = actionPayload(payload => payload)
const newBillingAddress = actionPayload(payload => payload)
const paymentTypes = actionPayload(payload => payload)
const paymentCardDetails = actionPayload(payload => payload)
const orderConfirmation = actionPayload(payload => payload)
const customerOrders = actionPayload(payload => payload)
const addedToCartItems = actionPayload(payload => payload)
const promotionItems = actionPayload(payload => payload)
const promotions = actionPayload(payload => payload)
const paymentMethod = actionPayload(payload => payload)
const checkoutOrder = actionPayload(payload => payload)
const productPending = actionPayload(payload => payload)
const backordersItems = actionPayload(payload => payload)
const recentlyOrderedProducts = actionPayload(payload => payload)

export const useCart = () => useActionState('cart.checkout')

const getAllCartLineItems = lineItems =>
  Object.keys(lineItems || {}).reduce((acc, key) => [...acc, ...lineItems[key]], [])

/**
 * hook selector cart line items
 */
export const useCartLineItems = () => getAllCartLineItems(useActionState('cart.checkout.cart.line_items'))

export const useCartQuantity = () => {
  const cartItems = useCartLineItems()
  return cartItems.reduce((acc, item) => (item.quantity ? acc + item.quantity : acc + 1), 0)
}
/**
 * hook selector cart product data from graphql
 */
export const useCartItemsProductDetail = () => useActionState('cart.cartItemsProductDetail')
/**
 * hook selector find product by sku in cart line items
 *
 * @param productSku
 * @returns {*}
 */
export const useFindCartLineItem = productSku => {
  const lineItems = useCartLineItems()

  if (lineItems) {
    return lineItems.find(item => getIn(item, 'sku') === formatProductSkuValue(productSku))
  }
}

// get products from all promotions
export const usePromotionProducts = () => {
  const items = useActionState('cart.promotions') || []
  if (isValidArray(items)) {
    return items.reduce((acc, item) => {
      const products = item?.rules?.[0]?.actions?.[0]?.products || []
      return [...acc, ...products]
    }, [])
  }
  return []
}

export const useCheckoutErrorAlert = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const cartId = useActionState('cart.checkout.id')

  const missingCheckoutErrorAlert = () => {
    const title = 'Sorry, but there was an issue loading your bag'
    const text =
      'Our IT gurus have been notified. Please note your items may have been removed if there was a payment error, as the order would have been submitted to us, but declined.'
    Alert.alert(title, text, [
      { text: 'View Orders', onPress: () => navigation.navigate('Account', { screen: 'AccountOrders' }) },
      { text: 'OK' }
    ])
  }

  return async (message = '') => {
    const text = `${message}\n\nPlease try checking out again.`
    const title = 'Sorry, but there was an issue processing your order'
    Alert.alert(title, text, [
      {
        text: 'OK',
        onPress: async () => {
          navigation.navigate('Cart')
          const data = await dispatch(fetchCheckout(cartId)) // re-fetch checkout (in case its been deleted)
          if (!data) {
            missingCheckoutErrorAlert()
          }
        }
      }
    ])
  }
}

export const getCustomerId = getState => getIn(getState(), 'customer.account.big_commerce_id') || undefined

const getCheckoutId = getState => {
  const { cart: cartState } = getState()
  return cartState && cartState.checkout && cartState.checkout.id
}

const storeCheckout = data => async (dispatch, getState) => {
  if (data) {
    const { couponIds: offerIds, backordersItems: storedBackordersItems, giftCertificates } = getState()?.cart
    await setAsyncStorageItem(`${namespace}.cart`, {
      id: data.cart.id,
      offerIds,
      backordersItems: storedBackordersItems,
      giftCertificates
    })
    await dispatch(module.actions.checkout(data))

    return data.checkout
  }
}

const storeCartItemsProductDetail = data => async (dispatch, getState) => {
  await dispatch(module.actions.cartItemsProductDetail(data))
}

/**
 * fetch a cart checkout by id. delete stored cart if there is an error response.
 * @param id
 * @returns {function(...[*]=)}
 */
const fetchCheckout = cartId => async (dispatch, getState) => {
  const id = cartId || getCheckoutId(getState)

  const onError = error => {
    dispatch(deleteCheckout())
  }
  const endpoint = `/ecommerce/checkouts/${id}?include=promotions.banners`
  const response = await dispatch(requestGet(endpoint, { id }, { onError }))

  const checkoutData = getIn(response, 'value.data.data')
  if (checkoutData && checkoutData.id) {
    const promoBanners = getIn(checkoutData, 'promotions.banners')
    await dispatch(fetchPromotionBannerProducts(promoBanners))
    await dispatch(storeCheckout(checkoutData))
    await dispatch(updateCartItemsInventory())
    await dispatch(updateCartItemsProductDetail(checkoutData))
    return checkoutData
  }
}
const fetchStoredCheckout = () => async (dispatch, getState) => {
  const data = await getAsyncStorageItem(`${namespace}.cart`)

  if (data?.id) {
    if (isValidArray(data.offerIds)) {
      dispatch(module.actions.couponIds(data.offerIds))
    }
    if (data.giftCertificates) {
      dispatch(module.actions.giftCertificates(data.giftCertificates))
    }
    if (isValidArray(data.backordersItems)) {
      await dispatch(module.actions.backordersItems(data.backordersItems))
    }

    const checkoutData = await dispatch(fetchCheckout(data.id))

    if (data.offerIds) {
      const promoBanners = getIn(checkoutData, 'promotions.banners')
      await dispatch(fetchPromotionBannerProducts(promoBanners, data.offerIds))
    }
    return checkoutData
  }
}

const deleteCheckout = () => async (dispatch, getState) => {
  await deleteAsyncStorageItem(`${namespace}.cart`, true)
  // await deleteSecureItem(`${namespace}.billingAddress`)
  dispatch(module.actions.checkout(null))
  dispatch(module.actions.paymentTypes(null))
  dispatch(module.actions.promotionItems(null))
  dispatch(module.actions.promotions(null))
  dispatch(module.actions.checkoutOrder(null))
  dispatch(module.actions.paymentMethod(null))
  dispatch(module.actions.addedToCartItems([]))
  dispatch(module.actions.couponIds([]))
  dispatch(module.actions.backordersItems([]))
  dispatch(module.actions.cartItemsProductDetail([]))
  dispatch(module.actions.giftCertificates([]))
}

const deleteOrderData = () => async (dispatch, getState) => {
  dispatch(module.actions.paymentMethod(null))
  dispatch(module.actions.checkoutOrder(null))
}

// ecommerce/catalog/products?sku=ELE001
const addCustomerToCart = () => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const customer_id = getCustomerId(getState)
  if (customer_id && cartId) {
    const endpoint = `/ecommerce/carts/${cartId}`
    const response = await dispatch(requestPut(endpoint, { customer_id }))
    if (response) {
      await dispatch(fetchCheckout(cartId))
    }
  }
}

/**
 * https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-checkout-api/checkout-coupons/checkoutscouponsbycheckoutidpost
 * @param couponCode
 * @returns {function(...[*]=)}
 */
const addCouponToCart = couponCode => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const endpoint = `/ecommerce/checkouts/${cartId}/coupons`
  const payload = {
    coupon_code: couponCode
  }

  const onError = error => {
    const status = error?.response?.status
    const message = error?.response?.data.errors?.big_commerce_error?.title || ''
    // get the offerid from html attribute, https://regex101.com/r/vByA4L/1
    const offerId = message.match(/data-offer-id='([^']*)'/)?.[1]
    if (status === 400 && offerId) {
      dispatch(fetchPromotion(offerId))
      gaEvents.addPromoCode(couponCode, true)
      return { offerId, couponCode }
    }
    dispatch(displayError(error))
    gaEvents.addPromoCode(couponCode, false)

    if (status !== 400) {
      remoteLogError({ error, namespace, endpoint, payload })
    }
  }

  const response = await dispatch(requestPost(endpoint, payload, { onError, useRemoteLog: false }))
  const cartData = getIn(response, 'value.data.data')

  gaEvents.addPromoCode(couponCode, true)
  await dispatch(fetchCheckout(cartId))
  return { cartData, couponCode }
}

const fetchPromotion = offerIds => async (dispatch, getState) => {
  const { couponIds } = getState()?.cart

  const ids = removeArrayDuplicates([...toArray(offerIds), ...couponIds].map(item => Number(item)))

  if (isValidArray(ids)) {
    const endpoint = `/promotions?id=${ids}`
    const response = await dispatch(requestGet(endpoint))
    const items = response?.value?.data?.data

    if (isValidArray(items)) {
      return dispatch(module.actions.promotionItems(items))
    }
  }

  dispatch(module.actions.promotionItems([]))
}

const fetchPromotionBannerProducts = (banners, offersIds) => async (dispatch, getState) => {
  const bannersIds =
    (isValidArray(banners) &&
      banners.map(banner => banner?.text?.split(`data-offer-id='`)?.[1].split(`'`)?.[0]).filter(id => !!id)) ||
    []

  let ids = bannersIds

  if (isValidArray(offersIds)) {
    ids = removeArrayDuplicates([...offersIds, ...bannersIds].map(item => Number(item)))
  }

  await dispatch(fetchPromotion(ids))
}

/**
 * https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-cart-api/cart-items/updatecartlineitem
 * /carts/{cartId}/items/{itemId}
 * @param item
 * @param qty
 * @returns {function(...[*]=)}
 */
const changeLineItemQuantity = (item, qty) => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const endpoint = `/ecommerce/carts/${cartId}/items/${item.id}`
  const payload = {
    line_item: {
      quantity: qty,
      product_id: item.product_id
    }
  }
  const response = await dispatch(requestPut(endpoint, payload))
  const cartData = getIn(response, 'value.data.data')
  if (cartData?.id) {
    await dispatch(fetchCheckout(cartId))
  }
  return cartData
}

const deleteLineItem = (cartId, id) => async (dispatch, getState) => {
  const endpoint = `/ecommerce/carts/${cartId}/items/${id}`
  const response = await dispatch(requestDelete(endpoint))
  const cartData = getIn(response, 'value.data.data')

  if (!cartData?.id) {
    await dispatch(deleteCheckout())
  }

  return cartData
}

const removeLineItem = item => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const { cartItemsProductDetail: products } = getState().cart
  const productData = products?.find(product => product?.productSku?.find(sku => sku === item.sku))
  const response = await dispatch(deleteLineItem(cartId, item.id))

  if (response?.id) {
    await dispatch(fetchCheckout(cartId))

    if (isValidObject(productData)) {
      const { totalCost } = getCartTotals(getState().cart)
      emarsysEvents.trackUpdatedCart(totalCost, getAllCartLineItems(response?.line_items), products)
      gaEvents.removeFromCart(productData)
    }
  }
}

const removeLineItems = items => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  let index = 0
  let hasCheckoutId = true

  const next = async () => {
    const item = items[index]
    const response = await dispatch(deleteLineItem(cartId, item.id))

    if (!response?.id) {
      hasCheckoutId = false
      return
    }

    if (index + 1 < items?.length) {
      index += 1
      await next()
    }
  }

  await next()

  if (hasCheckoutId) {
    await dispatch(fetchCheckout(cartId))
  }
}

const getAllPromotionProducts = promos =>
  (promos || []).reduce((acc, item) => {
    const products = getIn(item, 'rules.0.actions.0.products') || []
    return [...acc, ...products]
  }, [])

const getCartItemsInventoryWithBackordersData = (cartItemsInventory, storedBackordersItems) => {
  if (Array.isArray(cartItemsInventory) && Array.isArray(storedBackordersItems)) {
    return cartItemsInventory.map(cartItem => ({
      ...(storedBackordersItems.find(
        backordersItem => backordersItem?.product_id === cartItem?.product_id && backordersItem
      ) || {}),
      ...cartItem
    }))
  }

  return []
}

const filterUnavailableCartItem = item => {
  if (!isValidObject(item)) return false

  const isItemUnavailable =
    item.availability !== 'available' || item.inventory_level === 0 || item.inventory_level < item.quantity

  if (item.backorders) {
    return item.backorders !== 'Backorders' && isItemUnavailable
  }

  return isItemUnavailable
}

/**
 * get cart items that are out of stock or quantity unavailable
 * @returns Array
 */
const getUnavailableCartItems = () => async (dispatch, getState) => {
  const {
    cart: { cartItemsInventory, backordersItems: storedBackordersItems }
  } = getState()
  let items = cartItemsInventory

  if (isValidArray(storedBackordersItems)) {
    items = getCartItemsInventoryWithBackordersData(cartItemsInventory, storedBackordersItems)
  }

  return items
    .filter(item => !bigcommerceUtils.isAutoAddGiftItem(item))
    ?.filter(item => !bigcommerceUtils.isGiftCertificate(item))
    ?.filter(filterUnavailableCartItem)
}
/**
 * get GWP cart items which are not included in the promotions
 * @returns Array
 */
const getInvalidGiftItems = () => (dispatch, getState) => {
  const {
    cart: { cartItemsInventory, promotions: promotionsState }
  } = getState()
  const promotionProducts = getAllPromotionProducts(promotionsState)

  return (cartItemsInventory || []).filter(item => {
    const isGift = bigcommerceUtils.isGiftItem(item)
    const isAutoGift = bigcommerceUtils.isAutoAddGiftItem(item)
    const isGiftInPromo = !!promotionProducts?.find(newItem => newItem.id === item.product_id)
    return isGift && !isGiftInPromo && !isAutoGift
  })
}

const removeInvalidCartItems = () => async (dispatch, getState) => {
  let outOfStockCartItems = await dispatch(getUnavailableCartItems())
  let invalidGiftItems = await dispatch(getInvalidGiftItems())
  if (!isValidArray(outOfStockCartItems)) {
    outOfStockCartItems = []
  }
  if (!isValidArray(invalidGiftItems)) {
    invalidGiftItems = []
  }

  const invalidItems = removeArrayDuplicates([...outOfStockCartItems, ...invalidGiftItems])

  if (isValidArray(invalidItems)) {
    await dispatch(removeLineItems(invalidItems))
  }
}

const getInvalidGiftCertificates = () => async (dispatch, getState) => {
  const updatedGiftCertificates = await dispatch(
    module.actions.fetchGiftCertificatesDetails(getState()?.cart?.giftCertificates)
  )

  const isValid = certificate =>
    isValidObject(certificate) &&
    parseFloat(certificate.balance) > 0 &&
    !isBeforeTimestamp(certificate.expiry_date) &&
    certificate.status === 'active'

  return {
    valid: updatedGiftCertificates?.filter(isValid) || [],
    invalid: updatedGiftCertificates?.filter(cert => !isValid(cert)) || []
  }
}

const updateValidGiftCertificates = validGiftCertificates => async (dispatch, getState) =>
  dispatch(module.actions.giftCertificates(validGiftCertificates))

const updateStoreCredits = credits => async (dispatch, getState) => dispatch(module.actions.storeCredits(credits))

const removeGiftCertificateFromState = id => async (dispatch, getState) => {
  const checkoutId = getCheckoutId(getState)
  const storedGiftCertificates = getState()?.cart?.giftCertificates || []
  const giftCertificates = storedGiftCertificates?.filter(certificate => certificate.id !== id)

  await dispatch(module.actions.giftCertificates(giftCertificates))
  await dispatch(fetchCheckout(checkoutId))
}

const fetchGiftCertificatesDetails = (codes = [], requestConfig) => async (dispatch, getState) => {
  const onError = error => alertError(error)
  const responses = await asyncEach(codes, async ({ code }) => {
    const response = await dispatch(
      requestGet(`ecommerce/gift_certificates?code=${code}`, {}, requestConfig ?? { onError })
    )
    return getIn(response, 'value.data')
  })

  return responses
}

const addGiftCertificateToCart = code => async (dispatch, getState) => {
  const maxGiftCardCodes = getRemoteConfigNumber('max_gift_card_codes')
  const giftCertificates = getState()?.cart?.giftCertificates || []

  if (giftCertificates?.length === maxGiftCardCodes) {
    return Alert.alert(`You have added the maximum number of gift cards allowed`, '')
  }

  const checkoutId = getCheckoutId(getState)
  const onError = error => {
    const status = error?.response?.status
    const message = error?.response?.data?.message

    if (status === 404 && message === `Gift certificate does not exist`) {
      return Alert.alert(`The following gift card does not exist`, `\n${code}\n`)
    }
  }
  let giftCertificate = await dispatch(fetchGiftCertificatesDetails([{ code }], { onError }))
  giftCertificate = giftCertificate?.[0]

  if (isValidObject(giftCertificate)) {
    const { expiry_date: expiryDate, balance, status } = giftCertificate

    const handleValidation = (message = 'no longer valid') => {
      Alert.alert(`The following gift card is ${message}`, `\n${code}\n`)
    }

    if (
      (expiryDate && isBeforeTimestamp(expiryDate)) ||
      parseFloat(balance) === 0 ||
      status === 'disabled' ||
      status === 'expired'
    ) {
      return handleValidation()
    }
    if (status === 'pending') {
      return handleValidation('currently pending')
    }
    if (status === 'inactive') {
      return handleValidation('not yet active')
    }

    giftCertificate.sorting_date = formatTimestamp(expiryDate, 'YYYY-MM-DD')
    giftCertificate.expiry_date = formatTimestamp(expiryDate, 'DD/MM/YY')
    const uniqueGiftCertificates = removeArrayDuplicates([...giftCertificates, giftCertificate])
    const sortedGiftCertificates = uniqueGiftCertificates.sort(compareDate('sorting_date', 'asc'))

    gaEvents.addGiftCertificateCode(code, true)

    await dispatch(module.actions.giftCertificates(sortedGiftCertificates))
    await dispatch(fetchCheckout(checkoutId))
  }

  return giftCertificate
}

const addGiftCertificateAsLineItem = (giftCertificate, giftCertificateOnCart) => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const customerId = getCustomerId(getState)
  const gift_certificates = [giftCertificate]

  let endpoint
  let payload

  if (cartId) {
    endpoint = `/ecommerce/carts/${cartId}/items`
    payload = { gift_certificates }
  } else {
    endpoint = '/ecommerce/carts'
    payload = { gift_certificates, currency: { code: 'AUD' } }

    if (customerId) {
      payload.customer_id = customerId
    }
  }

  const onError = error => alertError(error)

  const response = await dispatch(requestPost(endpoint, payload, { onError, name: 'addLineItems' }))

  const checkoutData = getIn(response, 'value.data.data')

  if (checkoutData && checkoutData.id && !giftCertificateOnCart) {
    dispatch(module.actions.addedToCartItems(gift_certificates))
  }

  if (giftCertificateOnCart) {
    const originalGiftCertificateIds = (getIn(getState(), 'cart.checkout.cart.line_items.gift_certificates') || []).map(
      giftCertificateItem => giftCertificateItem.id
    )
    const addedGiftCertificateIds = (getIn(checkoutData, 'line_items.gift_certificates') || []).map(
      giftCertificateItem => giftCertificateItem.id
    )
    let newGiftCertificateId = ''
    addedGiftCertificateIds.forEach(giftCertificateId => {
      if (!originalGiftCertificateIds.includes(giftCertificateId)) {
        newGiftCertificateId = giftCertificateId
      }
    })
    await dispatch(removeLineItem(giftCertificateOnCart))
    const newGiftCertificate = (getIn(checkoutData, 'line_items.gift_certificates') || []).find(
      giftCertificateItem => giftCertificateItem.id === newGiftCertificateId
    )
    dispatch(module.actions.addedToCartItems(gift_certificates))
    return { newGiftCertificate }
  }
  await dispatch(fetchCheckout(checkoutData.id))
}

/**
 * https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-cart-api/cart/createacart
 * @param items
 * @returns {function(...[*]=)}
 */

const addLineItems = ({ items, productData }) => async (dispatch, getState) => {
  const cartId = getCheckoutId(getState)
  const customerId = getCustomerId(getState)
  const line_items = toArray(items)

  let endpoint
  let payload
  if (cartId) {
    endpoint = `/ecommerce/carts/${cartId}/items`
    payload = { line_items }
  } else {
    endpoint = '/ecommerce/carts'
    payload = { line_items, currency: { code: 'AUD' } }
    if (customerId) {
      payload.customer_id = customerId
    }
  }

  const onError = error => {
    if (error.message === 'Request failed with status code 500') {
      Alert.alert('Out of Stock', `Sorry, but the item you’ve tried to add is now sold out.`)
    } else {
      alertError(error)
    }
  }

  const response = await dispatch(requestPost(endpoint, payload, { onError, name: 'addLineItems' }))

  // trigger algolia event
  if (productData?.queryId) {
    const { customer } = getState()
    algoliaInsights.addProductToCart(customer?.account, productData)
  }

  const checkoutData = getIn(response, 'value.data.data')

  if (checkoutData && checkoutData.id) {
    dispatch(module.actions.addedToCartItems(line_items))
    dispatch(module.actions.productPending(null))
    const storage = await getAsyncStorageItem(`${namespace}.cart`)
    const storedBackordersItems = storage?.backordersItems || []
    const backordersItemsData = line_items.filter(item => item.backorders === 'Backorders')

    if (isValidArray(backordersItemsData)) {
      await dispatch(module.actions.backordersItems([...backordersItemsData, ...storedBackordersItems]))
    }

    await dispatch(fetchCheckout(checkoutData.id))

    if (productData) {
      try {
        const lineItems = getAllCartLineItems(getState().cart.checkout.cart.line_items) || []
        const { cartItemsProductDetail: cartItemsProductDetailData } = getState().cart
        const { totalCost } = getCartTotals(getState().cart)

        gaEvents.addToCart(productData)
        emarsysEvents.trackCart(lineItems, cartItemsProductDetailData)
        emarsysEvents.trackUpdatedCart(totalCost, lineItems, cartItemsProductDetailData)
      } catch (error) {
        console.warn('addLineItems', 'error', error)
      }
    }

    if (!productData && isValidArray(line_items)) {
      const { cartItemsProductDetail: products } = getState().cart
      gaEvents.addToCart(products)
    }
  }
}

/**
 * update cart items state, merge in current inventory levels state
 * @returns {(function(*, *): Promise<*>)|*}
 */

const updateCartItemsInventory = () => async (dispatch, getState) => {
  const { cartItemsInventory, checkout: checkoutState } = getState().cart
  const cartItems = getAllCartLineItems(checkoutState?.cart?.line_items) || []
  if (isValidArray(cartItems)) {
    const itemsWithInventory = cartItems.map(item => {
      const catalogProduct = cartItemsInventory?.find(item2 => item2.product_id === item.product_id)
      return {
        ...item,
        availability: catalogProduct?.availability,
        inventory_level: catalogProduct?.inventory_level
      }
    })
    await dispatch(module.actions.cartItemsInventory(itemsWithInventory))
    return itemsWithInventory
  }
  await dispatch(module.actions.cartItemsInventory([]))
}

/**
 * update cart items product detail state
 * @returns {(function(*, *): Promise<*>)|*}
 */

const updateCartItemsProductDetail = checkoutData => async (dispatch, getState) => {
  const lineItems = getAllCartLineItems(checkoutData.cart.line_items) || []
  if (isValidArray(lineItems)) {
    const productsData = await fetchProductsDetailBySku(getAllCartLineItems(checkoutData.cart.line_items))
    await dispatch(storeCartItemsProductDetail(productsData))
    return productsData
  }

  await dispatch(storeCartItemsProductDetail([]))
  return []
}

/**
 * test inventory Makeup / Concealer / Benefits Stay...
 * https://store-5pecd49xfo.mybigcommerce.com/manage/products/edit/40334?sortField=productid&sortOrder=asc&query=IB179
 * @param minInventoryLevel
 * @returns {function(*, *): *[]}
 */

const fetchCartItemsInventory = () => async (dispatch, getState) => {
  const cartState = getState().cart
  const allCartLineItems = getAllCartLineItems(cartState?.checkout?.cart?.line_items)
  const giftCertificates = allCartLineItems?.filter(item => bigcommerceUtils.isGiftCertificate(item)) || []

  const cartItems = allCartLineItems?.filter(item => !bigcommerceUtils.isGiftCertificate(item)) || []

  if (isValidArray(cartItems)) {
    const catalogIds = cartItems.map(obj => obj.product_id)
    const limit = Math.max(50, catalogIds.length)
    const endpoint = `/ecommerce/catalog/products?id:in=${catalogIds}&limit=${limit}&include_fields=inventory_level,availability`
    try {
      const response = await dispatch(requestGet(endpoint))
      const catalogProducts = response?.value?.data?.data
      const itemsWithInventory = cartItems.map(item => {
        const catalogProduct = catalogProducts.find(item2 => item2.id === item.product_id)
        return {
          ...item,
          availability: catalogProduct?.availability,
          inventory_level: catalogProduct?.inventory_level
        }
      })

      await dispatch(module.actions.cartItemsInventory([...itemsWithInventory, ...giftCertificates]))
      return itemsWithInventory
    } catch (error) {
      dispatch(displayError(error))
    }
  }
  return null
}

export const useFindProductsByCatalogIds = catalogIds => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const handleProductIdsChange = () => {
    const handleFetchData = async () => {
      setLoading(true)
      if (isValidArray(catalogIds)) {
        const data = await bigcommerceUtils.fetchBigCommerceProductsByCatalogIds(catalogIds)

        if (isValidArray(data)) {
          setProducts(data)
        }
      }
      setLoading(false)
    }

    handleFetchData()
  }

  useEffect(handleProductIdsChange, [catalogIds?.join('-')])

  return { products, loading }
}

/**
 *fetches product details from big commerce catalog
 * https://developer.bigcommerce.com/api-reference/store-management/catalog/products/getproductbyid
 *
 * @param productSku String the product sku
 * @param includeFields Array defaults to ['date_created', 'price', 'cost_price']
 * @returns {function(*, *): *}
 */
const fetchCatalogProductBySku = (productSku, includeFields) => async (dispatch, getState) => {
  const endpoint = bigcommerceUtils.formatProductEndpoint(productSku, includeFields)
  const response = await dispatch(requestGet(endpoint, { productSku }))
  const catalogProduct = getIn(response, 'value.data.data.0')

  if (catalogProduct) {
    catalogProduct.productSku = productSku
  }

  return catalogProduct
}

const fetchCatalogProductsBySku = (productData, includeFields) => async (dispatch, getState) => {
  const items = Array.isArray(productData) ? productData : [{ sku: productData }]
  if (items) {
    const responses = await Promise.all(
      items.map(async (item, i) => {
        const catalogProduct = await dispatch(fetchCatalogProductBySku(item.sku, includeFields))
        if (catalogProduct && item?.product?.productType) {
          catalogProduct.productType = item?.product?.productType
        }
        return catalogProduct
      })
    )

    return responses.filter(res => res)
  }
}

const addProductsBySku = productData => async (dispatch, getState) => {
  const productIds = await dispatch(fetchCatalogProductsBySku(productData))

  const items = productIds?.map(item => ({
    quantity: 1,
    sku: item.sku || item.productSku,
    productSku: item.productSku || item.sku,
    product_id: item.id
  }))

  await dispatch(addLineItems({ items }))
}

const addProductBySku = ({ productSku, quantity = 1, cartProductId, productData }) => async (dispatch, getState) => {
  let product_id = cartProductId
  let productPayloadData = deepClone(productData)
  let sku = productSku

  await emarsysService.pauseInAppMessages()
  await dispatch(module.actions.productPending(productData))
  if (!sku) {
    const { data } = await graphQuery({
      query: getProductQuery(`
        brand_name
        backorders
        categories {
          id
          url
          title
          name
        }
        attributeOptions {
          product_id
          productSku
        }
      `),
      variables: getProductQueryVariables({
        product_id: parseInt(productData?.productId || productData?.product_id),
        identifier: productData?.url ? formatPageIdentifier(productData?.url, true) : productData?.identifier
      })
    })

    const variant = data?.products?.[0]?.attributeOptions?.find(
      attributeOption => attributeOption?.product_id === parseInt(productData?.productId)
    )

    if (isValidArray(data?.products)) {
      sku = formatProductSkuValue(variant?.productSku || data?.products?.[0]?.productSku)

      if (!productPayloadData) {
        productPayloadData = data?.products[0]
      }
    }
  }

  if (!parseInt(cartProductId)) {
    const catalogProduct = await dispatch(fetchCatalogProductBySku(sku))

    product_id = getIn(catalogProduct, 'id')
  }

  if (product_id) {
    const payload = {
      quantity,
      productSku: sku,
      product_id,
      backorders: productData?.backorders
    }

    if (!productPayloadData) {
      const res = await graphQuery({
        query: getProductQuery(`
          brand_name
          backorders
          categories {
            id
            url
            title
            name
          }
        `),
        variables: getProductQueryVariables({
          productSku: sku
        })
      })

      if (isValidArray(res?.data?.products)) {
        productPayloadData = res?.data?.products[0]
      }
    }

    if (productData?.queryId) {
      productPayloadData.queryId = productData.queryId

      if (envConfig.algoliaConfigName !== 'production' && productData.childProductId) {
        productPayloadData.objectId = productData.childProductId
      } else {
        productPayloadData.objectId = productData.product_id
      }
    }

    await dispatch(addLineItems({ items: payload, productData: productPayloadData }))
    emarsysService.resumeInAppMessages()
    return payload
  }
  const message = 'We are sorry, there was a problem adding to cart, please try again later'
  dispatch(displayError(new Error(message)))
  emarsysService.resumeInAppMessages()
}

const fetchCustomerOrders = () => async (dispatch, getState) => {
  const customer_id = getCustomerId(getState)
  const endpoint = `/ecommerce/orders`
  const response = await dispatch(requestGet(endpoint, { customer_id }, { name: 'fetchCustomerOrders' }))
  const orderData = getIn(response, 'value.data')
  dispatch(module.actions.customerOrders(orderData))
}

const fetchOrder = (orderId, transaction, deleteCheckoutData = false) => async (dispatch, getState) => {
  const customerAccount = getState()?.customer?.account
  const couponIds = getState()?.cart?.couponIds
  const orderToken = getIn(getState(), 'cart.checkoutOrder.X-Order-Token')
  const config = {}
  if (orderToken) {
    config.headers = { 'X-Order-Token': `${orderToken}` }
  }

  const orderRequest = async path => {
    const response = await dispatch(requestGet(`/ecommerce${path}`, { orderId }, config))
    return getIn(response, 'value.data')
  }
  const confirmationData = await orderRequest(`/orders/${orderId}/confirmation`)

  if (confirmationData?.data?.order?.id) {
    const {
      order: orderData,
      shipping_address: shippingData,
      products: productsData,
      coupons: couponsData
    } = confirmationData.data
    const extractAdditionalFields = ({ order, shipping_address, products, coupons, ...rest }) => rest

    let productsDetail = {}

    const data = productsData.filter(item => !bigcommerceUtils.isGiftCertificate(item))

    if (transaction && isValidArray(data)) {
      productsDetail = await fetchProductsDetailBySku(data)
    }

    const transactionDetails = {
      total_inc_tax: orderData?.total_inc_tax,
      total_tax: orderData?.total_tax,
      ...(transaction || {})
    }

    const orderConfirmationData = {
      ...extractAdditionalFields(confirmationData.data),
      ...orderData,
      transaction: transactionDetails,
      shippingAddress: shippingData,
      products: productsData,
      coupons: couponsData,
      couponIds,
      productsDetail
    }

    const paymentMethodType = getState()?.cart?.paymentMethod?.type || 'unknown'

    if (!orderConfirmationData.payment_method) {
      orderConfirmationData.payment_method = paymentMethodType
      if (paymentMethodType === 'credit-paypal' || paymentMethodType.toLowerCase().includes('apple')) {
        orderConfirmationData.payment_method = 'Braintree'
      }
    }

    if (transaction && isValidArray(data)) {
      gaEvents.makePurchase(orderConfirmationData)
      fbEvents.logPurchase(orderConfirmationData, customerAccount)
      tealiumEvents.addProductPurchaseIndividual(orderConfirmationData, customerAccount)
      emarsysEvents.trackPurchase(orderConfirmationData)
      emarsysEvents.trackCustomPurchase(orderConfirmationData)
      branchEvents.trackPurchase({ orderConfirmationData, customerAccount })
      partnerizeService.completeConversion(orderConfirmationData, customerAccount)
    }

    if (deleteCheckoutData) {
      await dispatch(deleteCheckout())
    }

    await dispatch(module.actions.orderConfirmation(orderConfirmationData))
    return orderConfirmationData
  }
}

const subscribeToWaitlist = ({ userEmail, epi, empi, du }) => async dispatch => {
  const params = new URLSearchParams()

  params.append('medium', 'email')
  params.append('mediumvalue', userEmail)
  params.append('addtomailinglist', 1)
  params.append('topics', JSON.stringify(['backinstock']))
  params.append('products', JSON.stringify([{ epi, empi, du }]))

  const response = await apiPost(`${envConfig.siteUrl}storeadmin/bispa/subscriptions/create`, params)

  if (response?.status === 200) {
    return response
  }
}

const fetchRecentlyOrderedProducts = () => async (dispatch, getState) => {
  const response = await dispatch(
    requestGet('/ecommerce/catalog/products/recently-ordered', {}, { name: 'fetchRecentlyOrderedProducts' })
  )
  let products = getIn(response, 'value.data.data')

  if (isValidArray(products)) {
    products = products.filter(product => product.availability === 'available' && product.inventory_level > 0)
    products = products.slice(0, 10).map(product => product.sku)

    await dispatch(module.actions.recentlyOrderedProducts(products))
  }

  return products
}

/**
 * save promotions ids to state
 *
 * @param state
 * @param newState
 * @param action
 * @returns {*&{couponIds: []}}
 */
const reduceCouponsIds = (state, newState, action) => {
  const { payload: items } = action
  const newCouponIdsState =
    (isValidArray(items) && items.filter(item => item.redemption_type === 'coupon').map(item => Number(item.id))) || []

  return {
    ...newState,
    couponIds: newCouponIdsState
  }
}
/**
 * filter out promotions if that do not meet the the min spend condition
 *
 * @param state
 * @param newState
 * @param action
 * @returns {*&{promotions: []}}
 */

const reducePromotions = (state, newState, action) => {
  let { cartAmount, items } = action

  cartAmount = parseFloat(cartAmount || 0)
  let newPromotionsState = []

  if (cartAmount >= 0 && isValidArray(items)) {
    newPromotionsState = items.filter(item => {
      const condition = getIn(item, 'rules.0.conditions.0')
      if (condition && condition.condition_type === 'CartCondition') {
        return cartAmount >= condition.minimum_spend
      }
      return true
    })
  }
  return { ...newState, promotions: newPromotionsState }
}

const reduceRecentlyOrderedProducts = (state, newState, action) => ({
  ...newState,
  recentlyOrderedProducts: {
    skus: action.payload || [],
    fetchedAt: now()
  }
})

const actionCreators = {
  request: asyncRequest,
  billingAddress,
  newBillingAddress,
  checkout,
  cartItemsProductDetail,
  paymentTypes,
  paymentCardDetails,
  orderConfirmation,
  customerOrders,
  addedToCartItems,
  promotionItems,
  promotions,
  paymentMethod,
  checkoutOrder,
  productPending,
  backordersItems,
  recentlyOrderedProducts,
  couponIds: actionPayload(payload => payload),
  cartItemsInventory: actionPayload(payload => payload),
  giftCertificates: actionPayload(payload => payload),
  storeCredits: actionPayload(payload => payload)
}

const actions = {
  storeCheckout,
  deleteCheckout,
  fetchCheckout,
  fetchStoredCheckout,
  addProductBySku,
  addProductsBySku,
  fetchCartItemsInventory,
  addAddress: payload => checkoutActions.addAddress(payload),
  addShippingOption: payload => checkoutActions.addShippingOption(payload),
  processAfterpayPayment: payload => checkoutActions.processAfterpayPayment(payload),
  processKlarnaPayment: payload => checkoutActions.processKlarnaPayment(payload),
  processPayment: payload => checkoutActions.processPayment(payload),
  selectPaymentMethod: payload => checkoutActions.selectPaymentMethod(payload),
  fetchBraintreeClientConfig: payload => checkoutActions.fetchBraintreeClientConfig(payload),
  fetchAvailableShippingOptions: payload => checkoutActions.fetchAvailableShippingOptions(payload),
  processGiftCertificates: payload => checkoutActions.processGiftCertificates(payload),
  processStoreCredits: payload => checkoutActions.processStoreCredits(payload),
  fetchOrder,
  deleteOrderData,
  addCustomerToCart,
  fetchCustomerOrders,
  changeLineItemQuantity,
  removeLineItem,
  removeLineItems,
  removeInvalidCartItems,
  addCouponToCart,
  fetchPromotion,
  subscribeToWaitlist,
  addGiftCertificateAsLineItem,
  addLineItems,
  fetchCatalogProductsBySku,
  getUnavailableCartItems,
  getInvalidGiftItems,
  fetchRecentlyOrderedProducts,
  fetchPromotionBannerProducts,
  addGiftCertificateToCart,
  fetchGiftCertificatesDetails,
  removeGiftCertificateFromState,
  updateValidGiftCertificates,
  getInvalidGiftCertificates,
  updateStoreCredits
}

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)
const requestActions = createRequestActions(module, {
  useRemoteLog: true
  // onError: displayCartError
})
const { requestPut, requestGet, requestPost, requestDelete, displayError, requestAction } = requestActions
const checkoutActions = createCheckoutActions({
  module,
  requestActions,
  getCheckoutId
})

const reducer = (state, action) => {
  let newState = module.reducer(state, action)
  if (action.type === 'AUTH_RESET') {
    return { ...initialState }
  }
  if (action.type === `${namespace}/promotionItems`) {
    newState = reduceCouponsIds(state, newState, action)
  }
  if (action.type === `cart/checkout`) {
    const cartAmount = action?.payload?.grand_total
    const items = state.promotionItems
    newState = reducePromotions(state, newState, { cartAmount, items })
  }
  if (action.type === `${namespace}/promotionItems`) {
    const cartAmount = newState?.checkout?.grand_total
    const items = action.payload
    newState = reducePromotions(state, newState, { cartAmount, items })
  }
  if (action.type === `${namespace}/recentlyOrderedProducts`) {
    newState = reduceRecentlyOrderedProducts(state, newState, action)
  }
  return newState
}

export default { namespace, actions: module.actions, reducer }
