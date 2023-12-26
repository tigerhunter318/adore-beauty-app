import gql from 'graphql-tag'
import { CategoryFragments } from './CategoryFragments'

const TopLevelCategoriesQuery = gql`
  ${CategoryFragments}
  query app_TopLevelCategoriesQuery($categoryConditions: categories_bool_exp) {
    topLevelCategories: categories(where: $categoryConditions, order_by: { sort_order: asc }) {
      ...categoryFields
    }
    specials: categories(where: { metadata: { url_path: { _eq: "/c/specials.html" } } }) {
      children(
        where: { include_in_navigation_menu: { _eq: true }, is_active: { _eq: true } }
        order_by: { sort_order: asc }
      ) {
        ...categoryFields
      }
    }
  }
`

export default TopLevelCategoriesQuery
