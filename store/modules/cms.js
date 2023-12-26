import { actionPayload, asyncActionPayload, createActionsReducer } from '../utils/createActionsReducer'
import { apiFetch } from '../api'
import { formatPageIdentifier } from '../../utils/format'

const namespace = 'cms'

const initialState = {
  fetch: { pending: true },
  articles: []
}

const fetch = asyncActionPayload(url => apiFetch(`cms?identifier=${formatPageIdentifier(url, true)}`))

const update = actionPayload(obj => obj)

const actions = {
  fetch,
  update
}

const module = createActionsReducer(namespace, actions, initialState)

const reduceCmsArticles = (state, newState, action) => {
  const data = action?.payload?.data?.articles?.[0]
  const identifier = action?.meta?.url || action?.payload?.identifier
  const nextArticles = { ...state?.articles }
  nextArticles[identifier] = data
  return { ...newState, articles: nextArticles }
}

const reducer = (state, action) => {
  let newState = module.reducer(state, action)

  if (action.type === `${namespace}/fetch_FULFILLED` || action.type === `${namespace}/update`) {
    newState = reduceCmsArticles(state, newState, action)
  }
  return newState
}

export default { namespace, actions: module.actions, reducer }
