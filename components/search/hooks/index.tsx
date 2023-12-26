import { useInfiniteHits, UseInfiniteHitsProps, useInstantSearch } from 'react-instantsearch-hooks'
import { BaseHit, ScopedResult } from 'instantsearch.js'
import { SearchResults } from 'algoliasearch-helper'
import { SortByItem } from 'instantsearch.js/es/connectors/sort-by/connectSortBy'
import { InfiniteHitsRenderState } from 'instantsearch.js/es/connectors/infinite-hits/connectInfiniteHits'
import React from 'react'
import envConfig from '../../../config/envConfig'
import { useSearchContext } from '../SearchProvider'
import { useSidebar, useSidebarContent } from '../../sidebar/SidebarContext'

export const useProductAttributes = () =>
  envConfig.algolia.attributes.slice().sort((a: any, b: any) => a.label.localeCompare(b.label))

export const useProductSortIndices = (): SortByItem[] => {
  const items: [] = envConfig.algolia.sortIndices
  return items
}

export const useProductResultsSortOption = (indexName: string) => {
  const results = useResults(indexName)
  const sortIndices = useProductSortIndices()
  return sortIndices.find((item: any) => item.value === results.index)
}

type ResultsType = SearchResults<any> & {
  nbRefinements?: number
}

export const useResults = (indexName: string): ResultsType => {
  const { scopedResults } = useInstantSearch()
  const scopedResult: ScopedResult | undefined = scopedResults.find(item => item.indexId === indexName)

  const results: ResultsType = scopedResult?.results as ResultsType
  const nbRefinements: number = scopedResult?.results?.getRefinements()?.length || 0

  return {
    ...results,
    nbRefinements
  } as ResultsType
}

type SearchStatusType = InfiniteHitsRenderState & {
  error?: boolean
  loading?: boolean
  hasResults?: boolean
  nbHits: number
}

export const useInfiniteHitsResults = (props: {} | UseInfiniteHitsProps<BaseHit>): SearchStatusType => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits(props)
  const { error } = useInstantSearch({ catchError: true })
  const { processingTimeMS = 0 } = results || {}
  const loading: boolean = processingTimeMS === 0
  const nbHits: number = results?.nbHits || 0

  return ({
    loading,
    error,
    hasResults: nbHits > 0 && !loading,
    isLastPage,
    showMore,
    results,
    hits,
    nbHits
  } as unknown) as SearchStatusType
}

export const useClearAttributeRefinement = () => {
  const { setIndexUiState } = useInstantSearch()

  const clearRefinement = (attribute: string) => {
    setIndexUiState({ refinementList: { [attribute]: [] } })
  }
  const clearAllRefinements = () => {
    setIndexUiState({ refinementList: {} })
  }
  return { clearRefinement, clearAllRefinements }
}

export const useSearchProductsSidebar = (component: React.ReactNode, deps = []) => {
  const { sidebarType, setSidebarType } = useSearchContext()
  const { openDrawer, setWidth: setSidebarWidth, resetWidth: resetSidebarWidth } = useSidebar()
  // TODO re-enable sidebar content render
  useSidebarContent(component, deps)

  const openSidebar = (type: string) => {
    setSidebarType(type)
    openDrawer()
  }
  return { openSidebar }
}
