import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/core'

/* React native navigation useFocusEffect wrapped with useCallback */
export const useScreenFocusEffect = (callback: () => void, deps: any[] = []) =>
  useFocusEffect(useCallback(callback, deps))

export const useHasFocusedScreen = (): boolean => {
  const [isScreenFocused, setScreenFocused] = useState<boolean>(false)

  const handleScreenFocus = useCallback(() => {
    if (!isScreenFocused) {
      setScreenFocused(true)
    }
  }, [isScreenFocused])

  useScreenFocusEffect(handleScreenFocus, [isScreenFocused])

  return isScreenFocused
}
