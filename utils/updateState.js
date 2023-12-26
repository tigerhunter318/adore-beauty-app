import { shallowEqual } from 'fast-equals'
/**
 * const [state, setState] = React.useState(initialState)
 * updateState(state, setState)(newValue)
 * @param setState
 * @returns {Function}
 */
export const updateState = (state, setState) => newValue => {
  const keys = Object.keys(newValue)
  let hasChanged = false
  keys.forEach(key => {
    if (!shallowEqual(state[key], newValue[key])) {
      hasChanged = true
    }
  })
  if (hasChanged) {
    return setState({ ...state, ...newValue })
  }
  return state
}
