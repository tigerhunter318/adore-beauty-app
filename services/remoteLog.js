import * as Sentry from '@sentry/react-native'
import { formatToJson, truncate } from '../utils/format'
import envConfig, { versionName } from '../config/envConfig'

const formatString = (str, maxChars = 2000) => truncate(str.toString(), maxChars)

const addBreadcrumb = (options = {}) =>
  Sentry.addBreadcrumb({
    level: 'info',
    ...options
  })

const addCheckoutBreadcrumb = (options = {}) => addBreadcrumb({ category: 'checkout', ...options })

const addCheckoutResponseBreadcrumb = (message = '', category = '', payload) => {
  if (payload?.checkoutResponse?.cart) {
    const { cart, billing_address, consignments } = payload.checkoutResponse
    const cartItems = (cart?.line_items?.physical_items || []).map(item => ({
      name: item.name,
      sku: item.sku,
      sale_price: item.sale_price,
      quantity: item.quantity
    }))
    const cartInfo = { ...cart }
    delete cartInfo.line_items
    addBreadcrumb({
      message: `${message}.cart`,
      category,
      data: { numOfItems: cartItems?.length, xCart: formatToJson(cartInfo), xCartItems: formatToJson(cartItems) }
    })
    addBreadcrumb({
      message: `${message}.billing_address`,
      category,
      data: { billing_address: formatToJson(billing_address) }
    })
    addBreadcrumb({
      message: `${message}.consignments`,
      category,
      data: { length: consignments?.length, xConsignments: formatToJson(consignments) }
    })
  } else {
    addBreadcrumb({ message, category, data: { json: formatToJson(payload) } })
  }
}

const setTag = (key, value) => Sentry.setTag(key, value)

const logMessage = (title, payload, category = 'info') => {
  const dataString = formatToJson(payload)
  const message = `RNL-${title}-${dataString}`
  addBreadcrumb({ message: `${title} ${versionName()}`, category, data: { data: payload, json: dataString } })
  Sentry.captureMessage(message)
}

const logError = (title, error) => {
  logMessage(title, error, 'error')
}

const logInfo = (title, payload) => {
  logMessage(title, payload, 'info')
}

const initSentry = () => {
  Sentry.init({
    ...envConfig.sentry,
    beforeBreadcrumb(breadcrumb, hint) {
      const { message, category } = breadcrumb || {}
      const ignoredMessage = message && !!envConfig.ignoredLogs.find(text => message.includes(text))
      if (category === 'xhr' && hint?.xhr) {
        const { responseURL: url, response } = hint.xhr || {}
        const { method, body } = hint.xhr.__sentry_xhr__ || {}
        // log request body & response for BC requests
        if (method !== 'GET' && url?.includes('api/ecommerce')) {
          const data = { url, method, xBody: body, xResponse: response }
          return { ...breadcrumb, data }
        }
      }
      // if (category === 'ui.lifecycle' || category === 'ui.click') {
      //   return null
      // }
      if (category === 'console' && (ignoredMessage || envConfig.sentry.ignoreConsoleLogs)) {
        return null
      }
      return breadcrumb
    }
  })
  setTag('app.version', versionName())
}

export default {
  addCheckoutBreadcrumb,
  addBreadcrumb,
  logError,
  logInfo,
  formatString,
  setTag,
  initSentry,
  addCheckoutResponseBreadcrumb
}
