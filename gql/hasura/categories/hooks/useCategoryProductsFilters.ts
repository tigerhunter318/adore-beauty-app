import { useCategoryContext } from '../../../../components/category/CategoryProvider'
import { formatUrlPathQueryVariables } from '../../utils/format'
import { isBrandUrl } from '../../../../utils/validation'
import { formatCategoryProductsQuery } from '../CategoryProductsQuery'
import useHasuraQuery from '../../utils/useHasuraQuery'
import formatSideBarFilters from '../../../../components/category/utils/formatSideBarFilters'
import ProductFacetGroupsQuery from '../ProductFacetGroupsQuery'

const useCategoryProductsFilters = (url: string, parentCategoryUrl: string) => {
  const { selectedFacets } = useCategoryContext()
  const { data, loading } = useHasuraQuery(ProductFacetGroupsQuery, {
    variables: {
      categoryCondition: formatUrlPathQueryVariables(parentCategoryUrl || url),
      productCondition: formatCategoryProductsQuery(selectedFacets)
    },
    skip: !url
  })

  const facetGroups = [{ code: 'price', label: 'Price' }, ...(data?.facets || [])]

  if (!isBrandUrl(url)) {
    facetGroups.unshift({ code: 'brand', label: 'Brand' })
  }

  if (data?.subCategories?.[0]?.children_aggregate?.aggregate?.count) {
    facetGroups.unshift({ code: 'subCategory', label: 'Category' })
  }

  const formattedFilters = formatSideBarFilters(facetGroups, selectedFacets?.facets)

  return { formattedFilters, loading }
}

export default useCategoryProductsFilters
