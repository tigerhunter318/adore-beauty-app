import gql from 'graphql-tag'
import { formatProductUrlPath } from '../../../utils/format'
import { ProductFragments } from './ProductFragments'

export const formatProductDetailQueryConditions = (params: any) => {
  const { productSku, identifier, product_url: productUrl, url, product_id: productId } = params || {}
  const urlPath = productUrl || url

  const formatConditionWithVariant = condition => ({
    _or: [{ variations: condition }, { ...condition, comestri_parent_id: { _is_null: true } }]
  })

  const formatCondition = condition => ({ ...condition, comestri_parent_id: { _is_null: true } })

  if (urlPath) {
    return formatCondition({ metadata: { url_path: { _eq: formatProductUrlPath(urlPath) } } })
  }
  if (productSku) {
    const sku = Array.isArray(productSku) ? productSku[0] : productSku
    return formatConditionWithVariant({ sku: { _eq: `${sku}` } })
  }
  if (identifier) {
    return formatCondition({ metadata: { comestri_url_key: { _ilike: `${identifier}` } } })
  }
  if (productId) {
    return formatCondition({ magento_product_id: { _eq: parseInt(productId) } })
  }
}

export default gql`
  ${ProductFragments}
  query app_ProductDetailQuery($conditions: products_bool_exp!) {
    products(where: $conditions) {
      __cache_as_productDetail: __typename
      ...productMetadata
      ...productFields
      size
      short_description
      ingredients
      is_tga_restricted
      is_consent_required
      has_findation
      ...productPrices
      ...productTopLevelCategory
      ...productBrandCategory
      ...productInventories
      ...productFacets
      ...productReviewTotals
      ...productGalleryImages
      variations {
        color
        ...productFields
        ...productPrices
        ...productInventories
        ...productGalleryImages
      }
    }
  }
`
