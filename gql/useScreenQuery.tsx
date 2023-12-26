import React, { useState } from 'react'
import { DocumentNode, QueryHookOptions, QueryResult, useQuery } from '@apollo/client'
import { useScreenFocusEffect } from '../hooks/useScreen'
import useRefreshControl from '../hooks/useRefreshControl'
import GraphQLError from '../components/error/GraphQLError'
import Loading from '../components/ui/Loading'

export type ScreenQueryHookOptions = QueryHookOptions & {
  LoaderComponent?: JSX.Element
  formatResponse?: Function
  useQueryHook?: Function
}

export type ScreenQueryResult = QueryResult & {
  refreshControl: JSX.Element
  refreshing: boolean
  complete: boolean
  handleRefresh: (() => void) | null | undefined
  initialComponent: JSX.Element
}

const useScreenQuery = (
  query: DocumentNode,
  { variables, LoaderComponent, useQueryHook = useQuery, skip = false, formatResponse, ...rest }: ScreenQueryHookOptions
): ScreenQueryResult => {
  const [isScreenFocused, setScreenFocused] = useState<boolean>(false)
  const queryResult: QueryResult = useQueryHook(query, { variables, skip: skip || !isScreenFocused, ...rest })
  const { error, data, refetch, loading, fetchMore } = queryResult
  const { refreshControl, refreshing, handleRefresh } = useRefreshControl(refetch)
  let initialComponent

  const handleScreenFocus = () => {
    if (!isScreenFocused) {
      setScreenFocused(true)
    }
  }

  useScreenFocusEffect(handleScreenFocus, [isScreenFocused])

  if (error) {
    initialComponent = <GraphQLError onConfirmPress={handleRefresh} loading={refreshing} />
  } else if (loading) {
    initialComponent = LoaderComponent || <Loading lipstick screen />
  } else if (!loading && !data) initialComponent = <></>

  if (skip) {
    initialComponent = null
  }

  return {
    ...queryResult,
    data: formatResponse ? formatResponse(data) : data,
    refreshControl,
    refreshing,
    handleRefresh,
    initialComponent,
    complete: !!data && !loading && !error
  }
}

export default useScreenQuery
