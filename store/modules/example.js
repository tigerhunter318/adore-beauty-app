import { factoryAction } from '../utils/createActionsReducer'

const namespace = 'example'
// create an action
const resetAction = factoryAction({ namespace, name: 'reset', payloadCreator: () => ({}) })

const resetReducer = (state, action) => {
  if (action.type === resetAction.toString()) {
    return {
      tabIndex: 0,
      fetch: 0
    }
  }
  return state
}
/**
 * example using function
 */
const reducer = (state, action) => resetReducer(state, action)

/** standard reducer example
 */
export default (state, action) => {
  switch (action.type) {
    case resetAction.toString():
      return { value: 0 }
    default:
      return state
  }
}
