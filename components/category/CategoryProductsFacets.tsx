import React from 'react'
import { useSafeInsets, vh } from '../../utils/dimensions'
import SideBarList from './SideBarList'
import Loading from '../ui/Loading'
import useCategoryProductsFilters from '../../gql/hasura/categories/hooks/useCategoryProductsFilters'

type CategoryProductsFilterProps = {
  onChange: (payload: any) => void
  url: string
  parentCategoryUrl: string
}

const CategoryProductsFacets = ({ onChange, url, parentCategoryUrl }: CategoryProductsFilterProps) => {
  const { formattedFilters, loading } = useCategoryProductsFilters(url, parentCategoryUrl)
  const { bottom: safeBottomPadding } = useSafeInsets()

  if (loading) return <Loading lipstick style={{ height: vh(80) }} />

  return (
    <SideBarList
      onChange={onChange}
      data={formattedFilters}
      hasNestedOptions
      contentContainerStyle={{ paddingBottom: safeBottomPadding }}
    />
  )
}

export default CategoryProductsFacets
