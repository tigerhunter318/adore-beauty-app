import React, { useEffect, useState } from 'react'
import { LogBox, StatusBar } from 'react-native'
import inAppMessaging from '@react-native-firebase/in-app-messaging'
import messaging from '@react-native-firebase/messaging'
import { Provider } from 'react-redux'
import { ForterActionType, ForterNavigationType, forterSDK } from 'react-native-forter'
import JailMonkey from 'jail-monkey'
import { RootSiblingParent } from 'react-native-root-siblings'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloProvider } from '@apollo/client'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AppNavigator from './navigation/AppNavigator'
import store from './store/store'
import envConfig from './config/envConfig'
import AuthToken from './components/auth/AuthToken'
import Container from './components/ui/Container'
import Type from './components/ui/Type'
import theme from './constants/theme'
import useLocalConfig from './config/useLocalConfig'
import { createApiInstance } from './store/api'
import { createAlgoliaClient } from './services/algolia'
import { tealiumEvents } from './services/tealium'
import zendesk from './services/zendesk'
import { useTrackingTransparency } from './services/trackingTransparency'
import { getRemoteApiHeaders, useRemoteConfig } from './services/useRemoteConfig'
import useSplashScreen from './hooks/useSplashScreen'
import useLaunchArguments from './hooks/useLaunchArguments'
import { useSmartLook } from './services/smartlook'
import { useEmarsysService } from './services/emarsys/emarsys'
import remoteLog from './services/remoteLog'
import { createApiApolloClient } from './services/apollo/createApiApolloClient'
import SearchProvider from './components/search/SearchProvider'
import AppProvider from './AppProvider'

let appApolloClient = null

/* eslint-disable no-console */

LogBox.ignoreLogs(envConfig.ignoredLogs)

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage)
})

async function initialLoading() {
  await inAppMessaging().setMessagesDisplaySuppressed(envConfig.disableInAppMessaging)
  const authStatus = await messaging().requestPermission()
}

if (!envConfig.enableYellowBox) {
  LogBox.ignoreAllLogs()
}

if (envConfig.enablePushNotifications) {
  initialLoading()
} else if (envConfig.disableInAppMessaging) {
  inAppMessaging().setMessagesDisplaySuppressed(envConfig.disableInAppMessaging)
}

if (envConfig.sentry.dsn) {
  remoteLog.initSentry()
}

if (envConfig.tealium.enabled) {
  tealiumEvents.initTealium()
}

if (envConfig.isForterEnabled) {
  // Forter integration
  forterSDK.setDevLogsEnabled()
  forterSDK.getDeviceUniqueID(deviceID => {
    console.log(`deviceID = ${deviceID} merchange= ${envConfig.forterId}`)
    forterSDK.init(
      envConfig.forterId,
      deviceID,
      successResult => {
        console.log(`OK: ${successResult}`)
      },
      errorResult => {
        console.log(`FAIL: ${errorResult}`)
      }
    )
  })

  // Examples for custom tracking
  forterSDK.trackNavigation('mainpage', ForterNavigationType.PRODUCT)
  forterSDK.trackAction(ForterActionType.ACCOUNT_LOGIN)
}

// init zendesk chat
if (envConfig.enableZendesk) {
  zendesk.init()
}

/* eslint-disable no-use-before-define */
/* eslint-disable global-require */
const App = () => {
  const [isJailBrokenDevice, setIsJailBrokenDevice] = useState(false)

  const onMount = () => {
    if (envConfig.disableJailBreak) {
      setIsJailBrokenDevice(JailMonkey.isJailBroken())
    } else {
      setIsJailBrokenDevice(false)
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // resolve push notification conflict between firebase & emarsys
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    inAppMessaging().setMessagesDisplaySuppressed(envConfig.disableInAppMessaging)

    return unsubscribe
  }

  useEffect(onMount, [])
  const remoteConfig = useRemoteConfig()
  const launchArguments = useLaunchArguments()
  const localConfig = useLocalConfig()
  const isConfigReady = !!remoteConfig && !!localConfig && !!launchArguments
  const isLoadingComplete = useSplashScreen(isConfigReady)
  useSmartLook(isConfigReady)
  useEmarsysService(isConfigReady && isLoadingComplete)
  useTrackingTransparency(envConfig.enableTrackingTransparency)

  if (!isConfigReady || !isLoadingComplete) {
    return null
  }

  if (!appApolloClient) {
    const apiHeaders = getRemoteApiHeaders()
    createApiInstance({ headers: apiHeaders })
    createAlgoliaClient()
    appApolloClient = createApiApolloClient(apiHeaders)
  }

  if (isJailBrokenDevice) {
    return (
      <Container ph={2} pv={2} flex={1} align center background={theme.white}>
        <Type>Im afraid the Adore Beauty App does not run on Jailbroken devices</Type>
      </Container>
    )
  }

  return (
    <RootSiblingParent>
      <AppProvider>
        <ApolloProvider client={appApolloClient}>
          <SearchProvider>
            <Provider store={store}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AuthToken launchArguments={launchArguments} />
                <Container flex={1} background={theme.white}>
                  <StatusBar barStyle="light-content" backgroundColor="#000000" />
                  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <AppNavigator />
                  </SafeAreaProvider>
                </Container>
              </GestureHandlerRootView>
            </Provider>
          </SearchProvider>
        </ApolloProvider>
      </AppProvider>
    </RootSiblingParent>
  )
}

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null
  }

  return <App />
}

export default HeadlessCheck
