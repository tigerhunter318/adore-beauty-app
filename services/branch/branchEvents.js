import branch, { BranchEvent } from 'react-native-branch'
import {
  dataToString,
  formatPageIdentifier,
  objectValuesToString,
  formatProductSkuValue,
  formatPrice
} from '../../utils/format'
import { isValidArray, isValidObject, isValidNumber } from '../../utils/validation'
import envConfig from '../../config/envConfig'
import { asyncEach } from '../../utils/asyncEach'
import remoteLog from '../remoteLog'

/**
 * // https://help.branch.io/developers-hub/docs/tracking-commerce-content-lifecycle-and-custom-events
 // https://help.branch.io/developers-hub/docs/react-native#standard-events
 * @param eventName
 * @param branchUniversalObject
 * @param customData
 * @param params
 * @returns {Promise<null>}
 */
const logEvent = async (eventName, branchUniversalObject = [], customData = {}, params = {}) => {
  try {
    const event = new BranchEvent(eventName, branchUniversalObject, {
      customData: objectValuesToString(customData),
      currency: envConfig.currencyCode,
      ...params
    })
    // console.log('29', '', 'logEvent', event)
    await event.logEvent()
    return event
  } catch (error) {
    remoteLog.logError(`branchEvents: ${eventName}`, error)
  }
}

const createUniversalObjectFromProduct = async (data, metaData = {}) => {
  if (!isValidObject(data)) return null
  const identifier = data.identifier || formatPageIdentifier(data.product_url || data.url, true)
  const sku = formatProductSkuValue(data.productSku)
  if (!identifier || !sku) {
    return null
  }

  const options = {
    locallyIndex: false,
    title: data.name,
    canonicalUrl: data.product_url || '',
    contentImageUrl: data.productImage || '',
    contentMetadata: {
      productName: data.name || '',
      productBrand: data.brand_name || '',
      price: formatPrice(data.price),
      sku,
      quantity: isValidNumber(data.quantity) ? parseInt(data.quantity) : 1,
      customMetadata: {
        contentType: 'product',
        ...metaData
      }
    }
  }
  try {
    const branchUniversalObject = await branch.createBranchUniversalObject(identifier, options)
    return branchUniversalObject
  } catch (error) {
    remoteLog.logError(`branchEvents: createUniversalObjectFromProduct`, error)
  }
}

const createUniversalObjectFromProducts = async productsData => {
  const contentItems = await asyncEach(productsData, item => createUniversalObjectFromProduct(item))
  return (contentItems || []).filter(item => !!item)
}

const trackAddToCart = async ({ customerAccount, lineItem }) => {
  if (!isValidObject(lineItem?.productData)) return
  const { productData, productSku, quantity, product_id, product_variant } = lineItem
  const productCategory = dataToString(productData, 'category_name')
  const customData = objectValuesToString({
    product_sku: productSku,
    product_name: productData.name,
    product_brand: productData.brand_name,
    product_id,
    product_variant: product_variant || '',
    product_category: productCategory,
    product_quantity: quantity,
    product_unit_price: productData.price,
    customer_id: customerAccount?.id
  })

  const metaData = objectValuesToString({
    productName: productData.name || '',
    productBrand: productData.brand_name || '',
    productVariant: product_variant || '',
    price: formatPrice(productData?.price),
    sku: productSku,
    quantity: `${quantity}`
  })
  const branchUniversalObject = await createUniversalObjectFromProduct(productData, metaData)
  return logEvent(BranchEvent.AddToCart, branchUniversalObject, customData, {})
}

const composeCartEventData = ({ cart, products, lineItems, priceKey = 'sale_price' }) => {
  const isValid = isValidObject(cart) && isValidArray(products) && isValidArray(lineItems)
  if (!isValid) return

  const data = {
    lineItems
  }
  data.products = lineItems.map(item => {
    const productData = products.find(product => product?.productSku.includes(item.sku)) || {}
    return { ...item, ...productData }
  })

  const customData = {
    customer_id: cart.customer_id,
    product_brand: dataToString(data, 'products', 'brand_name'),
    product_category: dataToString(data, 'products', 'category_name'),
    product_id: dataToString(data, 'products', 'product_id'),
    product_name: dataToString(data, 'products', 'name'),
    product_price: dataToString(data, 'products', priceKey),
    product_quantity: dataToString(data, 'products', 'quantity'),
    product_sku: dataToString(data, 'products', 'sku'),
    cart_total_items: lineItems.length,
    cart_total_value: cart.cart_amount_inc_tax
  }
  return { customData, productsData: data.products }
}
const trackViewCart = async ({ cart, products, lineItems, customerAccount }) => {
  const { customData, productsData } = composeCartEventData({ cart, products, lineItems }) || {}
  if (customData) {
    const customerData = {
      customer_first_name: customerAccount?.first_name,
      customer_last_name: customerAccount?.last_name,
      customer_id: customerAccount?.id
    }
    const contentItems = await createUniversalObjectFromProducts(productsData)
    return logEvent(BranchEvent.ViewCart, contentItems, { ...customData, ...customerData })
  }
}

