import analytics from '@react-native-firebase/analytics'
import { sha256 } from 'js-sha256'
import envConfig from '../config/envConfig'
import { isIos } from '../utils/device'
import { getIn } from '../utils/getIn'
import { isValidNumber } from '../utils/validation'

const logEvent = (name, params) => {
  if (envConfig.enableGaLogger) {
    const color = '#9cf17e'
    console.info(`%canalytics().logEvent ${name}`, `color:${color}`, params)
  }
  return analytics().logEvent(name, params)
}

const getTotalAmount = data => {
  const totalAmount = getIn(data, 'order_amount') || getIn(data, 'amount') || getIn(data, 'total_inc_tax')

  return isValidNumber(totalAmount) ? Number(totalAmount) : 0
}

const getTotalTax = data => {
  const totalTax = getIn(data, 'total_tax')

  return isValidNumber(totalTax) ? Number(totalTax) : 0
}

const addToCart = productsData => {
  const products = Array.isArray(productsData) ? productsData : [productsData]
  const items = products.map(productData => ({
    item_brand: productData?.brand_name || undefined,
    item_category: productData?.categories?.[0]?.title || undefined,
    item_id: productData?.product_id ? `${productData?.product_id}` : undefined,
    item_list_id: productData?.categories?.[0]?.id ? `${productData?.categories?.[0]?.id}` : undefined,
    item_list_name: productData?.categories?.[0]?.title || undefined,
    item_location_id: undefined,
    item_name: productData?.name || undefined,
    item_variant: productData?.size || undefined,
    quantity: 1,
    price: Number(productData.price) || undefined
  }))
  const value = products.reduce((total, productData) => total + Number(productData.price), 0)

  logEvent('add_to_cart', {
    currency: envConfig.currencyCode,
    value,
    items
  })
}

const removeFromCart = productData => {
  const removeFromCartObj = {
    currency: envConfig.currencyCode,
    value: Number(productData.price) || 0,
    items: [
      {
        item_brand: productData?.brand_name || undefined,
        item_category: productData?.categories?.[0]?.title || undefined,
        item_id: productData?.product_id ? `${productData?.product_id}` : undefined,
        item_list_id: productData?.categories?.[0]?.id ? `${productData?.categories?.[0]?.id}` : undefined,
        item_list_name: productData?.categories?.[0]?.title || undefined,
        item_location_id: undefined,
        item_name: productData?.name || undefined,
        item_variant: productData?.size || undefined
      }
    ]
  }
  try {
    analytics().logRemoveFromCart(removeFromCartObj)
  } catch (error) {
    console.warn('removeFromCart', error, removeFromCartObj)
  }
}

const composeEventInfo = async (checkoutCartData, products) => {
  const cartItems = checkoutCartData.line_items.physical_items
  let cartItemValue = 0
  let cartDiscountValue = 0
  try {
    cartItemValue = cartItems.reduce((sum, product) => sum + product.list_price * product.quantity, 0)
  } catch (error) {
    console.warn('61', 'composeEventInfo', 'cartItemValue', error)
  }
  try {
    cartDiscountValue = checkoutCartData.discounts.reduce((sum, discount) => sum + discount.discounted_amount, 0)
  } catch (error) {
    console.warn('61', 'composeEventInfo', 'cartDiscountValue', error)
  }

  const eventInfo = {
    currency: envConfig.currencyCode,
    value: cartItemValue - cartDiscountValue,
    items: cartItems.map(product => {
      if (products?.length) {
        const productInfo = products.find(item => item.productSku.includes(product.sku))
        if (productInfo) {
          return {
            item_id: productInfo.product_id,
            item_name: product.name,
            item_category: productInfo.category_name ? productInfo.category_name[0] : '',
            item_variant: productInfo.size,
            item_brand: productInfo.brand_name,
            price: Number(product.list_price),
            quantity: product.quantity
          }
        }
        return {}
      }

      return {
        item_name: product.name,
        price: Number(product.list_price),
        quantity: product.quantity
      }
    })
  }
  return eventInfo
}

