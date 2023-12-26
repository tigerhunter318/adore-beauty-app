import gql from 'graphql-tag'
import { promotionsConfig, PromotionsQueryFragment } from './PromotionsQueryFragments'

const CategoriesPromotionsQuery = gql`
  query app_CategoriesPromotionsQuery($queryDate: timestamp, $display_locations: jsonb_comparison_exp) {
    categories(
      where: { 
        _and: [
          { path_tree: { _matches: "au.default.*{1}" } }, 
          { include_in_navigation_menu: { _eq: true } }
        ]
        promotions: {
          promotion:{
            display_locations: $display_locations
            is_site_wide: {_eq: false},
            ${promotionsConfig}
          }
        }
      }
      order_by: { name: asc_nulls_last }
    ) {
      id
      comestri_category_id
      comestri_parent_id
      name
      identifier
      path
      path_tree
      ${PromotionsQueryFragment}
    }
  }
`

export default CategoriesPromotionsQuery
