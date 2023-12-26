import gql from 'graphql-tag'

export default gql`
  query BeautyIqQuery(
    $locale: String
    $page: Int
    $rows: Int
    $type: String
    $categoryId: String
    $categorySlug: String
    $model: String
  ) {
    beautyiq: richContent(
      locale: $locale
      rows: $rows
      page: $page
      type: $type
      category_id: $categoryId
      category_slug: $categorySlug
      model: $model
    ) {
      sysId
      category_id
      category_slug
      title
      fb_image
      category_name
      name
      content
    }
  }
`
