import React, { useState, createContext, useContext, Dispatch, SetStateAction } from 'react'
import envConfig from '../../config/envConfig'

type CategoryContextProps = {
  sidebarType?: string
  selectedFacets: { facets: any }
  appliedSortOption?: any
  setSelectedFacets?: Dispatch<SetStateAction<any>>
  setSelectedFacetsState?: Dispatch<SetStateAction<any>>
  setAppliedSortOption?: Dispatch<SetStateAction<string>>
  setSidebarType?: Dispatch<SetStateAction<string | undefined>>
}

const initialValue: CategoryContextProps = {
  sidebarType: 'filter',
  appliedSortOption: { ...envConfig.hasura.categorySortIndexes[0] },
  selectedFacets: null
}

const CategoryContext = createContext<CategoryContextProps>(initialValue)

export const useCategoryContext = () => useContext(CategoryContext)

const CategoryProvider = ({ children }: { children: JSX.Element }) => {
  const [appliedSortOption, setAppliedSortOption] = useState<string>(initialValue.appliedSortOption)
  const [sidebarType, setSidebarType] = useState<string | undefined>()
  const [selectedFacets, setSelectedFacetsState] = useState<any>()

  const contextVariables = {
    sidebarType,
    setSidebarType,
    appliedSortOption,
    setAppliedSortOption,
    selectedFacets,
    setSelectedFacetsState
  }

  return <CategoryContext.Provider value={contextVariables}>{children}</CategoryContext.Provider>
}

export default CategoryProvider
