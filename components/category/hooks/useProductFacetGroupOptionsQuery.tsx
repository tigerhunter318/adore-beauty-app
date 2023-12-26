import { formatCategoryProductsQuery } from '../../../gql/hasura/categories/CategoryProductsQuery'
import ProductFacetGroupOptionsQuery from '../../../gql/hasura/categories/ProductFacetGroupOptionsQuery'
import useHasuraQuery from '../../../gql/hasura/utils/useHasuraQuery'
import useQueryPagination from '../../../gql/hasura/utils/useQueryPagination'
import useCategoryFilters from './useCategoryFilters'
import {
  parentProductCondition,
  productNotSoldOutCondition,
  productVisibleInCatalogOrSearchCondition,
  simpleProductCondition
} from '../../../gql/hasura/products/ProductConditions'

const useProductFacetGroupOptionsQuery = ({ code, skip = false }: { code: string; skip: boolean }) => {
  const { selectedFacets } = useCategoryFilters()
  const target = 'options'

  const visibility = productVisibleInCatalogOrSearchCondition
  const inventoryCondition = {
    _or: [
      {
        ...simpleProductCondition,
        visibility,
        ...productNotSoldOutCondition
      },
      {
        // avoid checking variation inventory for facet options as the query is too slow
        ...parentProductCondition,
        visibility
      }
    ]
  }

  const variables = {
    code,
    productCondition: formatCategoryProductsQuery(selectedFacets, code, inventoryCondition)
  }

  const queryResults = useQueryPagination(ProductFacetGroupOptionsQuery, {
    variables,
    useQueryHook: useHasuraQuery,
    formatResponse: response => response?.[target],
    hasMoreResults: (fetchMoreResult, { limit }) => fetchMoreResult?.[target]?.length === limit,
    target,
    limit: 40,
    skip
  })

  return {
    ...queryResults,
    selectedFacetOptions: selectedFacets?.facets?.[code]
  }
}

export default useProductFacetGroupOptionsQuery
