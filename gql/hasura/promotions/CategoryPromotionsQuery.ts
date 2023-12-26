import gql from 'graphql-tag'
import { PromotionsQueryFragment } from './PromotionsQueryFragments'

const CategoryPromotionsQuery = gql`
      query app_CategoryPromotionsQuery($where: categories_bool_exp, $queryDate: timestamp, $display_locations: jsonb_comparison_exp) { 
        categories(
          where: $where 
        ) {
          id   
          name
          identifier
          image_link
          ${PromotionsQueryFragment}
        }
      }
    `

export default CategoryPromotionsQuery
