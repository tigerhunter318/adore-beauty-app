import React, { useState, useEffect } from 'react'
import { RefreshControl } from 'react-native'
import remoteLog from '../services/remoteLog'

const useRefreshControl = asyncFunction => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await asyncFunction()
    } catch (error) {
      remoteLog.logError(`useRefreshControl:handleRefresh`, error)
    }
    setRefreshing(false)
  }

  const component = <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />

  return { handleRefresh, refreshing, refreshControl: component }
}

export default useRefreshControl
