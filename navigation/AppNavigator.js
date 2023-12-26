import * as React from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import theme from '../constants/theme'
import { SidebarProvider } from '../components/sidebar/SidebarContext'
import CartBottomSheet from '../components/cart/CartBottomSheet'
import RootModalStack from './RootModalStack'
import envConfig from '../config/envConfig'
import { gaEvents } from '../services/ga'
import { emarsysEvents } from '../services/emarsys/emarsysEvents'
import InternetReachable from '../components/netinfo/InternetReachable'
import UpdateAlert from '../components/versionUpdate/UpdateAlert'
import useUpdateAvailable from '../services/useUpdateAvailable'
import PodcastPlayerProvider from '../components/podcasts/PodcastPlayerContext'
import PodcastAudioPlayer from '../components/podcasts/PodcastAudioPlayer'
import useDeeplinks from '../services/useDeeplinks'
import { getActiveRouteState } from './utils/navigationUtils'
import { smartlook } from '../services/smartlook'
import { shouldTrackScreenChange } from './utils/shouldTrackScreenChange'
import { useCartItemsProductDetail, useCartLineItems } from '../store/modules/cart'
import remoteLog from '../services/remoteLog'
import { emarsysService } from '../services/emarsys/emarsys'
import CategoryProvider from '../components/category/CategoryProvider'
import useApolloCache from '../services/apollo/useApolloCache'
import { pickKeys } from '../utils/object'
import useLuxuryBrands from '../gql/hasura/brands/hooks/useLuxuryBrands'
import { useRecentProducts } from '../components/shop/hooks/useRecentProducts'

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.white
  }
}

const AppNavigator = () => {
  const routeNameRef = useRef()
  const navigationRef = useRef()
  const [mounted, setMounted] = useState(null)
  const [activeRoute, setActiveRoute] = useState(null)
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  useApolloCache()
  useLuxuryBrands()
  useRecentProducts({ readStorage: true })

  const handleMount = () => {
    const state = navigationRef.current.getRootState()
    setMounted(true)
    // Save the initial route name
    routeNameRef.current = getActiveRouteState(state).name
  }

  const handleStateChange = state => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getActiveRouteState(state).name
    const params = getActiveRouteState(state)?.params

    if (shouldTrackScreenChange(currentRouteName, previousRouteName)) {
      smartlook.trackNavigationEvent(currentRouteName)
      gaEvents.screenView(currentRouteName, currentRouteName)
      emarsysEvents.trackCart(lineItems, cartItemsProductDetail)
    }
    remoteLog.setTag('app.screen', currentRouteName)
    remoteLog.addBreadcrumb({
      message: currentRouteName,
      category: 'screen',
      data: params ? pickKeys(params, ['name', 'id', 'identifier', 'url', 'q']) : undefined
    })
    setActiveRoute(currentRouteName)
    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName
  }

  useEffect(handleMount, [])

  const navigation = mounted && navigationRef?.current

  const isNavigationMounted = !!navigation

  const { isUpdateAvailable, isUpdateRequired, updateUrl } = useUpdateAvailable(mounted)

  useDeeplinks(navigationRef)

  return (
    <>
      <NavigationContainer theme={navTheme} ref={navigationRef} onStateChange={handleStateChange} independent>
        <SidebarProvider>
          <PodcastPlayerProvider navigation={navigation} activeRoute={activeRoute}>
            <CategoryProvider>
              <RootModalStack />
              <PodcastAudioPlayer navigationRef={navigationRef} />
            </CategoryProvider>
          </PodcastPlayerProvider>
        </SidebarProvider>
      </NavigationContainer>
      {isNavigationMounted && (
        <>
          <CartBottomSheet navigation={navigation} hasRecommendations={emarsysService.isRecommendedProductsEnabled()} />
          {envConfig.networkOfflineCheck && <InternetReachable navigation={navigation} />}
        </>
      )}
      {(isUpdateAvailable || isUpdateRequired) && <UpdateAlert url={updateUrl} required={isUpdateRequired} />}
    </>
  )
}

export default AppNavigator
