import gql from 'graphql-tag'

const BrandsQuery = gql`
  query app_BrandsQuery($condition: categories_bool_exp, $limit: Int, $offset: Int) {
    categories(where: $condition, order_by: { name: asc_nulls_last }, limit: $limit, offset: $offset) {
      name_raw
      metadata {
        url_path
      }
      images(where: { image: { tags: { _contains: "brand_logo" } } }, limit: 1) {
        image {
          url_relative
        }
      }
    }
    categories_aggregate(where: $condition) {
      aggregate {
        count
      }
    }
  }
`

export default BrandsQuery
