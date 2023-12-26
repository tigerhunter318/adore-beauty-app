import { useState, useEffect } from 'react'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'
import { Settings } from 'react-native-fbsdk-next'
import { isIos, osVersion } from '../utils/device'
import { gaEvents } from './ga'

/*
export type TrackingStatus =
  | 'unavailable'
  | 'denied'
  | 'authorized'
  | 'restricted'
  | 'not-determined';
 */
/**
 * https://github.com/mrousavy/react-native-tracking-transparency#readme
 * @returns {unknown}
 */
const STATUS_NOT_DETERMINED = 'not-determined'
export const useTrackingTransparency = (enabled = false) => {
  const [trackingStatus, setTrackingStatus] = useState(STATUS_NOT_DETERMINED)

  const loadTrackingTransparency = async () => {
    try {
      let status = await getTrackingStatus()
      if (status === STATUS_NOT_DETERMINED) {
        status = await requestTrackingPermission()
        if (status === STATUS_NOT_DETERMINED) {
          setTimeout(loadTrackingTransparency, 1500)
          return
        }
        gaEvents.trackTrackingTransparency(status)
      }

      if (status === 'authorized' || status === 'denied') {
        await Settings.setAdvertiserTrackingEnabled(status === 'authorized')
        Settings.initializeSDK()
      }

      setTrackingStatus(status)
    } catch (error) {
      console.warn('24', 'TrackingTransparency', 'getStatus', error)
    }
  }

  useEffect(() => {
    if (enabled && isIos() && osVersion() >= 14.5) {
      loadTrackingTransparency()
    }
  }, [enabled])

  return trackingStatus
}