const trackCheckout = async ({ cart, products, lineItems, customerAccount }) => {
  const { customData, productsData } = composeCartEventData({ cart, products, lineItems }) || {}
  if (customData) {
    const customerData = {
      customer_first_name: customerAccount?.first_name,
      customer_last_name: customerAccount?.last_name,
      customer_id: customerAccount?.id
    }
    const contentItems = await createUniversalObjectFromProducts(productsData)
    return logEvent(BranchEvent.InitiatePurchase, contentItems, { ...customData, ...customerData })
  }
}

const trackPurchase = async ({ orderConfirmationData, customerAccount }) => {
  const { productsDetail: products, products: lineItems } = orderConfirmationData
  const { customData, productsData } = composeCartEventData({
    cart: orderConfirmationData,
    products,
    lineItems,
    priceKey: 'price_inc_tax'
  })
  if (customData) {
    const customerData = {
      customer_id: customerAccount?.id,
      customer_first_name: orderConfirmationData?.billing_address?.first_name,
      customer_last_name: orderConfirmationData?.billing_address?.last_name,
      order_id: orderConfirmationData?.id,
      customer_city: orderConfirmationData?.billing_address?.city,
      customer_state: orderConfirmationData?.billing_address?.state,
      customer_zip: orderConfirmationData?.billing_address?.zip,
      order_payment_type: orderConfirmationData?.payment_method,
      order_subtotal: orderConfirmationData?.subtotal_inc_tax,
      order_tax: orderConfirmationData?.total_tax,
      order_total: orderConfirmationData?.total_inc_tax
    }
    const params = objectValuesToString({
      transactionID: orderConfirmationData?.id,
      revenue: orderConfirmationData?.total_inc_tax,
      shipping: orderConfirmationData?.shipping_cost_inc_tax,
      tax: orderConfirmationData?.total_tax,
      coupon: dataToString(orderConfirmationData, 'couponIds')
    })
    const contentItems = await createUniversalObjectFromProducts(productsData)
    return logEvent(BranchEvent.Purchase, contentItems, { ...customData, ...customerData }, params)
  }
}

const trackViewPost = async (data, metaData = {}) => {
  const customData = objectValuesToString({
    identifier: data.identifier,
    article_title: data.name
  })

  return logEvent(BranchEvent.ViewItem, null, customData, { description: 'article' })
}
const trackViewProduct = async (productData, metaData = {}) => {
  const productCategory = dataToString(productData, 'category_name')
  const customData = objectValuesToString({
    product_name: productData.name,
    product_brand: productData.brand_name,
    product_id: productData.product_id,
    product_category: productCategory,
    product_unit_price: formatPrice(productData.price),
    product_sku: formatProductSkuValue(productData.productSku) || ''
  })
  const branchUniversalObject = await createUniversalObjectFromProduct(productData, metaData)
  return logEvent(BranchEvent.ViewItem, branchUniversalObject, customData, { description: 'product' })
}
const trackViewProducts = async (products, metaData = {}) => {
  if (products?.length > 0) {
    const contentItems = await createUniversalObjectFromProducts(products)
    const data = { products }
    const customData = objectValuesToString({
      product_id: dataToString(data, 'products', 'product_id'),
      product_name: dataToString(data, 'products', 'name'),
      product_brand: dataToString(data, 'products', 'brand_name'),
      product_category: dataToString(data, 'products', 'category_name'),
      product_sku: dataToString(data, 'products', 'productSku')
    })
    return logEvent(BranchEvent.ViewItems, contentItems, customData)
  }
}

const trackLogin = async (data, metaData = {}) => {
  const customData = {
    customer_id: data.id,
    login_method: metaData.loginMethod
  }
  return logEvent(BranchEvent.Login, null, customData, { description: metaData.loginMethod })
}
const trackSignup = async (data, metaData = {}) => {
  const customData = {
    customer_id: data.id,
    login_method: metaData.loginMethod
  }
  return logEvent(BranchEvent.CompleteRegistration, null, customData, { description: metaData.loginMethod })
}

const branchEvents = {
  createUniversalObjectFromProduct,
  trackAddToCart,
  trackViewCart,
  trackCheckout,
  trackPurchase,
  trackViewProduct,
  trackViewPost,
  trackViewProducts,
  trackSignup,
  trackLogin
}
export default branchEvents
