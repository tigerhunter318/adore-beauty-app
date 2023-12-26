import { actionPayload, createActionsReducer } from '../utils/createActionsReducer'

const isQueryResult = (action, operationName) =>
  action.type === 'APOLLO_QUERY_RESULT' && action.operationName === operationName

const namespace = 'home'
const initialState = {}

const all = actionPayload(obj => obj)

const actions = {
  all
}
const module = createActionsReducer(namespace, actions, initialState)

const reduceHomeQuery = (state, newState, { result }) => ({
  ...newState,
  all: result.data
})
const reducer = (state, action) => {
  let newState = module.reducer(state, action)
  if (isQueryResult(action, 'HomeQuery')) {
    newState = reduceHomeQuery(state, newState, action)
  }

  return newState
}

export default { namespace, actions: module.actions, reducer }
