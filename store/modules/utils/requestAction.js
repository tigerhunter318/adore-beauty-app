import { Alert } from 'react-native'
import { getIn } from '../../../utils/getIn'
import { asyncActionPayload } from '../../utils/createActionsReducer'
import { alertError, apiRequest } from '../../api'
import envConfig from '../../../config/envConfig'
import { deleteLocalAuth } from './deleteLocalAuth'
import { remoteLogError } from './remoteLogError'

const hostConfig = () => ({ baseURL: envConfig.apiUri })

/**
 *
 * @param getState
 * @param config
 * @returns {{headers: {Authorization: string}}|*}
 */
const addAuthHeaders = (getState, config) => {
  const token = getIn(getState(), 'customer.account.token')
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${getState().customer.account.token}`
      }
    }
  }
  return config
}

const displayError = error => (dispatch, getState) => alertError(error)

export const asyncRequest = asyncActionPayload((endpoint, payload = {}, configObj = {}) => {
  const data = apiRequest(endpoint, payload, { ...hostConfig(), ...configObj })
  return data
})
export const createRequestActions = (module, options = {}) => {
  const requestAction = (endpoint, payload, method, config = {}) => async (dispatch, getState) => {
    try {
      const requestConfig = addAuthHeaders(getState, { method, ...config })
      const response = await dispatch(module.actions.request(endpoint, payload, requestConfig))
      return response
    } catch (error) {
      if (options?.useRemoteLog && config.useRemoteLog !== false) {
        remoteLogError({ payload, error, namespace: module?.namespace, endpoint })
      }

      const isExistingCustomer =
        error?.response?.status === 422 && error?.response?.data?.message === 'The email has already been taken.'

      const isUnauthenticatedError =
        error?.response?.status === 401 && error?.response?.data?.message === 'Unauthenticated.'

      if (config.onError) {
        // action error
        config.onError(error)
      } else {
        if (options?.onError) {
          // general error callback for module
          dispatch(options?.onError(error))
        } else if (isUnauthenticatedError) {
          Alert.alert(
            "You've been signed out",
            'For security reasons we sign you out of the app if you have not opened it in a while to protect your data.'
          )
        } else if (isExistingCustomer) {
          Alert.alert(
            'Sorry, an error has occurred',
            'This email is already linked to an existing Adore Beauty account'
          )
        } else {
          await dispatch(displayError(error))
        }
        if (isUnauthenticatedError) {
          // force logout
          dispatch(deleteLocalAuth())
        }
      }
    }
  }
  const requestPost = (endpoint, payload, config) => async dispatch =>
    dispatch(requestAction(endpoint, payload, 'post', config))
  const requestPut = (endpoint, payload, config) => async dispatch =>
    dispatch(requestAction(endpoint, payload, 'put', config))
  const requestGet = (endpoint, payload, config) => async dispatch =>
    dispatch(requestAction(endpoint, payload, 'get', config))
  const requestDelete = (endpoint, payload, config) => async dispatch =>
    dispatch(requestAction(endpoint, payload, 'delete', config))
  const requestPatch = (endpoint, payload, config) => async dispatch =>
    dispatch(requestAction(endpoint, payload, 'patch', config))

  return {
    displayError,
    requestAction,
    requestPut,
    requestGet,
    requestPost,
    requestDelete,
    requestPatch
  }
}
