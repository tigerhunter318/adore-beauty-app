import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import * as React from 'react'
import { deepClone, formatObjectStringNumbersToNumbers } from '../../utils/object'
import { isValidObject } from '../../utils/validation'
import searchObject from '../../utils/searchObject'
import logInfo from '../../utils/logInfo'
import { formatScreenPath } from '../../utils/format'

function addParamsToAction(obj, targetScreen, params) {
  if (isValidObject(obj)) {
    Object.keys(obj).forEach(key => {
      if (obj.screen === targetScreen || obj.name === targetScreen) {
        obj.params = { ...params, ...obj.params }
      }
      if (typeof obj[key] === 'object') {
        addParamsToAction(obj[key], targetScreen, params)
      }
    })
  }
}

/**
 * refactored https://github.com/react-navigation/react-navigation/blob/5.x/packages/native/src/useLinkTo.tsx
 * // node_modules/@react-navigation/native/src/useLinkTo.tsx
 *
 * @param navigation
 * @param linking
 * @returns {function(string): void}
 */
const linkTo = ({ navigation, params, screenPath, type = 'NAVIGATE' }) => {
  const path = formatScreenPath(screenPath)

  if (navigation === undefined) {
    throw new Error("Couldn't find a navigation object. Is your component inside a screen in a navigator?")
  }
  const linking = {}
  const { options } = linking

  const state = options?.getStateFromPath
    ? options.getStateFromPath(path, options.config)
    : getStateFromPath(path, options?.config)

  if (state) {
    let root = navigation
    let current

    /*eslint-disable*/
    // Traverse up to get the root navigation
    while ((current = root.dangerouslyGetParent()))
    {
      root = current
    }
    /* eslint-enable */
    const targetScreenName = path.replace(/(.*\/)*/, '').replace(/\?.*$/, '')
    const targetScreenState = searchObject(root.dangerouslyGetState(), item => {
      if (item.name === targetScreenName) {
        return item
      }
    })

    let resetParams = {}
    let action = getActionFromState(state, options?.config)
    if (isValidObject(targetScreenState?.params)) {
      resetParams = Object.fromEntries(Object.keys(targetScreenState.params).map(key => [key, ''])) // reset any existing route params
    }

    if (action !== undefined) {
      addParamsToAction(action, targetScreenName, { ...resetParams, ...params })
      action = deepClone(action) // TODO remove deepClone
      formatObjectStringNumbersToNumbers(action)
      action.type = type
      logInfo('yellow', `linkTo`, state, action)
      root.dispatch(action)
      return action
    }
    const resetState = getStateFromPath(path)
    root.reset(resetState)
    return resetState
  }
  throw new Error('Failed to parse the path to a navigation state.')
}
export default linkTo
