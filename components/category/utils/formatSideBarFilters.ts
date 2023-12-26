import { isValidObject } from '../../../utils/validation'

const formatSideBarFilters = (facetGroups, selectedFacets) => {
  if (!isValidObject(facetGroups)) return []

  return Object.values(facetGroups).map((filter: any) => ({
    ...filter,
    right: null,
    activeFiltersCount: isValidObject(selectedFacets) ? selectedFacets?.[filter.code]?.length : 0
  }))
}

export default formatSideBarFilters
