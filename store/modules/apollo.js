import { createActionsReducer } from '../utils/createActionsReducer'

const namespace = 'apollo'
const storeResults = ['ProductPageQuery']

const initialState = {}
const actionCreators = {}
const actions = {}

const isQueryResult = action => action.type === 'APOLLO_QUERY_RESULT' && storeResults.includes(action.operationName)
/*
 * const productData =  useActionState('apollo.ProductPageQuery')
 * const shopData = useActionState('apollo.ShopQuery')
 */
const reduceQuery = (state, newState, { result, operationName }) => ({
  ...newState,
  [operationName]: result.data
})

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)
const reducer = (state, action) => {
  let newState = module.reducer(state, action)
  if (isQueryResult(action)) {
    newState = reduceQuery(state, newState, action)
  }
  return newState
}

export default { namespace, actions: module.actions, reducer }
