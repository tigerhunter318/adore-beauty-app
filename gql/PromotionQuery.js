import gql from 'graphql-tag'

export default gql`
  query PromotionsPageQuery($locale: String) {
    carousal(locale: $locale, position: "promotion_top_carousel") {
      mobile_image
      url
    }
    banner: carousal(locale: $locale, position: "promo_offers_tabs") {
      image
      url
    }
    promoFooter: staticBlock(locale: $locale, identifier: "promo-footer-block") {
      content
    }
    offerCategories: offersCategory(locale: $locale) {
      category_id
      category_name
      category_slug
    }
    offersBrand(locale: $locale) {
      brand_id
      brand_name
      brand_logo
      brand_slug
      letters
    }
  }
`
