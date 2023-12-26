import { gaEvents } from '../../services/ga'
import { setUserToken } from '../../utils/userToken'
import { actionPayload, createActionsReducer } from '../utils/createActionsReducer'
import { getIn } from '../../utils/getIn'
import { deleteAsyncStorageItem, getAsyncStorageItem, setAsyncStorageItem } from '../../utils/asyncStorage'
import cart from './cart'
import { asyncRequest, createRequestActions } from './utils/requestAction'
import envConfig from '../../config/envConfig'
import wishlists from './wishlists'
import { fbEvents } from '../../services/facebook'
import { emarsysService } from '../../services/emarsys/emarsys'
import { secondsFromNow } from '../../utils/date'
import addressUtil from '../../utils/addressUtil'
import { osName } from '../../utils/device'
import { setCustomerCountryStoreValue } from '../../utils/setCustomerCountryStoreValue'
import { smartlook } from '../../services/smartlook'
import branchEvents from '../../services/branch/branchEvents'
import remoteLog from '../../services/remoteLog'
import { deleteLocalAuth } from './utils/deleteLocalAuth'

const namespace = 'customer'
const initialState = {
  request: null,
  account: null,
  addresses: [],
  defaultAddress: null,
  preferences: null,
  shouldShowSocietyJoinModal: null,
  loyalty: null,
  isConsentGiven: null,
  giftCertificates: null,
  storeCredits: null
}

const isNewCustomer = ({ created_at: createdAt }) => secondsFromNow(createdAt) < 60

const verifyEmail = payload => async (dispatch, getState) => {
  const endpoint = `customers/verification?email=${payload.email}`
  const response = await dispatch(requestPost(endpoint))
  await dispatch(module.actions.account(payload))
  return reponseData(response)
}
/**
 * store the customer and add there details to the cart
 *
 * @param customerData
 * @returns {function(*, *): *}
 */
const customerLoginSuccess = (customerData, loginMethod) => async (dispatch, getState) => {
  let result = null

  if (customerData.isGuest) {
    result = await dispatch(storeCustomer({ ...customerData, hasGuestOrder: true, isGuest: undefined }))
  } else {
    result = await dispatch(storeCustomer(customerData))
  }

  await dispatch(cart.actions.addCustomerToCart())

  if (result) {
    await setAsyncStorageItem('lastLoginMethod', loginMethod)
  }
  if (customerData.isNewCustomer) {
    branchEvents.trackSignup(customerData, { loginMethod })
  } else {
    branchEvents.trackLogin(customerData, { loginMethod })
  }
  if (!customerData.has_joined_loyalty) {
    await dispatch(module.actions.shouldShowSocietyJoinModal(true))
  }
  return result
}

const signup = payload => async (dispatch, getState) => {
  const endpoint = payload.magento_exists ? `/customers/existing` : `/customers`
  const response = await dispatch(requestPost(endpoint, setCustomerCountryStoreValue(payload)))
  const data = reponseData(response)
  const customerData = data?.customer
  const method = 'email'
  if (customerData) {
    customerData.isNewCustomer = true
    gaEvents.signupEvent('email')
    fbEvents.logSignUp({ ...customerData })
    const result = await dispatch(customerLoginSuccess(customerData, method))
    return result
  }
}
const login = payload => async (dispatch, getState) => {
  const response = await dispatch(requestPost('auth/login', payload))
  const data = reponseData(response)
  const customerData = data?.customer
  const method = 'email'
  if (customerData) {
    customerData.isNewCustomer = false
    gaEvents.loginEvent('email')
    fbEvents.logSignIn({ ...customerData, method })
    const result = await dispatch(customerLoginSuccess(customerData, method))
    return result
  }
}

const loginSocial = (type = 'facebook', payload) => async (dispatch, getState) => {
  const response = await dispatch(requestPost(`auth/social/${type}`, setCustomerCountryStoreValue(payload)))
  const data = reponseData(response)
  const customerData = data?.customer
  const method = type
  if (customerData) {
    customerData.isNewCustomer = isNewCustomer(customerData)
    if (customerData.isNewCustomer) {
      gaEvents.signupEvent('email')
      fbEvents.logSignUp({ ...customerData, method })
    } else {
      gaEvents.loginEvent(type)
      fbEvents.logSignIn({ ...customerData, method })
    }
    const result = await dispatch(customerLoginSuccess(customerData, method))
    return result
  }
}

