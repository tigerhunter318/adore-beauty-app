import gql from 'graphql-tag'
import { CategoryFragments } from './CategoryFragments'

const CategorySubCategoriesFiltersQuery = gql`
  ${CategoryFragments}
  query app_CategorySubCategoriesFiltersQuery(
    $categoryConditions: categories_bool_exp
    $productConditions: categories_bool_exp
  ) {
    subCategories: categories(where: $categoryConditions, order_by: { sort_order: asc }) {
      ...categoryFields
      children(where: $productConditions, order_by: { name: asc }) {
        ...categoryFields
      }
    }
  }
`

export default CategorySubCategoriesFiltersQuery
