import gql from 'graphql-tag'

export default gql`
  query TopLevelCategoryQuery($locale: String) {
    category(locale: $locale, parent_id: 2) {
      name
      url
      id
      url_key
    }
  }
`
