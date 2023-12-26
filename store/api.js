import axios from 'axios'
import perf from '@react-native-firebase/perf'
import { Alert } from 'react-native'
import envConfig from '../config/envConfig'
import { deepClone } from '../utils/object'

// configure base url
let _apiInstance = null

export const createApiInstance = options => {
  const createOptions = {
    baseURL: envConfig.apiUri,
    ...options
  }
  _apiInstance = axios.create(createOptions)

  if (envConfig.isApiPerformanceMonitoringEnabled) {
    _apiInstance.interceptors.request.use(async config => {
      try {
        const httpMetric = perf().newHttpMetric(config.url, config.method)
        config.metadata = { httpMetric }

        await httpMetric.start()
      } finally {
        // eslint-disable-next-line
        return config
      }
    })

    _apiInstance.interceptors.response.use(
      async response => {
        try {
          // Request was successful, e.g. HTTP code 200
          const { httpMetric } = response.config.metadata
          httpMetric.setHttpResponseCode(response.status)
          httpMetric.setResponseContentType(response.headers['content-type'])
          await httpMetric.stop()
        } finally {
          // eslint-disable-next-line
          return response
        }
      },
      async error => {
        try {
          // Request failed, e.g. HTTP code 500
          const { httpMetric } = error.config.metadata
          httpMetric.setHttpResponseCode(error.response.status)
          httpMetric.setResponseContentType(error.response.headers['content-type'])
          await httpMetric.stop()
        } finally {
          // Ensure failed requests throw after interception
          // eslint-disable-next-line
          return Promise.reject(error);
        }
      }
    )
  }

  return _apiInstance
}
export const apiInstance = () => _apiInstance

export const apiFetch = (endpoint, config = {}) =>
  // if(config && config.baseURL){
  //   return axios.get(`${config.baseURL}${endpoint}`, {})
  // }
  _apiInstance.get(`/${endpoint}`, config)

export const apiFormPost = (url, payload) => {
  const config = {
    baseURL: envConfig.apiUri,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }
  const formData = new FormData()
  /* eslint-disable */
  if (payload) {
    for (const k in payload) {
      formData.append(k, payload[k]);
    }
  }
  /* eslint-enable */
  return _apiInstance.post(url, formData, config)
}
export const apiRequest = (endpoint, payload = {}, config = {}) => {
  const requestObj = {
    ...config,
    url: endpoint
  }
  if (config.method && config.method.toLowerCase() !== 'get') {
    requestObj.data = payload
  }
  if (envConfig.enableApiLogger) {
    console.info(`%capiRequest ${config.method} ${endpoint}`, 'color:#5bb9fc', payload)
  }

  return _apiInstance.request(requestObj)
}
export const apiPost = (endpoint, payload = {}, config = {}) => _apiInstance.post(endpoint, payload, config)

export const apiPut = (endpoint, payload = {}, config = {}) => _apiInstance.put(endpoint, payload, config)

export const parseApiErrorMessage = error => {
  if (typeof error === 'string') {
    return error
  }
  // eslint-disable-next-line
  console.log("%cparseApiErrorMessage", "font-weight:bold;color:red", error?.response?.data, deepClone(error));

  const errors = error?.response?.data?.errors
  const errorMessage = error?.response?.data?.message

  if (errors && Array.isArray(errors) && errors.length > 0) {
    return errors.map(o => o.title).join('. ')
  }

  if (typeof errors === 'object' && errors) {
    if (errors.big_commerce_error) {
      return errors.big_commerce_error?.title
    }
    const messages = Object.values(errors)
    if (messages && messages.length > 0) {
      return [].concat(...messages).join(' ')
    }
  }

  if (errorMessage) {
    return errorMessage
  }
  return error?.message || error?.status
}

export const alertError = error => {
  const message = parseApiErrorMessage(error)
  const title = 'Sorry, an error has occurred'
  Alert.alert(title, `\n${message}`)
  return message
}
