import React from 'react'
import { useCategoryContext } from './CategoryProvider'
import SideBarList from './SideBarList'
import envConfig from '../../config/envConfig'
import { useSidebar } from '../sidebar/SidebarContext'

type CategoryProductsSortProps = { isVisible?: boolean }

const CategoryProductsSort = ({ isVisible }: CategoryProductsSortProps) => {
  const { setAppliedSortOption, appliedSortOption } = useCategoryContext()
  const { closeDrawer } = useSidebar()

  const handleChange = (option: any) => {
    setAppliedSortOption(option)
    closeDrawer()
  }

  if (!isVisible) return null

  return (
    <SideBarList
      currentRefinement={appliedSortOption.label || 'Recommended'}
      onChange={handleChange}
      data={envConfig.hasura.categorySortIndexes}
    />
  )
}

export default CategoryProductsSort
