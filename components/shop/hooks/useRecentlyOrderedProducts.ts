import { useDispatch } from 'react-redux'
import { useScreenFocusEffect } from '../../../hooks/useScreen'
import { useActionState, useIsLoggedIn, useRequestPending } from '../../../store/utils/stateHook'
import useProductsListQuery from '../../../gql/hasura/products/hooks/useProductsListQuery'
import cart from '../../../store/modules/cart'
import { hasFetchAtTimeExpired } from '../../../hooks/useCacheExpiry'

type useRecentlyOrderedProductsProps = {
  isScreenRefreshing: boolean
  skip?: boolean
}
const useRecentlyOrderedProducts = ({ isScreenRefreshing = false, skip = false }: useRecentlyOrderedProductsProps) => {
  const dispatch = useDispatch()
  const isLoggedIn = useIsLoggedIn()
  const recentlyOrderedProducts = useActionState('cart.recentlyOrderedProducts')
  const isRequestPending = useRequestPending('fetchRecentlyOrderedProducts')
  const { products, loading, complete } = useProductsListQuery({
    skus: recentlyOrderedProducts.skus || [],
    skip: skip || !isLoggedIn
  })

  const fetchData = async () => dispatch(cart.actions.fetchRecentlyOrderedProducts())

  const handleScreenFocus = () => {
    if (isLoggedIn) {
      if ((hasFetchAtTimeExpired(recentlyOrderedProducts.fetchedAt) && !skip) || isScreenRefreshing) {
        fetchData()
      }
    }
  }

  useScreenFocusEffect(handleScreenFocus, [isLoggedIn, recentlyOrderedProducts, skip, isScreenRefreshing])

  return { products, loading: loading || isRequestPending, complete: !isLoggedIn || complete }
}

export default useRecentlyOrderedProducts
