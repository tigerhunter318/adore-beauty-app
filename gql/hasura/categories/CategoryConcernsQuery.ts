import gql from 'graphql-tag'

const CategoryConcernsQuery = gql`
  query app_CategoryConcernsQuery($condition: categories_bool_exp, $skipChildren: Boolean!) {
    concerns: categories(where: $condition) {
      name
      metadata {
        url_path
      }
      children @skip(if: $skipChildren) {
        name
        metadata {
          url_path
        }
        images(where: { image: { tags: { _eq: ["concern_icon"] } } }) {
          image {
            url_relative
          }
        }
      }
      images(where: { image: { tags: { _eq: ["concern_icon"] } } }) {
        image {
          url_relative
        }
      }
    }
  }
`

export default CategoryConcernsQuery
