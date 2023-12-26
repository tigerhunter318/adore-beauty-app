import { useState } from 'react'
import { apolloClient } from './apollo'
import useAppVisibilityState from '../../hooks/useAppVisibilityState'
import { now } from '../../utils/date'
import { hasFetchAtTimeExpired } from '../../hooks/useCacheExpiry'

const useApolloCache = () => {
  const [startedAt, setStartedAt] = useState(now())

  /**
   * reset the apollo in memory cache and refetch queries
   *
   * https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
   */
  const resetApolloCache = () => {
    apolloClient().resetStore()
    setStartedAt(now())
  }

  useAppVisibilityState({
    onActive: () => {
      // check when app returns to foreground
      if (hasFetchAtTimeExpired(startedAt)) {
        resetApolloCache()
      }
    }
  })
}

export default useApolloCache