const logout = (endpoint = 'auth/logout') => async (dispatch, getState) => {
  const onError = error => console.warn('logout', 'error', error)

  if (endpoint) {
    await dispatch(requestPost(endpoint, {}, { onError }))
  }

  await dispatch(deleteLocalAuth())
}

const deleteAccount = (customerId, password, requestConfig) => async (dispatch, getState) => {
  const endpoint = `/customers/${customerId}`
  const response = await dispatch(requestDelete(endpoint, { password }, requestConfig))
  const data = getIn(response, 'value.data')

  if (data) {
    await dispatch(logout(null))

    return data
  }
}

const authRefresh = () => async (dispatch, getState) => {
  const response = await dispatch(requestPost('auth/refresh', {}))
  const data = reponseData(response)
  if (data && data.customer) {
    const result = await dispatch(storeCustomer(data.customer))
    return result
  }
}
/*
 const response = await vapourApi.requestPost(`auth/reset`, payload)
    return response
 */
const forgotPassword = payload => async (dispatch, getState) => {
  const response = await dispatch(requestPost(`auth/forgot?email=${payload.email}`, {}))
  const data = reponseData(response)
  return data
}

const resetPassword = payload => async (dispatch, getState) => {
  const response = await dispatch(requestPost(`auth/reset`, payload))
  const data = reponseData(response)
  return data
}

const fetchAccount = () => async (dispatch, getState) => {
  const response = await dispatch(requestGet('auth/me'))
  const data = reponseData(response)
  if (data && data.customer) {
    const accountData = getIn(getState(), 'customer.account')
    const payload = {
      ...accountData,
      ...data.customer
    }
    const result = await dispatch(storeCustomer(payload, true))
    return result
  }
}

const reponseData = response => getIn(response, 'value.data')

const setUserProperty = email => async dispatch => {
  const response = await dispatch(requestPost('customers/analytics', { email }))
  const data = reponseData(response)
  if (data?.data?.is_returning_customer) {
    const { is_returning_customer } = data.data
    gaEvents.trackReturningCustomer(is_returning_customer === 'new' ? 'new_customer_login' : 'is_returning_customer')
    gaEvents.setUserProperty('customer', is_returning_customer)
  }
}

const setCustomerData = customer => async dispatch => {
  if (customer) {
    if (customer.email) {
      gaEvents.setUserId(customer.email)
      setUserToken(customer.email)
    }
    smartlook.setUserIdentifier(customer)
    emarsysService.setContact(envConfig.emarsys.contactFieldId, `${customer.id}`)
    remoteLog.setTag('app.customer_id', customer.id)
    await dispatch(module.actions.account(customer))
    dispatch(setUserProperty(customer.email))
  }
}
const storeCustomer = (data, isAllowed = false) => async (dispatch, getState) => {
  if ((data && data.token) || isAllowed) {
    await dispatch(setCustomerData(data))
    await setAsyncStorageItem(namespace, data)
    await dispatch(wishlists.actions.fetchWishlists())
    return data
  }
}

const storeConsentGiven = isConsentGiven => async dispatch => {
  dispatch(module.actions.isConsentGiven(isConsentGiven))
  await setAsyncStorageItem('isConsentGiven', isConsentGiven)
  return isConsentGiven
}

const storeCustomerResponse = response => async (dispatch, getState) => {
  const data = reponseData(response)
  if (data && data.customer) {
    const accountData = getIn(getState(), 'customer.account')
    const payload = {
      ...accountData,
      ...data.customer
    }
    const result = await dispatch(storeCustomer(payload, true))
    return result
  }
}

