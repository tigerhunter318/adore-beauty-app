import { createActionsReducer, asyncActionPayload } from '../utils/createActionsReducer'
import { apiFetch } from '../api'

const namespace = 'nav'
const initialState = {}

const fetch = asyncActionPayload(() => apiFetch(`nav`))

const actions = {
  fetch
}

export default createActionsReducer(namespace, actions, initialState)
