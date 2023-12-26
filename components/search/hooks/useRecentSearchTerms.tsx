import { useEffect } from 'react'
import { getAsyncStorageItem, setAsyncStorageItem } from '../../../utils/asyncStorage'
import { useSearchQuery } from './useSearchQuery'

const storage = 'recentSearchTerms'

const removeRecentSearchTermsToLocalStorage = async (query: string) => {
  const locallyStoredSearchTerms = (await getAsyncStorageItem(storage)) || []

  const recentSearchTerms = locallyStoredSearchTerms?.filter((item: any) => item !== query)

  await setAsyncStorageItem(storage, recentSearchTerms)

  return recentSearchTerms
}

const addRecentSearchTermsToLocalStorage = async (query: string) => {
  const locallyStoredSearchTerms = (await getAsyncStorageItem(storage)) || []

  if (!locallyStoredSearchTerms?.find((item: any) => item === query)) {
    locallyStoredSearchTerms.unshift(query)
  }

  const recentSearchTerms = locallyStoredSearchTerms?.filter((x: any) => x)?.slice(0, 100) || []

  await setAsyncStorageItem(storage, recentSearchTerms)

  return recentSearchTerms
}

export const useRecentSearchTerms = () => {
  const { setRecentSearchTerms, recentSearchTerms } = useSearchQuery()

  const removeRecentSearchTerm = async (inputValue: any) => {
    const searchQuery = await removeRecentSearchTermsToLocalStorage(inputValue)
    setRecentSearchTerms(searchQuery)
  }

  const addRecentSearchTerm = async (inputValue: any) => {
    const searchQuery = await addRecentSearchTermsToLocalStorage(inputValue)
    setRecentSearchTerms(searchQuery)
  }

  const resetRecentSearchTerms = async () => {
    setAsyncStorageItem(storage, [])
    setRecentSearchTerms([])
  }

  const onMount = () => {
    const fetchSearchTerms = async () => {
      const locallyStoredSearchTerms = await getAsyncStorageItem(storage)
      setRecentSearchTerms(locallyStoredSearchTerms || [])
    }

    if (recentSearchTerms === null) {
      fetchSearchTerms()
    }
  }

  useEffect(onMount, [recentSearchTerms])

  return { addRecentSearchTerm, resetRecentSearchTerms, recentSearchTerms, removeRecentSearchTerm }
}
