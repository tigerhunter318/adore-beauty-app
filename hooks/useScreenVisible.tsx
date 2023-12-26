import { useNavigation } from '@react-navigation/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Timeout } from '../config/types'

/**
 * Hook to get the current focus state of the screen. Returns a `true` if screen is focused, returns false is the screen has finished leave animation.
 * ported from useIsFocused, https://github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/core/src/useIsFocused.tsx
 */
const useScreenVisible = (): boolean => {
  const navigation = useNavigation()
  const [isFocused, setIsFocused] = useState(navigation.isFocused)
  const timeoutRef = useRef<null | Timeout>(null)

  const valueToReturn = navigation.isFocused()

  if (isFocused !== valueToReturn) {
    // If the value has changed since the last render, we need to update it.
    setIsFocused(valueToReturn)
  }

  const handleBlurTimeout = useCallback(() => {
    setIsFocused(navigation.isFocused())
  }, [navigation])

  const clearBlurTimeout = () => {
    clearTimeout(timeoutRef.current as Timeout)
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      clearBlurTimeout()
      setIsFocused(true)
    })

    const unsubscribeBlur = navigation.addListener('blur', () => {
      clearBlurTimeout()
      timeoutRef.current = setTimeout(handleBlurTimeout, 500)
    })

    return () => {
      unsubscribeFocus()
      unsubscribeBlur()
      clearBlurTimeout()
    }
  }, [navigation])

  return valueToReturn
}

export default useScreenVisible
