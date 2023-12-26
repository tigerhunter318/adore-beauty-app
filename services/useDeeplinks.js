import { useEffect } from 'react'
import branch from 'react-native-branch'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { isWebsiteUrl } from '../utils/validation'
import { navigateUrlToScreen } from '../navigation/utils/useUrlNavigation'
import envConfig from '../config/envConfig'
import { emarsysService } from './emarsys/emarsys'
import remoteLog from './remoteLog'
import { gaEvents } from './ga'
import { parseQueryString } from '../utils/format'
import { partnerizeService } from './partnerize'
import logInfo from '../utils/logInfo'

const useDeeplinks = navigationRef => {
  const isNavigationMounted = !!navigationRef?.current

  const initGA4 = () => {
    if (envConfig?.branch?.gaTrackingId) {
      branch.setRequestMetadata('$google_analytics_client_id', `${envConfig.branch.gaTrackingId}`)
    }
  }

  const handleOpenURL = async event => {
    if (event?.url) {
      const { url: deeplinkUrl } = event
      if (isWebsiteUrl(deeplinkUrl) && !!navigationRef?.current?.navigate) {
        let url = deeplinkUrl
        if (partnerizeService.isPartnerizeUrl(deeplinkUrl)) {
          url = partnerizeService.extractFromPartnerizeUrl(deeplinkUrl)
          partnerizeService.startConversion(deeplinkUrl)
        }

        await InAppBrowser.close()
        await InAppBrowser.closeAuth()
        remoteLog.setTag('app.deeplink', deeplinkUrl)
        navigateUrlToScreen(navigationRef.current, url, 'navigate', { showLoader: true, isDeepLink: true })
      }
    }
  }
  const handleBranchDeeplink = event => {
    const url = event?.params?.$desktop_url || event?.uri || event?.params?.['+non_branch_link']
    if (url) {
      remoteLog.setTag('app.branch_link', url)
      logInfo('blue', 'handleBranchDeeplink', event)
      return handleOpenURL({ url })
    }
  }
  const subscribeFirebaseDynamicLinks = () => {
    const handleDynamicLink = event => {
      if (event?.url) {
        remoteLog.setTag('app.firebase_link', event?.url)
        handleOpenURL(event)
      }
    }
    dynamicLinks()
      .getInitialLink()
      .then(handleDynamicLink)
      .catch(error => {
        console.warn('AppNavigator', 'getInitialLink', 'error', error)
      })

    return dynamicLinks().onLink(handleDynamicLink)
  }
  /**
   * handleInitialLink disabled. no longer required with Branch
   * validate using release build and cold launch app
   * @param event
   */
  // const handleInitialLink = async () => {
  //   const url = await Linking.getInitialURL()
  //   Alert.alert('handleInitialLink', url)
  //   if (url) {
  //     handleOpenURL({ url })
  //   }
  // }
  const handleLinkingUrl = event => {
    handleOpenURL(event)
  }

  const handleEmarsysEvent = (eventName, payload) => {
    const url = payload?.url
    if (eventName === 'DeepLink' && url) {
      remoteLog.setTag('app.emarsys_link', url)
      handleOpenURL(payload)
      const queryParams = parseQueryString(url)
      gaEvents.trackDeepLink(queryParams)
    }
  }

  const handleMount = () => {
    if (isNavigationMounted) {
      // Linking.addEventListener('url', handleLinkingUrl) // no longer functions, handled by Branch now
      const unsubscribeBranch = branch.subscribe(handleBranchDeeplink)
      const unsubscribeDynamicLinks = subscribeFirebaseDynamicLinks()
      emarsysService.setEventHandler(handleEmarsysEvent)
      initGA4()
      return () => {
        // Linking.removeEventListener('url', handleOpenURL)
        unsubscribeDynamicLinks()
        unsubscribeBranch()
      }
    }
  }
  useEffect(handleMount, [isNavigationMounted])
}

export default useDeeplinks
