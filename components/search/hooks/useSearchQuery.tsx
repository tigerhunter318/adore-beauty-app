import { useSearchContext } from '../SearchProvider'

export const useSearchQuery = () => {
  const {
    searchQuery,
    setSearchQuery,
    recentSearchTerms,
    setRecentSearchTerms,
    searchInputTerm,
    setSearchInputTerm
  } = useSearchContext()

  const updateSearchQueries = (params: string) => {
    setSearchQuery(params)
    setSearchInputTerm(params)
  }

  return {
    searchQuery,
    setSearchQuery,
    recentSearchTerms,
    setRecentSearchTerms,
    searchInputTerm,
    setSearchInputTerm,
    updateSearchQueries
  }
}
