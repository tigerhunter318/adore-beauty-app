import ReactNativePartnerize from 'react-native-partnerize'
import remoteLog from './remoteLog'
import { formatExternalUrl, formatToJson, toSnakeCase } from '../utils/format'
import { deleteAsyncStorageItem, getAsyncStorageItem, setAsyncStorageItem } from '../utils/asyncStorage'
import envConfig from '../config/envConfig'
import { isDev } from '../utils/dev'

const localStorageKey = 'partnerizeClick'

const isLoggingEnabled = async () => {
  if (envConfig.isStagingApp || isDev()) {
    const partnerizeDebug = await getAsyncStorageItem('partnerizeDebug')
    return !!partnerizeDebug?.enableLogging
  }
  return false
}

/*
 * android device logs
 * $ adb logcat | grep -E "ReactNativePartnerizeLog"
 */
const logInfo = async (name = '', ...rest) => {
  if (envConfig.enablePartnerizeLogger) {
    console.info(`%cpartnerService ${name}`, `color:#FC5BE1FF`, ...rest)
  }
  const enableRemoteLogging = await isLoggingEnabled()
  if (enableRemoteLogging) {
    remoteLog.addBreadcrumb({ message: name, category: 'info', data: { json: formatToJson(rest) } })
    remoteLog.logInfo('ReactNativePartnerize', name)
  }
}

/**
 * is a url an adorebeauty partnerize url
 *
 * @param str
 * @returns {boolean}
 */
const isPartnerizeUrl = str => {
  const url = formatExternalUrl(str)
  return url && url.includes('://adorebeauty.prf.hn/')
}

const extractFromPartnerizeUrl = str => {
  const urlPieces = str?.split('/destination:')
  return urlPieces?.length > 1 ? urlPieces[1] : ''
}

const compactObject = obj => {
  const tempObj = { ...obj }
  Object.keys(tempObj).forEach(key => {
    if (!tempObj[key]) {
      delete tempObj[key]
    }
  })
  return tempObj
}

const prepareConversion = (
  {
    products,
    productsDetail,
    transaction,
    currency_code,
    billing_address: billingAddress,
    is_returning_customer,
    discount_amount,
    coupon_discount,
    payment_method,
    total_inc_tax,
    subtotal_inc_tax,
    coupons,
    id: orderId
  },
  { id }
) => {
  const payload = {
    products: products.map(product => {
      if (productsDetail?.length) {
        const productInfo = productsDetail.find(item => item.productSku.includes(product.sku))

        const productPayload = {
          price: Number(productInfo?.price || 0),
          category: productInfo?.category_name?.[0] || '',
          quantity: Number(product.quantity || 0),
          sku: product.sku || ''
        }

        const productMetaData = compactObject({
          product_brand: productInfo?.brand_name || '',
          product_name: productInfo?.name || ''
        })

        if (Object.keys(productMetaData).length) {
          productPayload.metadata = productMetaData
        }

        return productPayload
      }
      return {}
    }),
    conversionRef: `${orderId || ''}`,
    currency: currency_code || '',
    country: billingAddress?.country_iso2 || '',
    isReturningCustomer: is_returning_customer || false,
    custRef: `${id || 0}`
  }

  const metaData = compactObject({
    order_coupon_discount: coupon_discount,
    order_discount_amount: discount_amount,
    order_grand_total: total_inc_tax,
    order_payment_type: toSnakeCase(`${payment_method}`),
    order_subtotal: subtotal_inc_tax
  })

  if (Object.keys(metaData).length) {
    payload.metadata = metaData
  }

  if (coupons?.length) {
    payload.voucher = coupons.map(coupon => coupon.code).join(', ')
  }

  return payload
}

const clearConversion = async () => {
  logInfo('clearConversion')
  await deleteAsyncStorageItem(localStorageKey)
}

const startConversion = async url => {
  let response
  await deleteAsyncStorageItem(localStorageKey)
  try {
    response = await ReactNativePartnerize.startConversion(url)
    if (response?.clickRef) {
      await setAsyncStorageItem(localStorageKey, response)
    }
  } catch (error) {
    remoteLog.addBreadcrumb({ message: `startConversion`, category: 'error', data: { json: formatToJson(error) } })
    remoteLog.logError('ReactNativePartnerize', { error: 'startConversionError' })
  }
  logInfo(`start ${response?.clickRef}`, { url, response })
}

const completeConversion = async (orderConfirmationData = {}, customerAccount = {}) => {
  const clickData = await getAsyncStorageItem(localStorageKey)
  await deleteAsyncStorageItem(localStorageKey)
  const clickRef = clickData?.clickRef
  if (clickRef) {
    let response = null
    let payload = null
    try {
      payload = prepareConversion(orderConfirmationData, customerAccount)
      response = await ReactNativePartnerize.completeConversion(payload, clickRef)
    } catch (error) {
      remoteLog.addBreadcrumb({
        message: 'completeConversion',
        category: 'info',
        data: { clickRef, payload: formatToJson(payload) }
      })
      remoteLog.addBreadcrumb({
        message: `completeConversion`,
        category: 'error',
        data: { clickRef, json: formatToJson(error) }
      })
      remoteLog.logError('ReactNativePartnerize', { error: 'completeConversionError' })
    }
    logInfo(`complete-${clickRef} ${orderConfirmationData?.id}`, { clickRef, response, payload })
  }
}

export const partnerizeService = {
  prepareConversion,
  completeConversion,
  startConversion,
  clearConversion,
  isPartnerizeUrl,
  extractFromPartnerizeUrl
}
