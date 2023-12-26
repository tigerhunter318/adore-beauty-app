import { createAction, createAsyncAction, createReducer } from 'redux-promise-middleware-actions'

const actionReducerHandler = (state, action) => action.payload
const actionReducer = (actionCreator, reducerHandler = actionReducerHandler) =>
  createReducer({}, handleAction => [handleAction(actionCreator, reducerHandler)])

export const asyncActionReducer = actionCreator =>
  createReducer({}, handleAction => [
    handleAction(actionCreator.pending, (state, { meta }) => ({
      ...state,
      meta,
      pending: true
    })),
    handleAction(actionCreator.fulfilled, (state, { payload, meta }) => ({
      ...state,
      pending: false,
      meta,
      error: undefined,
      data: payload && payload.data ? payload.data : payload
    })),
    handleAction(actionCreator.rejected, (state, { payload }) => ({
      ...state,
      pending: false,
      error: payload
    }))
  ])

/*
 * create an action
 *
 * standard behaviour, reduce action payload to reduce of same name
 * const myAction = actionPayload(payload => payload)
 *
 * custom reducer function
 * const myAction = actionPayload(payload => payload, (state, action, moduleState) => ({...state, ...action.payload, custom:'test}))
 *
 * no reducer function
 * const myAction = actionPayload(payload => payload, false)
 */
export const actionPayload = (payloadCreator, payloadReducer) => ({ payloadCreator, payloadReducer })
export const asyncActionPayload = payloadCreator => ({ payloadCreator, async: true })

export const factoryAction = ({ namespace, name, payloadCreator = () => ({}), async }) => {
  const type = `${namespace}/${name}`
  const metaCreator = (url, payload, method) => {
    // console.log("46","","metaCreator", meta, m2, m3, m4)
    const metaParams = { url, payload, method }
    return metaParams
  }
  return async ? createAsyncAction(type, payloadCreator, metaCreator) : createAction(type, payloadCreator)
}

export const factoryReducer = ({ namespace, name, reducer }) => {}

/**
 * https://github.com/omichelsen/redux-promise-middleware-actions#readme
 *
 * @param namespace
 * @param actionCreators
 * @returns {{reducers: *, actions: *}}
 */
export function createActionsReducer(
  namespace = 'category',
  actionCreators = {},
  initialState = {},
  reducers = {},
  actions = {}
) {
  // const actions = {}
  Object.keys(actionCreators).forEach(name => {
    if (actionCreators[name].async) {
      actions[name] = factoryAction({ ...actionCreators[name], namespace, name })
      reducers[name] = asyncActionReducer(actions[name])
    } else if (actionCreators[name].payloadReducer !== undefined) {
      actions[name] = factoryAction({ ...actionCreators[name], namespace, name })
      if (actionCreators[name].payloadReducer) {
        reducers[name] = (state, action, moduleState) => {
          if (action.type === `${namespace}/${name}`) {
            return actionCreators[name].payloadReducer(state, action, moduleState)
          }
          return state
        }
      }
    } else {
      actions[name] = factoryAction({ ...actionCreators[name], namespace, name })
      reducers[name] = actionReducer(actions[name])
    }
  })

  const reducer = (state = initialState, action) => {
    const result = { ...state }
    Object.keys(reducers).forEach(name => {
      result[name] = reducers[name](state[name], action)
    })
    return result
  }
  return { namespace, actions, reducer }
}
