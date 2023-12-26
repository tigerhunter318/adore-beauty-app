import gql from 'graphql-tag'
import { CategoryFragments } from './CategoryFragments'

const SubCategoriesQuery = gql`
  ${CategoryFragments}
  query app_SubCategoriesQuery(
    $categoryConditions: categories_bool_exp
    $childCategoryConditions: categories_bool_exp = {}
  ) {
    subCategories: categories(where: $categoryConditions, order_by: { sort_order: asc }) {
      ...categoryFields
      children(where: $childCategoryConditions, order_by: { sort_order: asc }) {
        ...categoryFields
        children(where: $childCategoryConditions, order_by: { sort_order: asc }) {
          ...categoryFields
        }
      }
    }
  }
`

export default SubCategoriesQuery