const makePurchase = ({ id, transaction, coupons, products, productsDetail, is_returning_customer }) => {
  const couponCodes = coupons?.map(({ code }) => code)?.join(', ') || ''

  const eventInfo = {
    transaction_id: `${id}`,
    affiliation: 'Adore Beauty',
    transaction_revenue: getTotalAmount(transaction), // Total Revenue
    transaction_tax: getTotalTax(transaction),
    transaction_shipping: transaction.shipping_cost_inc_tax ? Number(transaction.shipping_cost_inc_tax) : 0,
    transaction_coupon_code: couponCodes,
    transaction_currency: envConfig.currencyCode,
    currency: envConfig.currencyCode,
    value: getTotalAmount(transaction), // Total Revenue
    tax: getTotalTax(transaction),
    shipping: transaction.shipping_cost_inc_tax ? Number(transaction.shipping_cost_inc_tax) : 0,
    coupon: couponCodes
  }

  logEvent('transaction', eventInfo)
  const purchaseObj = {
    affiliation: 'Adore Beauty',
    coupon: couponCodes,
    currency: envConfig.currencyCode || undefined,
    transaction_id: id ? `${id}` : undefined,
    shipping: transaction.shipping_cost_inc_tax ? Number(transaction.shipping_cost_inc_tax) : undefined,
    tax: getTotalTax(transaction),
    value: getTotalAmount(transaction), // Total Revenue
    revenue: getTotalAmount(transaction),
    items: []
  }

  products.forEach(product => {
    if (productsDetail.length) {
      const productInfo = productsDetail.find(item => item.productSku.includes(product.sku)) || {}
      const productPurchaseObj = {
        item_id: productInfo.product_id || undefined,
        item_name: productInfo.name || undefined,
        item_category: productInfo.category_name?.[0] || undefined,
        item_variant: productInfo.size || undefined,
        item_brand: productInfo.brand_name || undefined,
        price: Number(productInfo.price) || undefined,
        quantity: Number(product.quantity) || undefined,
        item_brand_id: productInfo.brand_id || undefined,
        currency: envConfig.currencyCode || undefined
      }

      purchaseObj.items.push(productPurchaseObj)
    }
  })

  logEvent('purchase', purchaseObj)
  logEvent(is_returning_customer ? 'existing_customer' : 'new_customer')
}

const viewCart = async (checkoutCartData, products) => {
  const eventInfo = await composeEventInfo(checkoutCartData, products)
  logEvent('view_cart', eventInfo)
}

const beginCheckout = async (checkoutCartData, products) => {
  const composedEventInfo = await composeEventInfo(checkoutCartData, products)
  const eventInfo = {
    ...composedEventInfo,
    coupon: checkoutCartData.coupons.length ? checkoutCartData.coupons.map(coupon => coupon.code).join(',') : ''
  }

  logEvent('begin_checkout', eventInfo)
}

const addShippingInfo = async (checkoutCartData, deliveryOption, shippingCost, products) => {
  const composedEventInfo = await composeEventInfo(checkoutCartData, products)
  const eventInfo = {
    ...composedEventInfo,
    coupon: checkoutCartData.coupons.length ? checkoutCartData.coupons.map(coupon => coupon.code).join(',') : '',
    shipping_tier: deliveryOption.name,
    value: composedEventInfo.value + Number(shippingCost)
  }

  logEvent('add_shipping_info', eventInfo)
}

const addPaymentInfo = async (checkoutCartData, paymentType, products) => {
  const composedEventInfo = await composeEventInfo(checkoutCartData, products)
  const eventInfo = {
    ...composedEventInfo,
    coupon: checkoutCartData.coupons.length ? checkoutCartData.coupons.map(coupon => coupon.code).join(',') : '',
    payment_type: paymentType
  }

  logEvent('add_payment_info', eventInfo)
}

