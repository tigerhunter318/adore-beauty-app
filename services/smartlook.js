import { useEffect } from 'react'
import Smartlook from 'smartlook-react-native-wrapper'
import envConfig, { versionNumber } from '../config/envConfig'
import { isValidObject } from '../utils/validation'
import { getRemoteConfigBoolean } from './useRemoteConfig'

export const useSmartLook = isConfigReady => {
  const init = async () => {
    if (
      envConfig.smartlook.apiKey &&
      envConfig.smartlook.enabled &&
      getRemoteConfigBoolean('smartlook_recording_enabled')
    ) {
      Smartlook.setupAndStartRecording({
        smartlookAPIKey: envConfig.smartlook.apiKey,
        startNewSessionAndUser: true
      })
      await Smartlook.enableCrashlytics(true)
    }
  }
  useEffect(() => {
    if (isConfigReady) {
      init()
    }
  }, [isConfigReady])
}

const setHideScreenOn = async () => Smartlook.setRenderingMode(Smartlook.RenderingMode.NoRendering)

const setHideScreenOff = async () => Smartlook.setRenderingMode(Smartlook.RenderingMode.Native)

const setUserIdentifier = async (customerData = {}) => {
  if (!isValidObject(customerData)) return

  const { big_commerce_id, groups, has_joined_loyalty, braintree_id, isNewCustomer, id } = customerData

  const userData = {
    big_commerce_id,
    braintree_id,
    groups,
    has_joined_loyalty,
    id,
    isNewCustomer,
    app_version: versionNumber()
  }

  Smartlook.setUserIdentifier(`${id}`, userData)
}

const trackNavigationEvent = async screenName => {
  await Smartlook.trackNavigationEvent(screenName, Smartlook.ViewState.Enter)
}

export const smartlook = {
  setUserIdentifier,
  trackNavigationEvent,
  setHideScreenOn,
  setHideScreenOff
}
