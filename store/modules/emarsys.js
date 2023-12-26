import { createActionsReducer, actionPayload } from '../utils/createActionsReducer'
import { apiFetch } from '../api'

const namespace = 'emarsys'
const initialState = { pending: false }

// actions
const pending = actionPayload(payload => payload)
const createContact = (email, listName) => async dispatch => {
  dispatch(module.actions.pending(true))
  const response = await apiFetch(`emarsysContact?email=${encodeURIComponent(email)}&listName=${listName}`)
  dispatch(module.actions.pending(false))

  return response
}

const actionCreators = {
  pending
}

const actions = {
  createContact
}

const module = createActionsReducer(namespace, actionCreators, initialState, {}, actions)

export default module
