import gql from 'graphql-tag'

export default gql`
  query app_ProductReviewsQuery($conditions: products_bool_exp!, $limit: Int, $offset: Int) {
    reviews(where: { product: $conditions }, limit: $limit, offset: $offset) {
      id
      title
      nickname
      detail
      rating_value
      recommend
      created_at
      updated_at
    }
  }
`
