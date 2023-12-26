import gql from 'graphql-tag'
import envConfig from '../config/envConfig'
import { formatUrlPath } from '../utils/format'
import { isBeautyIQUrl } from '../navigation/router/screenRouter'

export default gql`
  query PostQuery($locale: String, $sysId: String, $url: String, $url_path: String, $model: String) {
    richContent(locale: $locale, sysId: $sysId, url: $url, url_path: $url_path, model: $model) {
      sysId
      store_id
      name
      url
      url_path
      type
      identifier
      category_name
      category_id
      category_url
      category_slug
      isBrand
      feature_image
      publishDate
      author_name
      author_avatar
      author_slug
      author_url
      subTitle
      seo_desc
      top_heading
      content_heading
      content
      fb_image
      twitterImage
      isConsentNeeded
      postContent {
        type
        content
      }
      related {
        author_avatar
        author_name
        image
        feature_image
        sysId
        name
        url
        updatedAt
        category_name
      }
      products {
        identifier
        product_id
        product_url
        productImage
        productType
        productSku
        name
        brand_name
        has_special_price
        price
        oldPrice
        specialPrice
        reviewAverage
        reviewTotal
        productSku
        cartProductId
        isSalable
        inStock
        qty
        backorders
      }
    }
  }
`

export const getPostQueryVariables = (routeParams = {}) => {
  let { sysId, url, url_path } = routeParams
  let variables = {}
  if (isBeautyIQUrl(url) && !url_path) {
    url_path = formatUrlPath(url)
  }

  if (sysId) {
    variables = { sysId }
  } else if (url_path) {
    variables = { url_path }
  } else if (url) {
    variables = { url }
  }

  return { ...variables, locale: envConfig.locale }
}
