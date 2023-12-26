import SplashScreen from 'react-native-splash-screen'
import * as React from 'react'
import { useEffect, useState } from 'react'

const useSplashScreen = isAppReady => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hide()
      setLoadingComplete(true)
    }
  }, [isAppReady])

  return isLoadingComplete
}

export default useSplashScreen
