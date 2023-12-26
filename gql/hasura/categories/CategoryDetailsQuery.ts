import gql from 'graphql-tag'
import { CategoryFragments } from './CategoryFragments'

const CategoryDetailsQuery = gql`
  ${CategoryFragments}
  query app_CategoryDetailsQuery($conditions: categories_bool_exp, $brandConditions: categories_bool_exp) {
    categories(where: $conditions, order_by: { magento_category_id: asc_nulls_last }) {
      name_raw
      is_brand_category
      magento_category_id
      comestri_category_id
      is_consent_required
    }

    brand_category: categories(where: $brandConditions, limit: 1) {
      ...categoryBrandImages
    }
  }
`

export default CategoryDetailsQuery
