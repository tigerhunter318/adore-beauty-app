import gql from 'graphql-tag'
import { ProductFragments } from './ProductFragments'

const ProductsListQuery = gql`
  ${ProductFragments}
  query app_ProductsListQuery(
    $conditions: products_bool_exp!
    $variationCondition: products_bool_exp
    $limit: Int
    $includeVariations: Boolean = false
    $orderBy: [products_order_by!]
  ) {
    products(where: $conditions, limit: $limit, order_by: $orderBy) {
      ...productMetadata
      ...productFields
      ...productPrices
      ...productBrandName
      ...productInventories
      ...productImage
      variations(where: $variationCondition) @include(if: $includeVariations) {
        color
        ...productFields
        ...productPrices
        ...productInventories
      }
    }
  }
`

export default ProductsListQuery
