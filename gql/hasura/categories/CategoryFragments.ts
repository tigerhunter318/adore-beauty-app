import gql from 'graphql-tag'

export const CategoryFragments = gql`
  fragment categoryFields on categories {
    name
    identifier
    magento_category_id
    metadata {
      url_path
    }
  }

  fragment categoryBrandImages on categories {
    images(where: { image: { tags: { _has_keys_any: ["brand_logo", "banner_image"] } } }) {
      image {
        url_relative
        tags
      }
    }
  }
`
