import React, { useState, useEffect, useRef } from 'react'
import NetInfo from '@react-native-community/netinfo'

const InternetReachable = ({ navigation }) => {
  const [isOffline, setIsOffline] = useState(false)
  const timer = useRef()

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const { type, isInternetReachable, isConnected } = state
      if (type !== 'unknown' && typeof isInternetReachable === 'boolean') {
        const offline = !(isConnected && isInternetReachable)
        setIsOffline(offline)
      }
    })
    return () => unsubscribeNetInfo()
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (isOffline) {
      timer.current = setTimeout(() => navigation.navigate('NoInternetConnection'), 5000)
    }
    return () => {
      clearTimeout(timer.current)
    }
  }, [isOffline])

  return <></>
}

export default InternetReachable
