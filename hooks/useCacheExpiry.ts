import { useAppContext } from '../AppProvider'
import { getRemoteConfigNumber } from '../services/useRemoteConfig'
import { differenceWithNow, now } from '../utils/date'
import useAppVisibilityState from './useAppVisibilityState'

export const hasFetchAtTimeExpired = (fetchAtTimeString, expiryTTL?: number | undefined) => {
  const ttl = expiryTTL || Math.max(10, getRemoteConfigNumber('graphql_cache_ttl'))
  const diff: number = differenceWithNow(fetchAtTimeString, 'minute')
  return !fetchAtTimeString || diff > ttl
}

type CacheExpiryOptions = {
  onExpired?: () => void
}
type CacheExpiryResult = {
  setCacheTime: () => void
  hasCacheExpired: () => boolean
}

const useCacheExpiry = (name: string, options: CacheExpiryOptions = {}): CacheExpiryResult => {
  const {
    cacheKeys: [cache, setCache]
  } = useAppContext()
  const hasCacheExpired = () => hasFetchAtTimeExpired(cache[name])

  const setCacheTime = () => setCache(prev => ({ ...prev, [name]: now() }))

  useAppVisibilityState({
    onActive: () => {
      if (hasCacheExpired()) {
        if (options?.onExpired) {
          options?.onExpired()
        }
      }
    }
  })

  return { setCacheTime, hasCacheExpired }
}

export default useCacheExpiry
