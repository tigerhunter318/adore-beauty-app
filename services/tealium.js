import Tealium from 'tealium-react-native'
import { TealiumEvent, Dispatchers, Collectors, TealiumEnvironment } from 'tealium-react-native/common'
import envConfig from '../config/envConfig'
import { dataToString } from '../utils/format'
import remoteLog from './remoteLog'
import { isDev } from '../utils/dev'
import { isValidObject } from '../utils/validation'

const initTealium = () => {
  const { account, profile } = envConfig.tealium
  const config = {
    account,
    profile,
    environment: isDev() ? TealiumEnvironment.dev : TealiumEnvironment.prod,
    dispatchers: [Dispatchers.Collect, Dispatchers.RemoteCommands, Dispatchers.TagManagement],
    collectors: [Collectors.AppData, Collectors.DeviceData, Collectors.Lifecycle, Collectors.Connectivity],
    visitorServiceEnabled: true
  }
  Tealium.initialize(config)
}

const trackEvent = (eventName, data) => {
  try {
    const event = new TealiumEvent(eventName, data)
    Tealium.track(event)
  } catch (error) {
    remoteLog.logError('Tealium', error)
  }
}

const addProductPurchaseIndividual = (orderData, customerAccount) => {
  const shardDataLayer = {
    order_id: dataToString(orderData, 'id'),
    customer_city: orderData?.billing_address?.city,
    customer_email: orderData?.billing_address?.email,
    customer_first_name: orderData?.billing_address?.first_name,
    customer_id: dataToString(customerAccount, 'id'),
    customer_last_name: orderData?.billing_address?.last_name,
    customer_state: orderData?.billing_address?.state,
    customer_zip: orderData?.billing_address?.zip,
    order_payment_type: dataToString(orderData, 'payment_method'),
    order_subtotal: orderData?.total_ex_tax,
    order_tax: orderData?.total_tax,
    order_total: orderData?.total_inc_tax
  }

  const products = orderData?.products || []
  const productsDetail = orderData?.productsDetail || []
  products.forEach(product => {
    const productDetail = productsDetail.find(productData => productData?.productSku.includes(product.sku))

    if (productDetail) {
      const productDataLayer = {
        ...shardDataLayer,
        product_brand: [dataToString(productDetail, 'brand_name|manufacturer')],
        product_category: [
          dataToString(productDetail, 'categories', 'title') || dataToString(productDetail, 'category_name')
        ],
        product_id: [dataToString(productDetail, 'product_id')],
        product_image_url: dataToString(productDetail, 'productImage'),
        product_name: [dataToString(productDetail, 'name')],
        product_quantity: [dataToString(product, 'quantity')],
        product_unit_price: [Number(productDetail?.price)],
        product_url: dataToString(productDetail, 'product_url')
      }

      trackEvent('product_purchase_individual', productDataLayer)
    } else {
      remoteLog.logError('Tealium', { message: 'missingProductData', product })
    }
  })
}

const addProductView = product => {
  if (isValidObject(product)) {
    const dataLayer = {
      product_id: [dataToString(product, 'product_id')],
      product_name: [dataToString(product, 'name')],
      product_unit_price: [Number(product.price)],
      product_brand: [dataToString(product, 'brand_name|manufacturer')],
      product_category: [dataToString(product, 'categories', 'title') || dataToString(product, 'category_name')],
      product_on_page: [dataToString(product, 'product_url')],
      product_image_url: dataToString(product, 'productImage')
    }
    trackEvent('product_view', dataLayer)
  }
}

