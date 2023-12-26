import gql from 'graphql-tag'
import { PromotionQueryFragment, promotionsConfig } from './PromotionsQueryFragments'

const getPromotionsQuery = (limit = 5) => gql`
    query app_PromotionsQuery($queryDate: timestamp) {
      promotions( 
        where: {
          ${promotionsConfig},
          display_locations: { _contains: { is_featured_widget: true } }
        } 
        order_by: [
          { is_featured: desc_nulls_last }
          { sort_order: asc_nulls_last },
        ]
        limit: ${limit}
        ) {
          ${PromotionQueryFragment}
        }
      }
    `

export default getPromotionsQuery
