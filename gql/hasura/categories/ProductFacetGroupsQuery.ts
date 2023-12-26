import gql from 'graphql-tag'

const ProductFacetGroupsQuery = gql`
  query app_ProductFacetGroupsQuery($categoryCondition: categories_bool_exp, $productCondition: products_bool_exp) {
    subCategories: categories(where: $categoryCondition) {
      children_aggregate(limit: 1) {
        aggregate {
          count
        }
      }
    }

    facets: product_facet_groups_view(
      distinct_on: [facet_group_name]
      where: { product: $productCondition, facet_group_name: { _neq: "Brand" } }
      order_by: { facet_group_name: asc_nulls_last }
    ) {
      id: facet_group_id
      label: facet_group_name
      code: facet_group_code
    }
  }
`

export default ProductFacetGroupsQuery
