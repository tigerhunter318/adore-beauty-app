import { deepEqual } from 'fast-equals'
import envConfig from '../../../config/envConfig'
import addressUtil from '../../../utils/addressUtil'
import { getAsyncStorageItem, setAsyncStorageItem } from '../../../utils/asyncStorage'
import { getIn } from '../../../utils/getIn'
import { isValidArray, isValidObject } from '../../../utils/validation'

const createCheckoutActions = (props = {}) => {
  const { module } = props
  const {
    namespace,
    actions: { storeCheckout, fetchOrder }
  } = props.module
  const { requestPut, requestGet, requestPost, displayError } = props.requestActions
  const { getCheckoutId } = props

  // * Checkout Step 1 - Add Address

  const addAddress = data => async (dispatch, getState) => {
    const { address, requestConfig } = data
    const { addressMeta, ...params } = address || {}
    const addressDetailsData = { addressMeta, ...params }
    const {
      customer: { account }
    } = getState()

    if (!isValidObject(addressMeta) || !isValidObject(params)) return null

    const payload = {
      first_name: params.firstName,
      last_name: params.lastName,
      email: account.email,
      address1: addressMeta.address_line_1,
      address2: addressMeta.address_line_2,
      city: addressMeta.locality_name,
      state_or_province_code: addressMeta.state_territory,
      state_or_province: '',
      postal_code: addressMeta.postcode,
      phone: params.phone,
      country: envConfig.country,
      country_code: envConfig.countryCode
    }

    const formattedAddress = addressUtil.normaliseAddress(payload)

    if (!addressUtil.validateAddress(formattedAddress)) return null

    const cartId = getCheckoutId(getState)

    if (cartId) {
      const oldBillingAddress = await getAsyncStorageItem(`${namespace}.billingAddress`)
      if (!deepEqual(oldBillingAddress, addressDetailsData)) {
        dispatch(module.actions.newBillingAddress(true))
      }

      await setAsyncStorageItem(`${namespace}.billingAddress`, addressDetailsData)
      dispatch(module.actions.billingAddress(addressDetailsData))

      const endpoint = `/ecommerce/checkouts/${cartId}/billing-address?include=consignments.available_shipping_options`

      const response = await dispatch(requestPost(endpoint, formattedAddress, requestConfig))

      let checkoutData = getIn(response, 'value.data.data')
      if (checkoutData && checkoutData.id) {
        await dispatch(storeCheckout(checkoutData))
        const shippingAddress = getIn(checkoutData, 'billing_address')
        checkoutData = await dispatch(fetchAvailableShippingOptions({ shippingAddress, requestConfig }))

        if (checkoutData && checkoutData.id) {
          await dispatch(storeCheckout(checkoutData))
          return checkoutData
        }
      }
    }
  }

  const fetchAvailableShippingOptions = ({ shippingAddress, requestConfig = {} }) => async (dispatch, getState) => {
    const { cart: cartState } = getState()
    const cartId = getCheckoutId(getState)
    const checkoutData = cartState?.checkout

    const lineItems = getIn(checkoutData, 'cart.line_items.physical_items') || []
    const giftCertificates = getIn(checkoutData, 'cart.line_items.gift_certificates') || []

    const cartItems = [...lineItems, ...giftCertificates]

    const payload = {
      shipping_address: shippingAddress,
      line_items: cartItems.map(o => ({ item_id: o.id, quantity: o.quantity || 1 }))
    }

    const consignment = checkoutData?.consignments?.find(item => !!item?.available_shipping_options?.length)
    let endpoint
    let response

    if (consignment) {
      endpoint = `/ecommerce/checkouts/${cartId}/consignments/${consignment.id}?include=consignments.available_shipping_options`
      response = await dispatch(requestPut(endpoint, payload, requestConfig))
    } else {
      endpoint = `/ecommerce/checkouts/${cartId}/consignments?include=consignments.available_shipping_options`
      response = await dispatch(requestPost(endpoint, [payload], requestConfig))
    }
    return getIn(response, 'value.data.data')
  }

  // * Checkout Step 2 - Add Shipping

  const addShippingOption = data => async (dispatch, getState) => {
    const { shippingOption, requestConfig } = data
    const { consignmentId, shippingId } = shippingOption || {}
    const { cart: cartState } = getState()
    const cartId = getCheckoutId(getState)

    const consignments = cartState?.checkout?.consignments || []
    const endpoint = `/ecommerce/checkouts/${cartId}/consignments/${consignmentId}`
    const payload = { shipping_option_id: shippingId }
    const response = await dispatch(requestPut(endpoint, payload, requestConfig))
    const checkoutData = getIn(response, 'value.data.data')
    const statusCode = getIn(response, 'value.status')

    if (checkoutData && checkoutData.id) {
      const nextCheckoutData = {
        ...checkoutData,
        consignments
      }
      await dispatch(storeCheckout(nextCheckoutData))
      return getState().cart.checkout
    }
    if (statusCode === 200 && requestConfig?.onError) {
      requestConfig.onError()
    }
  }

  // * Checkout Step 3a - Add Session

  const createOrder = requestConfig => async (dispatch, getState) => {
    const cartId = getCheckoutId(getState)
    const { cart: cartState } = getState()
    let orderId = null
    let orderToken = null
    const isExistingOrder = false // cartState?.checkoutOrder?.cart_id === checkoutData.id && !cartState?.newBillingAddress
    if (isExistingOrder) {
      // use existing order
      orderId = cartState.checkoutOrder.id
      orderToken = cartState.checkoutOrder['X-Order-Token']
    } else {
      // create order
      const response = await dispatch(requestPost(`/ecommerce/checkouts/${cartId}/orders`, {}, requestConfig))
      const orderData = getIn(response, 'value.data.data')
      await dispatch(module.actions.checkoutOrder(orderData))
      dispatch(module.actions.newBillingAddress(false))
      orderId = orderData?.id
      orderToken = orderData?.['X-Order-Token']
    }
    return {
      id: orderId,
      'X-Order-Token': orderToken
    }
  }

  // * Checkout Step 3b - Add Session

  const selectPaymentMethod = ({ activePaymentMethod, requestConfig }) => async (dispatch, getState) => {
    if (activePaymentMethod === 'credit-paypal') {
      const clientConfig = await dispatch(fetchBraintreeClientConfig())
      if (clientConfig) {
        await dispatch(module.actions.paymentMethod({ type: activePaymentMethod, clientConfig }))
        return { success: true }
      }
    }
    if (activePaymentMethod === 'afterpay') {
      const response = await dispatch(createAfterpaySession({ requestConfig }))
      if (response?.token) {
        return { success: true }
      }
    }
    // else if (activePaymentMethod === 'klarna') {
    //   const response = await dispatch(createKlarnaSession({ requestConfig }))
    //   if (response) {
    //     return { success: true }
    //   }
    // }

    return { success: false }
  }

  const fetchBraintreeClientConfig = () => async (dispatch, getState) => {
    const cartId = getCheckoutId(getState)

    const endpoint = `/ecommerce/payments/braintree/token?cart_id=${cartId}`
    const response = await dispatch(requestGet(endpoint))
    const data = response?.value?.data?.data
    if (data) {
      const clientToken = data?.clientToken || data?.tokenization_key
      if (clientToken) {
        const result = { ...data, clientToken }
        delete result.tokenization_key
        return result
      }
    }
    if (response) {
      dispatch(displayError(new Error('Unable to retrieve payment client token')))
    }
  }

  const createKlarnaSession = ({ requestConfig }) => async (dispatch, getState) => {
    const activePaymentMethod = 'klarna'
    const { cart: cartState } = getState()
    const checkout_id = getCheckoutId(getState)
    const paymentOrder = await dispatch(preparePaymentOrder({ requestConfig }))
    const orderId = paymentOrder?.orderId
    if (!orderId) {
      return null
    }

    const session_id = cartState?.paymentMethod?.session_id
    const endpoint = `/ecommerce/payments/klarna/sessions`
    const payload = { checkout_id }
    if (session_id) {
      payload.session_id = session_id
    }
    const response = await dispatch(requestPost(endpoint, { checkout_id, session_id }))

    const klarnaData = response?.value?.data
    await dispatch(
      module.actions.paymentMethod({
        type: activePaymentMethod,
        ...klarnaData
      })
    )
    return klarnaData
  }

  const createAfterpaySession = ({ requestConfig }) => async (dispatch, getState) => {
    const activePaymentMethod = 'afterpay'
    const checkout_id = getCheckoutId(getState)
    const paymentOrder = await dispatch(preparePaymentOrder({ requestConfig }))
    const orderId = paymentOrder?.orderId
    if (!orderId) {
      return null
    }

    const redirect_url = envConfig.afterpayUrl
    const endpoint = `/ecommerce/payments/afterpay`
    const response = await dispatch(requestPost(endpoint, { checkout_id, redirect_url }))
    const afterPayData = response?.value?.data

    if (afterPayData && afterPayData.token) {
      await dispatch(
        module.actions.paymentMethod({
          type: activePaymentMethod,
          ...afterPayData
        })
      )
      return afterPayData
    }
  }

  // * Checkout Step 4 - Process Payment

  const processGiftCertificates = ({ requestConfig, orderId }) => async (dispatch, getState) => {
    const { cart: cartState } = getState()
    const cartId = getCheckoutId(getState)
    const giftCertificates = cartState?.giftCertificates

    const processPaymentWithGiftCode = async ({ code }) => {
      const payload = {
        checkout_id: cartId,
        gift_card_code: code,
        order_id: orderId
      }
      const response = await dispatch(requestPost(`/ecommerce/payments/gift_certificate`, payload, requestConfig))
      return response?.value?.data?.data
    }

    let success
    let orderInComplete
    let giftCardPaymentData

    const processNextCode = async index => {
      const response = await processPaymentWithGiftCode(giftCertificates[index])

      if (!isValidObject(response)) return

      const { transaction, order } = response
      success = transaction.status === 'success'
      orderInComplete = order.status === 'Incomplete' && !order.payment_method

      if (success && orderInComplete && index + 1 < giftCertificates.length) {
        await processNextCode(index + 1)
      }

      if (success && !orderInComplete) {
        giftCardPaymentData = response
      }
    }

    await processNextCode(0)

    return {
      success,
      orderInComplete,
      giftCardPaymentData
    }
  }

  const processStoreCredits = ({ requestConfig, orderId }) => async (dispatch, getState) => {
    const cartId = getCheckoutId(getState)
    let success
    let orderInComplete
    let storeCreditPaymentData

    const processPaymentWithStoreCredits = async () => {
      const payload = {
        checkout_id: cartId,
        order_id: orderId
      }
      const response = await dispatch(requestPost(`/ecommerce/payments/store_credit`, payload, requestConfig))

      return response?.value?.data?.data
    }

    const processNextCode = async () => {
      const response = await processPaymentWithStoreCredits()

      if (!isValidObject(response)) return

      const { transaction, order } = response
      success = transaction.status === 'success'
      orderInComplete = order.status === 'Incomplete' && !order.payment_method

      if (success && !orderInComplete) {
        storeCreditPaymentData = response
      }
    }

    await processNextCode()

    return {
      success,
      orderInComplete,
      storeCreditPaymentData
    }
  }

  const preparePaymentOrder = ({ requestConfig }) => async (dispatch, getState) => {
    const { cart: cartState } = getState()

    const existingOrderId = cartState?.checkoutOrder?.id
    if (existingOrderId) {
      return { orderId: existingOrderId }
    }

    const order = await dispatch(createOrder(requestConfig))
    const orderId = order?.id
    if (!orderId && !requestConfig?.onError) {
      dispatch(displayError(new Error('An order id is required for payment')))
    }

    const result = { orderId }

    if (!!cartState.storeCredits && orderId) {
      try {
        const { success, orderInComplete, storeCreditPaymentData } = await dispatch(
          processStoreCredits({ requestConfig, orderId })
        )
        if (success) {
          result.orderComplete = !orderInComplete
          result.storeCreditPaymentData = storeCreditPaymentData
        }
        if (!success) {
          return null
        }
      } catch (error) {
        //
        return null
      }
    }

    if (isValidArray(cartState?.giftCertificates) && orderId) {
      try {
        const { success, orderInComplete, giftCardPaymentData } = await dispatch(
          processGiftCertificates({ requestConfig, orderId })
        )
        if (success) {
          result.orderComplete = !orderInComplete
          // TODO consider only return transaction data for one
          result.storeCreditPaymentData = giftCardPaymentData
        }
        if (!success) {
          return null
        }
      } catch (error) {
        //
        return null
      }
    }

    return result
  }

  // * Credit Card / Paypal / Apple Pay

  const processPayment = ({ nonce, requestConfig, fetchOrderOnSuccess }) => async (dispatch, getState) => {
    const paymentOrder = await dispatch(preparePaymentOrder({ requestConfig }))
    const { orderId, orderComplete, giftCardPaymentData, storeCreditPaymentData } = paymentOrder || {}
    let paymentData = null

    if (orderId && orderComplete && storeCreditPaymentData?.transaction?.id) {
      paymentData = {
        ...storeCreditPaymentData.transaction,
        orderId,
        success: storeCreditPaymentData.transaction.status === 'success'
      }
    } else if (orderId && orderComplete && giftCardPaymentData?.transaction?.id) {
      paymentData = {
        ...giftCardPaymentData.transaction,
        orderId,
        success: giftCardPaymentData.transaction.status === 'success'
      }
    } else if (nonce && orderId) {
      const payload = {
        order_id: orderId,
        nonce
      }
      const response = await dispatch(requestPost(`/ecommerce/payments`, payload, requestConfig))
      paymentData = getIn(response, 'value.data')
    } else {
      return null
    }

    if (paymentData?.success) {
      if (fetchOrderOnSuccess) {
        await dispatch(fetchOrder(orderId, paymentData, true))
      }
      return paymentData
    }
    if (requestConfig.onError) {
      requestConfig.onError(paymentData)
    } else {
      dispatch(displayError(paymentData))
    }
    return null
  }

  // * Afterpay

  const processAfterpayPayment = ({ orderToken, requestConfig }) => async (dispatch, getState) => {
    const { cart: cartState } = getState()
    const orderId = cartState?.checkoutOrder?.id
    const cartId = getCheckoutId(getState)
    const payload = {
      status: 'SUCCESS',
      orderToken
    }

    const response = await dispatch(requestPost(`/ecommerce/payments/afterpay/${cartId}`, payload, requestConfig))
    const paymentData = getIn(response, 'value.data') || {}

    if (paymentData?.status === 'APPROVED') {
      await dispatch(fetchOrder(orderId, paymentData, true))
      return paymentData
    }

    if (requestConfig?.onError) {
      requestConfig.onError(paymentData)
    } else {
      dispatch(displayError(paymentData))
    }

    return null
  }

  // * Klarna

  const processKlarnaPayment = ({ authToken, requestConfig }) => async (dispatch, getState) => {
    const { cart: cartState } = getState()
    const orderId = cartState?.checkoutOrder?.id
    const cartId = getCheckoutId(getState)
    const payload = {
      authorization_token: authToken
    }

    const response = await dispatch(requestPost(`/ecommerce/payments/klarna/${cartId}`, payload, requestConfig))
    const paymentData = getIn(response, 'value.data')

    if (paymentData?.status === 'SUCCESS') {
      await dispatch(fetchOrder(orderId, paymentData, true))
      return paymentData
    }
    if (requestConfig?.onError) {
      requestConfig.onError(paymentData)
    } else {
      dispatch(displayError(paymentData))
    }

    return null
  }

  return {
    addAddress,
    addShippingOption,
    processAfterpayPayment,
    processKlarnaPayment,
    processPayment,
    selectPaymentMethod,
    fetchBraintreeClientConfig,
    fetchAvailableShippingOptions,
    processGiftCertificates,
    processStoreCredits
  }
}

export default createCheckoutActions