const updateCustomer = customerInfo => async (dispatch, getState) => {
  const payload = { ...customerInfo }

  if (payload.updateCustomerPreferences) {
    const newPreferences = getIn(getState(), 'customer.preferences')
      .map(preference =>
        preference.options.map(option => ({
          id: option.id,
          customer_selected: option.customer_selected
        }))
      )
      .flat()

    const preferenceRes = await dispatch(requestPost('/customers/preferences', newPreferences))
    const preferenceData = getIn(preferenceRes, 'value.data.data')

    dispatch(module.actions.preferences(preferenceData))
  }

  delete payload.id
  delete payload.updateCustomerPreferences

  const response = await dispatch(requestPatch(`customers/${customerInfo.id}`, payload))

  const result = await dispatch(storeCustomerResponse(response))
  return result
}

const updateCustomerLoyality = ({ joinLoyalty }) => async (dispatch, getState) => {
  const customerId = getIn(getState(), 'customer.account.id')
  const payload = {
    loyalty_source: osName()
  }

  const response = await dispatch(requestPost(`customers/${customerId}/loyalty?join_loyalty=${joinLoyalty}`, payload))
  const result = await dispatch(storeCustomerResponse(response))
  return result
}

const fetchCustomerPreferences = () => async (dispatch, getState) => {
  try {
    const response = await dispatch(requestGet('/customers/preferences'))
    const data = getIn(response, 'value.data.data')
    dispatch(module.actions.preferences(data))
  } catch (err) {
    console.warn('error ---> ', 'fetchCustomerPreferences ----> ', err)
  }
}

const fetchCustomerLoyalty = () => async (dispatch, getState) => {
  const customerId = getIn(getState(), 'customer.account.id')

  try {
    const response = await dispatch(requestGet(`/customers/${customerId}/loyalty`))
    const data = getIn(response, 'value.data.data')
    dispatch(module.actions.loyalty(data))
  } catch (err) {
    dispatch(displayError(err))
  }
}

const storeCustomerPreferences = ({ parentInd, optionInd, value }) => (dispatch, getState) => {
  try {
    const newPreferences = [...getState().customer.preferences]
    newPreferences[parentInd].options[optionInd].customer_selected = value
    dispatch(module.actions.preferences(newPreferences))
  } catch (err) {
    console.warn('error ---> ', 'fetchCustomerPreferences ----> ', err)
  }
}

const updateCustomeDefaultAddress = ({ address }) => async (dispatch, getState) => {
  const response = await dispatch(requestPatch(`/customers/addresses/${address.id}`, address))
  const savedAddress = response?.value?.data?.address

  if (savedAddress) {
    dispatch(module.actions.defaultAddress(savedAddress))
    return dispatch(fetchCustomerAddresses())
  }
}

const fetchCustomerAddresses = () => async (dispatch, getState) => {
  const response = await dispatch(requestGet('/customers/addresses', {}, { name: 'fetchCustomerAddresses' }))
  const data = getIn(response, 'value.data.data')
  dispatch(module.actions.addresses(data))
  return data
}

const saveAddress = addressMeta => async (dispatch, getState) => {
  const { street_1, street_2, city, state, isNewAddress, post_code, first_name, last_name, phone, id } = addressMeta

  const payload = {
    type: 'shipping',
    street_1,
    street_2,
    city,
    state,
    country: envConfig.country,
    post_code,
    first_name,
    last_name,
    phone
  }

  let endpoint = `/customers/addresses`

  if (isNewAddress) {
    const response = await dispatch(requestPost(endpoint, payload))
    const responseData = getIn(response, 'value.data.address')
    if (responseData) {
      return dispatch(fetchCustomerAddresses())
    }
  }

  endpoint = `/customers/addresses/${id}`

  const res = await dispatch(requestPatch(endpoint, payload))
  const resData = getIn(res, 'value.data.address')
  if (resData) {
    return dispatch(fetchCustomerAddresses())
  }
}

const deleteAddress = id => async (dispatch, getState) => {
  const endpoint = `/customers/addresses/${id}`
  const response = await dispatch(requestDelete(endpoint, {}))
  const data = getIn(response, 'value.data.data')
  if (data) {
    return dispatch(fetchCustomerAddresses())
  }
}

