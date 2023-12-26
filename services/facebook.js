import { LoginManager, AppEventsLogger } from 'react-native-fbsdk-next'
import { utcNow } from '../utils/date'
import { dataToString } from '../utils/format'
import AppEventsConstants from './facebook/AppEventsConstants'
import envConfig from '../config/envConfig'

const logout = () => LoginManager.logOut()

/**
 * Logs an event with eventName and optional arguments.
 * This function supports the following usage:
 * logEvent(eventName: string);
 * logEvent(eventName: string, valueToSum: number);
 * logEvent(eventName: string, parameters: {[key:string]:string|number});
 * logEvent(eventName: string, valueToSum: number, parameters: {[key:string]:string|number});
 * See https://developers.facebook.com/docs/app-events/android for detail.
 */
/**
 *
 * @param eventName
 * @param parameters
 * @param valueToSum If you turn this on, a value is associated with your event and summed up across all instances of this event. This allows you to see average values.
 * Test events @ https://www.facebook.com/events_manager2/list/app/1469392956707347/test_events?act=159715027533878
 * - open Test events tab
 * - then start app in simulator
 *
 * example : https://pasteboard.co/JSZvil2.png
 */
const logEvent = (eventName = 'custom event', parameters = {}, valueToSum = null) => {
  // console.log('facebook.logEvent', eventName, valueToSum, parameters)
  const params = { ...parameters }
  if (parameters.customerEmail) {
    AppEventsLogger.setUserData({ email: parameters.customerEmail })
    delete params.customerEmail
  }

  if (valueToSum) {
    AppEventsLogger.logEvent(eventName, valueToSum, params)
  } else {
    AppEventsLogger.logEvent(eventName, params)
  }
}

const logSignIn = async ({ email, method, id }) => {
  logEvent('login', { customerEmail: email, method, customerId: id })
}
const logSignUp = async ({ email, method, id }) => {
  logEvent(AppEventsConstants.EVENT_NAME_COMPLETED_REGISTRATION, {
    customerEmail: email,
    method,
    customerId: id,
    fb_currency: envConfig.currencyCode
  })
}

const logPurchase = async (orderData, customerAccount) => {
  const productIds = dataToString(orderData, 'productsDetail', 'product_id')
  const totalItems = dataToString(orderData, 'items_total')
  const contentId = totalItems > 1 ? `[${productIds}]` : productIds

  const params = {
    [AppEventsConstants.EVENT_PARAM_CURRENCY]: envConfig.currencyCode,
    [AppEventsConstants.EVENT_PARAM_CONTENT_TYPE]: 'product',
    [AppEventsConstants.EVENT_PARAM_NUM_ITEMS]: totalItems,
    [AppEventsConstants.EVENT_PARAM_CONTENT_ID]: contentId,
    productIds,
    totalItems,
    orderId: dataToString(orderData, 'id'),
    totalSpend: dataToString(orderData, 'total_inc_tax'),
    productBrands: dataToString(orderData, 'productsDetail', 'brand_name'),
    productCategories: dataToString(orderData, 'productsDetail', 'category_name'),
    productSkus: dataToString(orderData, 'products', 'sku'),
    productNames: dataToString(orderData, 'products', 'name'),
    productPrices: dataToString(orderData, 'products', 'price_inc_tax'),
    paymentMethod: dataToString(orderData, 'payment_method'),
    isReturningCustomer: dataToString(orderData, 'is_returning_customer'),
    coupons: dataToString(orderData, 'coupons', 'code'),
    customerId: dataToString(customerAccount, 'id'),
    createdAt: utcNow().format()
  }
  AppEventsLogger.setUserData({ email: dataToString(customerAccount, 'email') })
  AppEventsLogger.logPurchase(parseFloat(params.totalSpend), envConfig.currencyCode, params)
}

const logAddToCart = async (productData, customerAccount) => {
  const productId = dataToString(productData, 'product_id')
  const params = {
    [AppEventsConstants.EVENT_PARAM_CURRENCY]: envConfig.currencyCode,
    [AppEventsConstants.EVENT_PARAM_CONTENT_TYPE]: 'product',
    [AppEventsConstants.EVENT_PARAM_NUM_ITEMS]: 1,
    [AppEventsConstants.EVENT_PARAM_CONTENT_ID]: productId,
    productId,
    productBrandName: dataToString(productData, 'brand_name|manufacturer'),
    productCategories: dataToString(productData, 'categories', 'title'),
    productsku: dataToString(productData, 'productSku'),
    productName: dataToString(productData, 'name'),
    productPrice: dataToString(productData, 'price'),
    customerId: dataToString(customerAccount, 'id'),
    createdAt: utcNow().format()
  }

  logEvent(AppEventsConstants.EVENT_NAME_ADDED_TO_CART, params, parseFloat(params.productPrice))
}

const facebook = { logout, logEvent, logAddToCart, logSignUp, logPurchase, logSignIn }
export const fbEvents = { logAddToCart, logSignUp, logPurchase, logSignIn }
export default facebook
