import gql from 'graphql-tag'
import { isValidArray, isValidObject } from '../utils/validation'
import { formatPageIdentifier, formatPagePath } from '../utils/format'

export default gql`
  query PageTypeQuery(
    $identifier: String
    $url: String
    $url_key: String
    $includeProducts: Boolean = true
    $includeArticles: Boolean = true
    $includeCategories: Boolean = true
  ) {
    product: products(identifier: $identifier) @include(if: $includeProducts) {
      product_id
      name
      identifier
      url: product_url
    }
    article: richContent(url: $url) @include(if: $includeArticles) {
      sysId
      name
      url
      url_path
    }
    category(url_key: $url_key) @include(if: $includeCategories) {
      id
      name
      url
      url_key
    }
  }
`

export const parsePageTypeQueryResult = (data, path) => {
  if (!isValidObject(data)) return null

  const keys = Object.keys(data)
  let match = null

  if (isValidArray(keys)) {
    // match provided url to graph node result
    keys.forEach(key => {
      let content
      if (isValidArray(data[key])) {
        if (key === 'product') {
          ;[content] = data[key] // first match
        } else if (key === 'article') {
          ;[content] = data[key]
        } else if (key === 'category') {
          content = data[key].find(item => formatPagePath(item.url, true) === path) // graphql return multiple matches
        }
      }
      if (isValidObject(content)) {
        match = { ...content, type: key }
      }
    })
  }
  return match
}
