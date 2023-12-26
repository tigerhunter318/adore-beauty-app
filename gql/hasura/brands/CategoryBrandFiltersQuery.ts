import gql from 'graphql-tag'

const CategoryBrandFiltersQuery = gql`
  query app_CategoryBrandFiltersQuery($condition: brands_bool_exp, $offset: Int, $limit: Int) {
    brands(where: $condition, limit: $limit, offset: $offset, order_by: { name: asc }) {
      name
      identifier
    }
  }
`

export default CategoryBrandFiltersQuery
