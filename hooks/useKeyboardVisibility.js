import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

const useKeyboardVisibility = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  const handleKeyboardVisibility = () => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }

  useEffect(handleKeyboardVisibility, [])

  return { isKeyboardVisible }
}

export default useKeyboardVisibility
