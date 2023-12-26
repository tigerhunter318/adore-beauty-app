import gql from 'graphql-tag'
import { PromotionsQueryFragment } from './PromotionsQueryFragments'

const BrandPromotionsQuery = gql`
      query app_BrandPromotionsQuery($where: brands_bool_exp, $queryDate: timestamp, $display_locations: jsonb_comparison_exp) { 
        brands(
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

export default BrandPromotionsQuery
