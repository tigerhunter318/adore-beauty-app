import { asyncRequest, createRequestActions } from './utils/requestAction'
import { actionPayload, createActionsReducer } from '../utils/createActionsReducer'
import { getCustomerId, useFindProductsByCatalogIds } from './cart'
import { useActionState } from '../utils/stateHook'
import { isValidArray, isValidObject } from '../../utils/validation'

const namespace = 'wishlists'

const initialState = {
  wishlists: null
}

const getWishListItemProducts = (list, products) =>
  list?.items
    ?.map(item => ({ ...(item || {}), ...(products?.find(obj => obj?.catalogProduct?.id === item?.product_id) || {}) }))
    .filter(item => isValidObject(item?.productData)) || []

export const useWishlistItems = () => {
  const lists = useActionState('wishlists.wishlists') || []

  return lists?.length && lists.reduce((acc, item) => [...acc, ...item.items], [])
}

export const useWishlistsProducts = wishlistId => {
  const lists = useActionState('wishlists.wishlists') || []
  const wishlistsData = lists?.filter(listItem => (wishlistId ? listItem.id === wishlistId : listItem))
  const catalogIds = wishlistsData?.flatMap(({ items }) =>
    items?.map(({ product_id }) => product_id).filter(id => !!id)
  )
  const { products, loading } = useFindProductsByCatalogIds(catalogIds)

  let wishlistsProducts = []

  if (isValidArray(products)) {
    wishlistsProducts = wishlistsData.flatMap(list => getWishListItemProducts(list, products))
  }

  return { wishlistsProducts, loading }
}

export const useFindWishlistByProductId = (productId, variantId = null) => {
  const lists = useActionState('wishlists.wishlists')
  let itemId = null
  if (productId && lists?.length) {
    const foundWishlist = lists.find(wishlist => {
      const found = variantId
        ? wishlist.items.find(item => item.product_id === productId && item.variant_id === variantId)
        : wishlist.items.find(item => item.product_id === productId)
      if (found?.id) {
        itemId = found.id
      }
      return found
    })
    if (foundWishlist?.id) {
      return {
        wishlistId: foundWishlist?.id,
        itemId
      }
    }
    return null
  }
}

const wishlists = actionPayload(payload => payload)

const fetchWishlists = () => async (dispatch, getState) => {
  const endpoint = `/ecommerce/wishlists`
  const response = await dispatch(requestGet(endpoint))
  await dispatch(module.actions.wishlists(response?.value?.data?.data))
  return response
}
const updateWishlist = ({ wishlistId, data }) => async (dispatch, getState) => {
  const customer_id = getCustomerId(getState)
  const payload = {
    ...data,
    customer_id
  }
  const endpoint = `/ecommerce/wishlists/${wishlistId}`
  const response = await dispatch(requestPut(endpoint, payload))
  await dispatch(fetchWishlists())
  return response
}
const createWishlist = data => async (dispatch, getState) => {
  const customer_id = getCustomerId(getState)
  const payload = {
    ...data,
    customer_id
  }
  const endpoint = `/ecommerce/wishlists`
  const response = await dispatch(requestPost(endpoint, payload))
  await dispatch(fetchWishlists())
  return response
}
const removeWishlist = ({ wishlistId }) => async (dispatch, getState) => {
  const endpoint = `ecommerce/wishlists/${wishlistId}`
  const response = await dispatch(requestDelete(endpoint))
  await dispatch(fetchWishlists())
  return response
}
const removeFromWishlist = ({ wishlistId, itemId }) => async (dispatch, getState) => {
  const endpoint = `ecommerce/wishlists/${wishlistId}/items/${itemId}`
  const response = await dispatch(requestDelete(endpoint))
  await dispatch(fetchWishlists())
  return response
}

const addToWishlist = data => async (dispatch, getState) => {
  const wishlistId = data?.id
  if (!wishlistId) {
    return dispatch(createWishlist(data))
  }
  const customer_id = getCustomerId(getState)
  const endpoint = `/ecommerce/wishlists/${wishlistId}/items?customer_id=${customer_id}`
  const response = await dispatch(requestPost(endpoint, data))
  await dispatch(fetchWishlists())
  return response
}

const actionCreators = {
  wishlists,
  request: asyncRequest
}
const actions = {
  addToWishlist,
  createWishlist,
  fetchWishlists,
  removeFromWishlist,
  removeWishlist,
  updateWishlist
}
const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)
const { requestPut, requestGet, requestPost, requestDelete } = createRequestActions(module)

const reducer = (state, action) => {
  const newState = module.reducer(state, action)

  if (action.type === 'AUTH_RESET') {
    return { ...initialState }
  }

  return newState
}

export default { namespace, actions: module.actions, reducer }