const loginEvent = method => {
  logEvent('login', { method })
}

const signupEvent = method => {
  logEvent('sign_up', { method })
}

const shareEvent = (contentType, method, itemId = null) => {
  const eventData = {
    content_type: contentType,
    method
  }

  if (itemId) {
    eventData.item_id = itemId
  }

  logEvent('share', eventData)
}

const setUserId = id => {
  analytics().setUserId(sha256(id))
}

const viewItem = productData => {
  const viewItemObj = {
    currency: envConfig.currencyCode,
    value: Number(productData.price) || 0,
    items: [
      {
        item_brand: productData?.brand_name || undefined,
        item_brand_id: productData?.brand_id || undefined,
        item_category: productData?.categories?.[0]?.title || undefined,
        item_id: productData?.product_id ? `${productData?.product_id}` : undefined,
        item_list_id: productData?.categories?.[0]?.id ? `${productData?.categories?.[0]?.id}` : undefined,
        item_list_name: productData?.categories?.[0]?.title || undefined,
        item_location_id: undefined,
        item_name: productData?.name || undefined,
        item_variant: productData?.size || undefined
      }
    ]
  }

  logEvent('view_item', viewItemObj)
}

const trackBrand = brand => {
  logEvent('view_brand', {
    name: brand
  })
}

const logContentView = articleData => {
  const viewItemObj = {
    items: [
      {
        item_name: articleData?.name || undefined,
        item_id: articleData?.sysId || undefined,
        item_variant: articleData?.type || undefined
      }
    ]
  }
  logEvent('content_view', viewItemObj)
}

const addPromoCode = (code, isValid) => {
  const viewItemObj = {
    name: code,
    isValid
  }
  logEvent('add_promo_code', viewItemObj)
}

const addGiftCertificateCode = (code, isValid) => {
  const viewItemObj = {
    name: code,
    isValid
  }
  logEvent('add_gift_certificate_code', viewItemObj)
}

const trackTrackingTransparency = status => {
  logEvent('allow_tracking_alert', {
    status
  })
}

const addForceAppUpdate = (button, type) => {
  const eventInfo = {
    button_chosen: button,
    update_type: type
  }

  logEvent('force_app_update', eventInfo)
}

const screenView = (screenClass, screenName) =>
  analytics().logScreenView({
    screen_class: screenClass,
    screen_name: screenName
  })

const trackShopBy = button => {
  const eventInfo = {
    button_chosen: button
  }

  logEvent('shop_by', eventInfo)
}

const trackAudioPlayer = button => {
  const eventInfo = {
    button_chosen: button,
    player: isIos() ? 'CustomPlayer1' : 'CustomPlayer2'
  }

  logEvent('audio_player', eventInfo)
}

const trackDeepLink = params => {
  const eventInfo = Object.keys(params).reduce(
    (pre, cur) => ({
      ...pre,
      [cur.replace('utm_', '')]: params[cur]
    }),
    {}
  )
  logEvent('deep_link', eventInfo)
}

const trackHomePromoBar = () => {
  logEvent('promo_home_bar')
}

const trackSearchTap = () => {
  logEvent('search')
}

const setUserProperty = (name, value) => {
  analytics().setUserProperty(name, value)
}

const trackReturningCustomer = eventName => {
  logEvent(eventName)
}

export const gaEvents = {
  addToCart,
  removeFromCart,
  makePurchase,
  viewCart,
  beginCheckout,
  addShippingInfo,
  addPaymentInfo,
  loginEvent,
  signupEvent,
  setUserId,
  viewItem,
  trackBrand,
  logContentView,
  addPromoCode,
  addGiftCertificateCode,
  shareEvent,
  trackTrackingTransparency,
  addForceAppUpdate,
  screenView,
  trackShopBy,
  trackAudioPlayer,
  trackDeepLink,
  trackHomePromoBar,
  trackReturningCustomer,
  trackSearchTap,
  setUserProperty
}
