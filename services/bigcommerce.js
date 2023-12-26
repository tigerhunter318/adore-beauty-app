import { getIn } from '../utils/getIn'
import { apiRequest } from '../store/api'
import { formatQueryToString } from '../utils/format'
import { isValidArray } from '../utils/validation'
import { graphQuery } from './apollo/apollo'
import { getProductQuery } from '../gql/useProductQuery'
import envConfig from '../config/envConfig'

const isGiftItem = item => item?.sale_price === 0
const isAutoAddGiftItem = item => isGiftItem(item) && !!getIn(item, 'discounts.0.id')
const isGiftCertificate = item => getIn(item, 'name') === 'Gift Certificate'

const formatProductEndpoint = (sku, include_fields = ['date_created', 'price', 'cost_price', 'base_variant_id']) => {
  const params = { sku, include_fields }
  if (!include_fields) {
    delete params.include_fields
  }
  return `/ecommerce/catalog/products?${formatQueryToString(params)}`
}
/**
 * fetches product details from big commerce catalog
 * https://developer.bigcommerce.com/api-reference/store-management/catalog/products/getproductbyid
 *
 * defaults to including ['date_created','price','cost_price'] fields in fetch
 *
 * //fetch price and inventory_level fields
 * e.g. await bigcommerceUtils.fetchBigCommerceProduct(sku, ['price', 'inventory_level'])
 * //fetch all fields (dont add include param)
 * e.g. await bigcommerceUtils.fetchBigCommerceProduct(sku, null)
 *
 * @param sku
 * @param include
 * @returns {Promise<*>}
 */
const fetchBigCommerceProduct = async (sku, include) => {
  const response = await apiRequest(formatProductEndpoint(sku, include))
  return response?.data?.data?.[0]
}

const fetchBigCommerceProductByCatalogId = async catalogId => {
  const endpoint = `/ecommerce/catalog/products/${catalogId}`
  const response = await apiRequest(endpoint)
  return response?.data?.data
}

export const fetchBigCommerceProductsByCatalogIds = async (catalogIds, variables = {}) => {
  const limit = Math.max(50, catalogIds?.length)
  const endpoint = `/ecommerce/catalog/products?id:in=${catalogIds}&limit=${limit}`
  const response = await apiRequest(endpoint)
  const catalogProducts = response?.data?.data?.filter(item => !bigcommerceUtils.isGiftCertificate(item)) || []

  if (isValidArray(catalogProducts)) {
    const skus = catalogProducts.map(item => item.sku).filter(str => !!str)
    if (!isValidArray(skus)) {
      return null
    }

    const { data: productData } = await graphQuery({
      query: getProductQuery(),
      variables: {
        locale: envConfig.locale,
        sku: skus.join(','),
        rows: skus.length,
        ...variables
      }
    })
    const products = productData?.products

    if (products) {
      const merged = []
      catalogProducts.forEach(catalogProduct => {
        // match first productSku value or find a match if product has multiple productSkus
        const product =
          products.find(item => item.productSku?.[0] === catalogProduct.sku) ||
          products.find(item => item.productSku.includes(catalogProduct.sku))

        if (productData) {
          merged.push({
            productData: product,
            catalogProduct
          })
        }
      })
      return merged
    }
  }

  return null
}

const findProductDetail = (catalogProduct, products = []) => {
  try {
    const productDetail = products.find(item => item.productSku?.includes(catalogProduct.sku))
    return productDetail
  } catch (error) {
    console.warn('bigcommerceUtils', ' - ', 'findProductDetail', error)
  }
}

const findProductCatalogInfo = (product, catalogProducts) => {
  try {
    const productCatalogInfo = catalogProducts.find(item => product.productSku?.includes(item.sku))
    return productCatalogInfo
  } catch (error) {
    console.warn('bigcommerceUtils', ' - ', 'findProductCatalogInfo', error)
  }
}

export const bigcommerceUtils = {
  isAutoAddGiftItem,
  isGiftCertificate,
  isGiftItem,
  formatProductEndpoint,
  fetchBigCommerceProduct,
  fetchBigCommerceProductsByCatalogIds,
  fetchBigCommerceProductByCatalogId,
  findProductDetail,
  findProductCatalogInfo
}
