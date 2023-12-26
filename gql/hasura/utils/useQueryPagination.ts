import { DocumentNode } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import useScreenQuery, { ScreenQueryHookOptions, ScreenQueryResult } from '../../useScreenQuery'
import useHasuraQuery from './useHasuraQuery'

type ScreenQueryWithPaginationOptions = ScreenQueryHookOptions & {
  target?: string
  limit?: number
  mergeResults?: (previousQueryResult: any, fetchMoreResult: any) => any
  hasMoreResults?: (fetchMoreResult: any, variables: any) => boolean
  fetchMoreVariables?: (offset: number, limit: number) => any
}
type ScreenQueryWithPaginationResult = ScreenQueryResult & {
  hasNextPage: boolean
  isFetchingMore: boolean
  onEndReached: (items: []) => void
}

const useQueryPagination = (
  query: DocumentNode,
  {
    limit = 10,
    target = '',
    variables,
    mergeResults,
    hasMoreResults,
    fetchMoreVariables,
    ...options
  }: ScreenQueryWithPaginationOptions
): ScreenQueryWithPaginationResult => {
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false)
  const isFetchingMoreRef = useRef<boolean>(false)

  const updateFetchingMore = val => {
    setFetchingMore(val)
    isFetchingMoreRef.current = val
  }

  const queryResult = useScreenQuery(query, {
    variables: {
      ...variables,
      limit
    },
    useQueryHook: useHasuraQuery,
    ...options
  })
  const { fetchMore } = queryResult

  const handleReset = () => {
    updateFetchingMore(false)
    setHasNextPage(true)
  }

  useEffect(handleReset, [target, JSON.stringify(variables || {})])

  const handleEndReached = async items => {
    if (!hasNextPage || !items?.length || isFetchingMoreRef.current) {
      return
    }
    const offset = items.length
    if (limit > offset) {
      return
    }
    updateFetchingMore(true)
    await fetchMore({
      variables: fetchMoreVariables ? fetchMoreVariables(offset, limit) : { offset },
      updateQuery: (previousQueryResult: any, { fetchMoreResult, variables: queryVariables }: any) => {
        if (!fetchMoreResult) {
          setHasNextPage(false)
          return previousQueryResult
        }

        if (hasMoreResults && !hasMoreResults(fetchMoreResult, queryVariables)) {
          setHasNextPage(false)
        }
        if (mergeResults) {
          return mergeResults(previousQueryResult, fetchMoreResult)
        }

        return {
          ...previousQueryResult,
          [target]: [...previousQueryResult?.[target], ...fetchMoreResult?.[target]]
        }
      }
    })
    updateFetchingMore(false)
  }

  return {
    ...queryResult,
    hasNextPage,
    isFetchingMore,
    onEndReached: handleEndReached
  }
}

export default useQueryPagination
