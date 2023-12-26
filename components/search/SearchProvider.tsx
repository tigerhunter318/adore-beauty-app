import React, { useContext, useState } from 'react'
import { InstantSearch } from 'react-instantsearch-hooks'
import envConfig from '../../config/envConfig'
import searchClient from '../../services/algolia'

type SearchContextProps = {
  recentSearchTerms?: any
  setRecentSearchTerms?: any
  sidebarType?: string
  setSidebarType?: any
  searchQuery?: string
  setSearchQuery?: any
  searchInputTerm?: string
  setSearchInputTerm?: any
}

const initialValue: SearchContextProps = {
  recentSearchTerms: null,
  sidebarType: 'filter',
  searchQuery: undefined,
  searchInputTerm: undefined
}

export const SearchContext = React.createContext(initialValue)

export const useSearchContext = () => useContext(SearchContext)

/**
 * Search Context & Provider
 *
 * @usage
 * <SearchProvider>
 *   <Container></Container>
 * </SearchProvider>
 *
 * const Component = () => {
 *   const {setContextState, contextState} = React.useContext(SearchContext)
 * }
 *
 * @param children
 */
type SearchProviderProps = {
  children: any
}
const SearchProvider = ({ children }: SearchProviderProps) => {
  const [recentSearchTerms, setRecentSearchTerms] = useState(null)
  const [sidebarType, setSidebarType] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchInputTerm, setSearchInputTerm] = useState<string>('')

  return (
    <SearchContext.Provider
      value={{
        recentSearchTerms,
        setRecentSearchTerms,
        sidebarType,
        setSidebarType,
        searchQuery,
        setSearchQuery,
        searchInputTerm,
        setSearchInputTerm
      }}
    >
      <InstantSearch searchClient={searchClient} indexName={envConfig.algolia.productIndex}>
        {children}
      </InstantSearch>
    </SearchContext.Provider>
  )
}

export default SearchProvider
