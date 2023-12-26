import { formatCategoryProductsQuery } from '../../../gql/hasura/categories/CategoryProductsQuery'
import CategoryBrandFiltersQuery from '../../../gql/hasura/brands/CategoryBrandFiltersQuery'
import useHasuraQuery from '../../../gql/hasura/utils/useHasuraQuery'
import useQueryPagination from '../../../gql/hasura/utils/useQueryPagination'
import useCategoryFilters from './useCategoryFilters'

const useCategoryBrandsFilters = ({ skip }: { skip: boolean }) => {
  const { selectedFacets } = useCategoryFilters()
  const target = 'brands'

  const formatResponse = response => response?.[target]?.map(brand => ({ name: brand.name, code: brand.identifier }))

  const queryResults = useQueryPagination(CategoryBrandFiltersQuery, {
    variables: {
      condition: {
        products: { product: formatCategoryProductsQuery(selectedFacets, 'brand') }
      }
    },
    useQueryHook: useHasuraQuery,
    hasMoreResults: (fetchMoreResult, { limit }) => fetchMoreResult?.[target]?.length === limit,
    formatResponse,
    limit: 20,
    target,
    skip
  })

  return {
    ...queryResults,
    brands: queryResults?.data
  }
}

export default useCategoryBrandsFilters
