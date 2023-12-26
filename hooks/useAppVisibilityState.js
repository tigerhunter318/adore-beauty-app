import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import PropTypes from 'prop-types'

const useAppVisibilityState = props => {
  const { onChange, onForeground, onBackground, onActive } = props || {}
  const [appState, setAppState] = useState(AppState.currentState)
  const [isForeground, setIsForeground] = useState(false)

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      let active = false
      if (nextAppState === 'active' && onActive) {
        onActive()
      }
      if (nextAppState === 'active' && appState !== 'active') {
        active = true
        if (onForeground) {
          onForeground()
        }
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        if (onBackground) {
          onBackground()
        }
      }
      setIsForeground(active)
      setAppState(nextAppState)
      if (onChange) {
        onChange(nextAppState)
      }
    }
    const eventHandler = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      eventHandler.remove()
    }
  }, [onChange, onForeground, onBackground, appState])

  return { appState, isForeground }
}

useAppVisibilityState.propTypes = {
  onChange: PropTypes.func,
  onForeground: PropTypes.func,
  onBackground: PropTypes.func,
  onActive: PropTypes.func
}
useAppVisibilityState.defaultProps = {
  onChange: undefined,
  onForeground: undefined,
  onBackground: undefined,
  onActive: undefined
}

export default useAppVisibilityState
