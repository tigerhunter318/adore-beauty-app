import { Platform } from 'react-native'
import Emarsys from 'react-native-emarsys-wrapper'
import { isValidArray } from '../../utils/validation'
import remoteLog from '../remoteLog'
import { formatToJson } from '../../utils/format'
import { bigcommerceUtils } from '../bigcommerce'
import formatProductInventory from '../../components/product/utils/formatProductInventory'

const trackCart = async (lineItems, products) => {
  let cartItems = []

  if (isValidArray(lineItems) && isValidArray(products)) {
    cartItems = lineItems
      .map(item => {
        if (products.length) {
          const productInfo = bigcommerceUtils.findProductDetail(item, products)
          if (productInfo) {
            return {
              itemId: `${productInfo.product_id}`,
              price: Number(item.list_price) * Number(item.quantity),
              quantity: Number(item.quantity)
            }
          }
          return null
        }

        return null
      })
      .filter(item => !!item)
  }

  Emarsys.predict.trackCart(cartItems)
  return cartItems
}

const trackPurchase = async orderData => {
  const productsDetail = orderData?.productsDetail
  const cartItems = (orderData?.products || []).map(product => {
    if (productsDetail) {
      const productInfo = bigcommerceUtils.findProductDetail(product, productsDetail)
      if (productInfo) {
        return {
          itemId: `${productInfo.product_id}`,
          price: Number(product.total_inc_tax),
          quantity: Number(product.quantity)
        }
      }
      return null
    }
    return null
  })

  const orderId = orderData?.transaction?.id || orderData?.transaction?.orderId
  const items = cartItems.filter(cartItem => cartItem)

  if (orderId && isValidArray(items)) {
    Emarsys.predict.trackPurchase(orderId, items)
  }
  // trigger empty cart event
  Emarsys.predict.trackCart([])

  return cartItems
}

const trackItemView = itemId => Emarsys.predict.trackItemView(`${itemId}`)

const trackCategoryView = (categoryPath = []) => Emarsys.predict.trackCategoryView(categoryPath.join(' > '))

const trackSearchTerm = searchTerm => Emarsys.predict.trackSearchTerm(searchTerm)

const trackRecommendationClick = product => Emarsys.predict.trackRecommendationClick(product)

const trackTag = (tagName, tagAttributes) => Emarsys.predict.trackTag(tagName, tagAttributes)

const trackCustomEvent = async (eventName, eventAttributes = {}) => {
  try {
    const result = await Emarsys.trackCustomEvent(eventName, eventAttributes)
    return result
  } catch (error) {
    remoteLog.addBreadcrumb({
      message: 'trackCustomEvent',
      category: 'info',
      data: { eventName, payload: eventAttributes }
    })
    remoteLog.addBreadcrumb({
      message: 'trackCustomEvent',
      category: 'error',
      data: { eventName, json: formatToJson(error) }
    })
    remoteLog.logError('EmarsysEvents', { error: 'trackCustomEvent' })
  }
}

const trackJoinAdoreSociety = () =>
  trackCustomEvent('joinedAdoreSociety', {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' })
  })

const trackScreen = (name, identifier = '', type = '', categoryName = '') => {
  const eventData = { name }

  if (type) {
    eventData.type = type
  }

  if (categoryName) {
    eventData.category_name = categoryName
  }

  if (identifier) {
    eventData.identifier = identifier
  }

  trackCustomEvent('screenView', eventData)
  return eventData
}

const trackAppOpen = () =>
  trackCustomEvent('appOpen', {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' })
  })

const trackAppInForeground = () =>
  trackCustomEvent('appInForeground', {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' })
  })

const trackFindationRecommendation = recommendedFindation =>
  trackCustomEvent('findation', {
    recommendedFindation
  })

const trackCustomPurchase = (orderData = {}) => {
  const payload = {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' }),
    orderId: `${orderData.id}`,
    cart_total: `${orderData.total_inc_tax}`
  }

  const { products = [], productsDetail = [] } = orderData
  products.forEach((product, index) => {
    if (productsDetail) {
      const productInfo = bigcommerceUtils.findProductDetail(product, productsDetail)
      if (productInfo) {
        payload[`product_id_${index}`] = `${productInfo.product_id}`
        payload[`product_price_${index}`] = `${Number(productInfo.price) * Number(product.quantity)}`
        payload[`product_item_quantity_${index}`] = `${product.quantity}`
      }
    }
  })
  trackCustomEvent('purchase', payload)
  return payload
}

const trackUpdatedCart = (cartTotalAmount, lineItems, products) => {
  const payload = {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' }),
    cart_total: `${cartTotalAmount}`
  }
  if (isValidArray(lineItems) && isValidArray(products)) {
    lineItems.forEach((item, index) => {
      const productInfo = products.find(product => product.productSku?.includes(item.sku))
      if (productInfo) {
        payload[`product_id_${index}`] = `${productInfo.product_id}`
        payload[`product_price_${index}`] = `${Number(item.list_price) * Number(item.quantity)}`
        payload[`product_name_${index}`] = `${productInfo.name}`
        payload[`product_image_${index}`] = `${productInfo.productImage}`
        payload[`product_brand_${index}`] = `${productInfo.brand_name}`
        payload[`product_link_${index}`] = `${productInfo.product_url}`
        payload[`product_stock_availability_${index}`] = `${productInfo.inStock === 1 ? 'Y' : 'N'}`
        payload[`product_item_quantity_${index}`] = `${item.quantity}`
      }
    })
  }

  trackCustomEvent('updatedCart', payload)
  return payload
}

const trackProductView = (productData, productVariant) => {
  const payload = {
    platform: Platform.select({ ios: 'iOS', android: 'Android', default: 'Other' })
  }

  if (productData) {
    const { isSalable } = formatProductInventory(productData, productVariant)
    payload.product_id = `${productData.product_id}`
    payload.product_price = `${productData.price}`
    payload.product_name = `${productData.name}`
    payload.product_image_url = `${productData.productImage}`
    payload.product_brand = `${productData.brand_name}`
    payload.product_link = `${productData.product_url}`
    payload.product_stock_availability = `${isSalable ? 'Y' : 'N'}`
  }

  trackCustomEvent('productView', payload)
  return payload
}

export const emarsysEvents = {
  trackCart,
  trackPurchase,
  trackItemView,
  trackSearchTerm,
  trackRecommendationClick,
  trackCategoryView,
  trackTag,
  trackCustomEvent,
  trackJoinAdoreSociety,
  trackScreen,
  trackAppOpen,
  trackAppInForeground,
  trackFindationRecommendation,
  trackCustomPurchase,
  trackUpdatedCart,
  trackProductView
}
