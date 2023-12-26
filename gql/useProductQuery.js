import gql from 'graphql-tag'
import { useLazyQuery, useQuery } from '@apollo/client'
import envConfig from '../config/envConfig'
import { composeModel } from '../utils/composeModel'
import { graphQuery } from '../services/apollo/apollo'
import { isValidArray } from '../utils/validation'

export const fetchProductsDetailBySku = async (
  products,
  fields = 'product_id,name,price,productImage,category_name,size,brand_name,productSku,product_url,inStock',
  additionalFields = ''
) => {
  const sku = isValidArray(products) && products.map(product => product.sku).filter(str => !!str)

  if (isValidArray(sku)) {
    const query = gql`
      query ProductsQuery($locale: String, $sku: String, $rows: Int) {
        products(locale: $locale, sku: $sku, rows: $rows) {
          ${fields}
          ${additionalFields}
        }
      }
    `
    const { data } = await graphQuery({
      query,
      variables: {
        locale: envConfig.locale,
        sku: sku.join(','),
        rows: sku.length
      }
    })
    return data?.products
  }

  return []
}

export const getProductQuery = (additionalFields = ``) => gql`
  query ProductQuery($locale: String, $sku: String, $productId: Int, $productIds: String, $model: String, $rows: Int, $identifier: String) {
    products(locale: $locale, sku: $sku, product_id: $productId, product_ids: $productIds, model: $model, rows: $rows, identifier: $identifier) {
      brand_id
      product_id
      product_url
      productImage
      price
      specialPrice
      oldPrice
      identifier
      name
      productSku
      cartProductId
      size
      has_special_price_i
      reviewAverage
      reviewTotal
      isSalable
      qty
      backorders
      productType
      #      category
      #      choices_facet
      #      eye_concern_facet
      #      hair_concern_facet
      #      hair_curl_type_facet
      #      hair_texture_facet
      #      key_ingredients_facet
      #      skin_concern_facet
      #      skin_type_facet
      #      age_facet
      #      coverage_facet
      #      finish_powder_facet
      #      foundation_finish_facet
      #      ec_category_nonindex
      #      manufacturer_facet
      #      category_name
      #      productSales
      #      productSalesLastWeek
      #      product_spend_range_t_mv
      ${additionalFields}
    }
  }
`

export const getProductQueryVariables = (routeParams = {}) => {
  const { product_id: productId, identifier, productSku, is_consent_needed: isConsentNeeded } = routeParams
  let variables = {}

  if (identifier && !isConsentNeeded) {
    variables = { identifier }
  } else if (productId && !isConsentNeeded) {
    variables = { productId: parseInt(productId) }
  } else if (productSku) {
    variables = {
      sku: Array.isArray(productSku) ? productSku.join(',') : `${productSku}`
    }
  }

  return { ...variables, locale: envConfig.locale }
}

/**
 * const { loading, data, error } = useProductQuery({ sku: skus, lazyQuery:true })
 * const { loading, data, error } = useProductQuery({ productIds: "100,101" }, `productSales`)
 * const { loading, data, error } = useProductQuery({ productId: 100 }, `
 *  category
 *  category_name
 *  `)
 *
 * @param queryVariables
 * @param additionalFields
 * @returns {QueryTuple<any, {productIds: *, locale: string}>}s
 */
const useProductQuery = (queryVariables = {}, additionalFields = '') => {
  let skip = false
  const { lazyQuery, productIds, sku } = queryVariables
  delete queryVariables.sku
  delete queryVariables.productIds
  delete queryVariables.lazyQuery
  const variables = {
    locale: envConfig.locale,
    ...queryVariables,
    model: composeModel()
  }

  if (isValidArray(productIds)) {
    variables.productIds = productIds.join(',')
  }
  if (isValidArray(sku)) {
    variables.sku = sku.filter(str => !!str).join(',')
  }
  if (typeof sku === 'string' && !!sku) {
    variables.sku = sku
  }
  if (typeof productIds === 'string' && !!productIds) {
    variables.productIds = productIds
  }
  if (!variables.sku && !variables.productIds) {
    skip = true // https://www.apollographql.com/docs/react/data/queries/#skip
  }

  const useHook = lazyQuery ? useLazyQuery : useQuery
  return useHook(getProductQuery(additionalFields), { variables, skip })
}

export default useProductQuery
