import gql from 'graphql-tag'

const ProductFacetGroupOptionsQuery = gql`
  query app_ProductFacetGroupOptionsQuery(
    $code: String
    $productCondition: products_bool_exp
    $offset: Int
    $limit: Int
  ) {
    options: product_facet_group_options_view(
      distinct_on: [facet_group_option_name]
      where: { facet_group_code: { _eq: $code }, product: $productCondition }
      order_by: { facet_group_option_name: asc_nulls_last }
      limit: $limit
      offset: $offset
    ) {
      id: facet_group_option_id
      name: facet_group_option_name
      code: facet_group_option_code
    }
  }
`

export default ProductFacetGroupOptionsQuery
