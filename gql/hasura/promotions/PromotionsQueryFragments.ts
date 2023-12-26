import envConfig from '../../../config/envConfig'

export const promotionsConfig = `
  is_active: { _eq: true },
  for: { _in: ["all", "app"] },
  _and: [
    { start_date: { _lte: $queryDate} },
    { end_date: { _gte: $queryDate} }
  ],
  promotion_rules: {
    promotion_rule_actions: {
      products: {
        product: {
          description: { _is_null: false }
          inventories: { is_available: { _eq: true } }
        }
      }
    }
  },
  catalogues: {
    catalogue: {
      locale: { _eq: "${envConfig.locale}" }
    }
  }
`

export const PromotionQueryFragment = `
  redeem_url
  message
  site_message
  display_name
  id
  sort_order
  promotion_code_settings {
    code
  }
  promotion_rules {
    promotion_rule_actions {
      add_free_item
      amount
      brands {
        brand {
          id
          name
          image_link
          comestri_brand_id
        }
      }
      categories {
        category {
          id
          name
          comestri_category_id
        }
      }
      products {
        product {
          id
          name
          description
          comestri_product_id
          images {
            image {
              url_relative
            }
          }
          brands {
            brand {
              image_link
              comestri_brand_id
            }
          }
        }
      }
    }
    promotion_rule_conditions {
      categories {
        item_matcher_condition
        category {
          comestri_category_id
          name
        }
      }
    }
  }
`

export const PromotionsQueryFragment = `
  promotions(
    where:{
      promotion:{
        display_locations: $display_locations
        is_site_wide: {_eq: false},
        ${promotionsConfig}
      }
    }
  ) {
    promotion {
      ${PromotionQueryFragment}
    }
  }
`
