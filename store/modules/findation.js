import axios from 'axios'
import { createRequestActions } from './utils/requestAction'
import { setAsyncStorageItem } from '../../utils/asyncStorage'
import { actionPayload, asyncActionPayload, createActionsReducer } from '../utils/createActionsReducer'
import envConfig from '../../config/envConfig'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'

const namespace = 'findation'
const key = 'findation'

const initialState = {
  embedId: null,
  brands: null,
  products: null,
  shades: null,
  shadeIds: []
}

const findationApiInstance = axios.create({ baseURL: 'https://findation.com/api' })

const findationRequest = asyncActionPayload((endpoint, payload = {}, config = {}) => {
  const requestObj = {
    ...config,
    url: endpoint
  }
  if (config.method && config.method.toLowerCase() !== 'get') {
    requestObj.data = payload
  }
  return findationApiInstance.request(requestObj)
})

const resetEmbedStore = actionPayload(obj => obj)
const embedId = actionPayload(obj => obj)
const brands = actionPayload(obj => obj)
const products = actionPayload(obj => obj)
const shades = actionPayload(obj => obj)
const shadeIds = actionPayload(obj => obj)

const handleApiError = error => async dispatch => {
  dispatch(resetEmbedId())
}

const fetchEmbedId = productUrl => async dispatch => {
  const endpoint = '/embed'
  const response = await dispatch(
    requestPost(
      endpoint,
      { type: 'embed', product_url: productUrl, api_key: envConfig.findation.apiKey },
      { onError: error => dispatch(handleApiError(error)) }
    )
  )
  await dispatch(module.actions.embedId(response?.value?.data?.embed_id || null))
  return response?.value
}

const fetchBrands = () => async dispatch => {
  const endpoint = `/brands?api_key=${envConfig.findation.apiKey}`
  const response = await dispatch(requestGet(endpoint, { type: 'brands' }))
  await dispatch(module.actions.brands(response?.value?.data || null))
  return response?.value
}

const fetchProducts = brandId => async dispatch => {
  const endpoint = `/products?brand_id=${brandId}&api_key=${envConfig.findation.apiKey}`
  const response = await dispatch(requestGet(endpoint, { type: 'products' }))
  await dispatch(module.actions.products(response?.value?.data || null))
  return response?.value
}

const fetchShades = productId => async dispatch => {
  const endpoint = `/shades?product_id=${productId}&api_key=${envConfig.findation.apiKey}`
  const response = await dispatch(requestGet(endpoint, { type: 'shades' }))
  await dispatch(module.actions.shades(response?.value?.data || null))
  return response?.value
}

const searchMatchTarget = payload => async (dispatch, getState) => {
  const endpoint = '/search'

  const shadeId = payload.shade_id
  let selectedShadeIds = getState()?.findation?.shadeIds

  if (!!shadeId && !selectedShadeIds.includes(shadeId)) {
    selectedShadeIds = [...selectedShadeIds, shadeId]
  }

  const response = await dispatch(
    requestPost(
      endpoint,
      {
        type: 'search',
        api_key: envConfig.findation.apiKey,
        shade_ids: selectedShadeIds,
        embed_id: payload.embed_id,
        product_url: payload.product_url
      },
      { onError: error => dispatch(handleApiError(error)) }
    )
  )
  await dispatch(module.actions.shadeIds(selectedShadeIds))

  const responseData = response?.value?.data
  const recommendedShade = responseData?.recommended_shade
  if (recommendedShade) {
    await setAsyncStorageItem(key, {
      ...responseData,
      shadeIds: selectedShadeIds,
      product_url: payload.product_url
    })
    emarsysEvents.trackFindationRecommendation(recommendedShade)
  }
  return responseData
}

const reset = () => async dispatch => {
  await dispatch(module.actions.products(null))
  await dispatch(module.actions.shades(null))
}

const resetEmbedId = () => async dispatch => {
  dispatch(module.actions.resetEmbedStore())
}

const actionCreators = {
  request: findationRequest,
  resetEmbedStore,
  embedId,
  brands,
  products,
  shades,
  shadeIds
}

const actions = {
  fetchEmbedId,
  fetchBrands,
  fetchProducts,
  fetchShades,
  reset,
  resetEmbedId,
  searchMatchTarget
}

const reducer = (state, action) => {
  let newState = module.reducer(state, action)

  if (action.type === `${namespace}/resetEmbedStore`) {
    newState = {
      ...initialState
    }
  }

  if (action.type === `${namespace}/shadeIds`) {
    newState = {
      ...newState,
      shadeIds: action.payload
    }
  }

  return newState
}

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)

const { requestGet, requestPost } = createRequestActions(module)

export default { namespace, actions: module.actions, reducer }
