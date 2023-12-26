import gql from 'graphql-tag'
import { promotionsConfig, PromotionsQueryFragment } from './PromotionsQueryFragments'

const BrandsPromotionsQuery = gql`
    query app_BrandsPromotionsQuery($queryDate: timestamp, $display_locations: jsonb_comparison_exp) {
      brands(
        where: { 
        promotions: {
          promotion: {
            display_locations: $display_locations,
            is_site_wide: {_eq: false},
            ${promotionsConfig}
          } 
        } 
      } order_by: { name: asc_nulls_last } ) {
        id
        comestri_brand_id
        name
        image_link
        ${PromotionsQueryFragment}
      }
    }
  `

export default BrandsPromotionsQuery
