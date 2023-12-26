import gql from 'graphql-tag'

export default gql`
  query HomeQuery($locale: String, $model: String) {
    beautyiq: richContent(locale: $locale, type: "beautyiq,guide", rows: 4, model: $model) {
      sysId
      title
      fb_image
      category_name
      content
      name
    }
    routineCategories: routineCategory {
      category_id
      name
      slug
      url
      sortOrder
      concernIcon
      guideIcon
      routineIcon
    }
    offers(locale: $locale, rows: 5, model: $model) {
      data {
        id
        type
        name
        description
        redeem_url
        coupon_code
        brand_name
        promotion_banner
        auto_add
        gift_items {
          name
          identifier
          product_url
          productImage
          product_id
          brand_logo
          description
        }
      }
    }
    marketingBanner(locale: $locale) {
      identifier
      colour
      backgroundColour
      items {
        title
        description
        url
        publishDate
        unPublishDate
      }
    }
  }
`
