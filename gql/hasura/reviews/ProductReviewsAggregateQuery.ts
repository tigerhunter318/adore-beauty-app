import gql from 'graphql-tag'

export default gql`
  query app_ProductReviewsAggregateQuery($conditions: products_bool_exp!) {
    recommendation_total: reviews_aggregate(
      where: { product: $conditions, recommend: { _in: ["definitely_yes", "likely"] } }
    ) {
      aggregate {
        count
      }
    }
    review_total: reviews_aggregate(where: { product: $conditions }) {
      aggregate {
        count
        avg {
          rating_value
        }
      }
    }
    most_recent_positive: reviews(
      where: { product: $conditions }
      limit: 1
      order_by: [{ rating_value: desc }, { created_at: desc }]
    ) {
      id
      title
      nickname
      detail
      rating_value
      recommend
      created_at
      updated_at
    }
    most_recent_criticism: reviews(
      where: { product: $conditions }
      limit: 1
      order_by: [{ rating_value: asc }, { created_at: desc }]
    ) {
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