const fetchStoredCustomer = () => async (dispatch, getState) => {
  const customer = await getAsyncStorageItem(namespace)
  // TODO check expiry
  if (customer && customer.token) {
    await dispatch(setCustomerData(customer))
    await dispatch(wishlists.actions.fetchWishlists())
    return customer
  }
}

const redeemVoucher = voucherId => async (dispatch, getState) => {
  const customerId = getIn(getState(), 'customer.account.id')

  try {
    const response = await dispatch(requestPost(`customers/${customerId}/vouchers/${voucherId}`, {}))
    await dispatch(fetchCustomerLoyalty())
    const data = getIn(response, 'value.data.data')
    return data
  } catch (err) {
    dispatch(displayError(err))
  }
}

const deleteStoredConsent = () => async dispatch => {
  await deleteAsyncStorageItem('isConsentGiven')
  dispatch(module.actions.isConsentGiven(null))
}

const fetchStoredConsent = () => async (dispatch, getState) => {
  const consentGiven = await getAsyncStorageItem('isConsentGiven')
  await dispatch(module.actions.isConsentGiven(consentGiven || 0))
  return consentGiven || 0
}

const fetchStoreCredits = () => async (dispatch, getState) => {
  const email = getIn(getState(), 'customer.account.email')

  const response = await dispatch(requestGet(`/customers/credit?email=${email}`, {}, { name: 'fetchStoreCredits' }))
  const data = getIn(response, 'value.data.data.credits.0.amount') || 0

  dispatch(module.actions.storeCredits(data))

  return data
}

// const submitProductReview = asyncActionPayload(payload => {
const submitProductReview = payload => async (dispatch, getState) => {
  const response = await dispatch(requestPost('review_v2', payload))
  return response
}

const fetchGiftCertificatesByEmail = () => async (dispatch, getState) => {
  const email = getIn(getState(), 'customer.account.email')

  const onError = error => {
    if (error?.response?.status === 404 && error?.response?.data?.message === `Gift certificate does not exist`) {
      return null
    }
    dispatch(displayError(error))
  }

  const response = await dispatch(
    requestGet(`/ecommerce/gift_certificates?to_email=${email}`, {}, { onError, name: 'fetchGiftCertificatesByEmail' })
  )
  const data = getIn(response, 'value.data')
  dispatch(module.actions.giftCertificates(data))

  return data
}

const actionCreators = {
  account: actionPayload(payload => {
    if (payload?.addresses) {
      return {
        ...payload,
        addresses: addressUtil.filterInvalidAddresses(payload.addresses)
      }
    }
    return payload
  }),
  isConsentGiven: actionPayload(payload => payload),
  addresses: actionPayload(payload => {
    if (payload?.length > 0) {
      return addressUtil.filterInvalidAddresses(payload)
    }
    return payload
  }),
  loyalty: actionPayload(payload => payload),
  defaultAddress: actionPayload(payload => payload),
  preferences: actionPayload(payload => payload),
  request: asyncRequest,
  shouldShowSocietyJoinModal: actionPayload(payload => payload),
  giftCertificates: actionPayload(payload => payload),
  storeCredits: actionPayload(payload => payload)
}
const actions = {
  verifyEmail,
  fetchAccount,
  login,
  signup,
  fetchStoredCustomer,
  fetchStoredConsent,
  logout,
  loginSocial,
  fetchCustomerAddresses,
  updateCustomeDefaultAddress,
  saveAddress,
  deleteAddress,
  updateCustomer,
  authRefresh,
  submitProductReview,
  forgotPassword,
  resetPassword,
  fetchCustomerPreferences,
  storeCustomerPreferences,
  updateCustomerLoyality,
  fetchCustomerLoyalty,
  redeemVoucher,
  storeConsentGiven,
  deleteStoredConsent,
  deleteAccount,
  fetchGiftCertificatesByEmail,
  fetchStoreCredits
}

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)
const { requestPut, requestGet, requestPost, requestDelete, requestPatch, displayError } = createRequestActions(module)

const reducer = (state, action) => {
  const newState = module.reducer(state, action)
  if (action.type === 'AUTH_RESET') {
    return { ...initialState }
  }
  return newState
}

export default { namespace, actions: module.actions, reducer }