const addProductQuickView = product => {
  if (isValidObject(product)) {
    const productPrice = product.specialPrice || product.price
    const dataLayer = {
      product_id: [dataToString(product, 'product_id')],
      productid: dataToString(product, 'product_id'),
      product_name: [dataToString(product, 'name')],
      product_sku: product.productSku,
      product_category: [dataToString(product, 'categories', 'title') || dataToString(product, 'category_name')],
      productCategories: [dataToString(product, 'categories', 'id')],
      product_category_ids: [dataToString(product, 'categories', 'id')],
      product_unit_price: [Number(product.price)],
      productBrand: product.brand_id,
      product_brand: [dataToString(product, 'brand_name|manufacturer')],
      product_on_page: [dataToString(product, 'product_url')],
      product_image_url: dataToString(product, 'productImage'),
      product_availability: [dataToString(product, 'inStock')],
      productDiscount: product.oldPrice > 0 ? parseFloat((product.oldPrice - product.price).toFixed(2)) : 0,
      product_discount_amount:
        product.oldPrice > 0 ? [(product.oldPrice - product.price).toFixed(2).toString()] : ['0'],
      product_exclude_from_offer: product.isSalable === 1 ? ['Yes'] : ['No'],
      product_original_price: product.oldPrice > 0 ? [product.oldPrice] : [product.specialPrice],
      productPrice,
      product_price: [productPrice],
      productReviewAvg: dataToString(product, 'reviewAverage'),
      product_review_avg: [dataToString(product, 'reviewAverage')],
      productReviewTotal: dataToString(product, 'reviewTotal'),
      product_review_total: [dataToString(product, 'reviewTotal')],
      product_shipping_group: [dataToString(product, 'shipping_group')],
      product_size: [dataToString(product, 'size')],
      product_status: [product.inStock],
      product_url: dataToString(product, 'product_url'),
      product_backorders: [dataToString(product, 'product_backorders')],
      productChoices: product.choices_facet || [],
      product_quantity: [product.qty],
      stock_on_hand: product.qty,
      page_brand_name: [dataToString(product, 'brand_name|manufacturer')],
      page_category_id: dataToString(product, 'categories', 'id'),
      category_name: dataToString(product, 'category_name'),
      productSalesLastWeek: product.productSalesLastWeek,
      productSales: product.productSales
    }

    trackEvent('product_quick_view', dataLayer)
  }
}

const addCartAdd = async (product, cartItems, customerAccount, cartItemsProductDetail) => {
  if (isValidObject(product)) {
    let dataLayer = {
      product_id: [dataToString(product, 'product_id')],
      product_name: [dataToString(product, 'name')],
      product_quantity: [1],
      product_unit_price: [Number(product.price)],
      product_brand: [dataToString(product, 'brand_name|manufacturer')],
      product_category: [dataToString(product, 'categories', 'title') || dataToString(product, 'category_name')]
    }

    if (cartItems?.length) {
      dataLayer.cart_product_id = [dataToString({ products: cartItemsProductDetail }, 'products', 'product_id')]
    }

    if (customerAccount) {
      dataLayer = {
        ...dataLayer,
        customer_email: dataToString(customerAccount, 'email'),
        customer_first_name: dataToString(customerAccount, 'first_name')
      }
    }

    trackEvent('cart_add', dataLayer)
  }
}

const checkoutApp = async (cartDetails, cartItems, step, cartItemsProductDetail) => {
  const billingAddress = cartDetails?.billing_address || {}
  const cartData = cartDetails?.cart || {}

  const data = { products: cartItemsProductDetail, cartItems }
  const dataLayer = {
    cart_product_sku: [dataToString(data, 'products', 'productSku')],
    cart_total_items: cartItems.length,
    cart_total_value: cartDetails?.grand_total,
    cart_product_id: [dataToString(data, 'products', 'product_id')],
    product_name: [dataToString(data, 'products', 'name')],
    cart_product_quantity: [dataToString(data, 'cartItems', 'quantity')],
    cart_product_price: [dataToString(data, 'cartItems', 'list_price')],
    customer_email: dataToString(cartData, 'email'),
    customer_first_name: dataToString(billingAddress, 'first_name'),
    customer_id: dataToString(cartData, 'customer_id'),
    customer_last_name: dataToString(billingAddress, 'last_name'),
    customer_city: dataToString(billingAddress, 'city'),
    customer_country: dataToString(billingAddress, 'country'),
    customer_postal_code: dataToString(billingAddress, 'postal_code|post_code'),
    customer_state: dataToString(billingAddress, 'state_or_province|state'),
    checkout_step: step
  }

  trackEvent('checkout', dataLayer)
}

export const tealiumEvents = {
  addProductPurchaseIndividual,
  addProductQuickView,
  addProductView,
  addCartAdd,
  checkoutApp,
  initTealium
}
