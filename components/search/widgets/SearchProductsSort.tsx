import React from 'react'
import { useSortBy } from 'react-instantsearch-hooks'
import SideBarList from '../../category/SideBarList'
import { useProductSortIndices } from '../hooks'
import { useSidebar } from '../../sidebar/SidebarContext'

type SearchProductsSortProps = { isVisible?: boolean }

const SearchProductsSort = ({ isVisible }: SearchProductsSortProps) => {
  const sortIndices = useProductSortIndices()
  const { options, refine, currentRefinement } = useSortBy({ items: sortIndices })
  const { closeDrawer } = useSidebar()

  const handleSortOptionPress = (item: any) => {
    refine(item.value)
    closeDrawer()
  }

  if (!isVisible) return null

  return (
    <SideBarList
      currentRefinement={options?.find(item => item.value === currentRefinement)?.label}
      data={options}
      onChange={handleSortOptionPress}
    />
  )
}

export default SearchProductsSort
