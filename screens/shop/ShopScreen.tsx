import React, { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { ViewportProvider } from '../../components/viewport/ViewportContext'
import nav from '../../store/modules/nav'
import ShopRecommendedProducts from '../../components/shop/ShopRecommendedProducts'
import ShopWishList from '../../components/shop/ShopWishList'
import ShopBestSellers from '../../components/shop/ShopBestSellers'
import ShopPromo from '../../components/shop/ShopPromo'
import settings from '../../constants/settings'
import ShopRecentlyOrderedProducts from '../../components/shop/ShopRecentlyOrderedProducts'
import ShopNewProducts from '../../components/shop/ShopNewProducts'
import ViewportAware from '../../components/viewport/ViewportAware'
import useRefreshControl from '../../hooks/useRefreshControl'
import { delay } from '../../utils/delay'
import { useHasFocusedScreen } from '../../hooks/useScreen'

const ShopScreen = () => {
  const dispatch = useDispatch()
  const hasFocusedScreen = useHasFocusedScreen()

  const refetch = async () => delay(1000)
  const { refreshing, refreshControl } = useRefreshControl(refetch)

  useEffect(() => {
    dispatch(nav.actions.fetch())
  }, [dispatch])

  return (
    <ViewportProvider lazyLoadImage>
      <ScrollView
        style={{ paddingVertical: 20 }}
        testID="ShopScreen.ScrollView"
        scrollEventThrottle={settings.defaultScrollEventThrottle}
        refreshControl={refreshControl}
      >
        <ShopPromo testID="ShopScreen.ShopPromo" skip={!hasFocusedScreen} isScreenRefreshing={refreshing} />
        <ViewportAware preTriggerRatio={0.1}>
          {({ hasEnteredViewport }) => (
            <ShopRecommendedProducts skip={!(hasEnteredViewport && hasFocusedScreen)} refreshing={refreshing} />
          )}
        </ViewportAware>
        <ViewportAware preTriggerRatio={0.25}>
          {({ hasEnteredViewport }) => (
            <ShopRecentlyOrderedProducts
              skip={!(hasEnteredViewport && hasFocusedScreen)}
              isScreenRefreshing={refreshing}
            />
          )}
        </ViewportAware>
        <ViewportAware preTriggerRatio={0.25}>
          {({ hasEnteredViewport }) => (
            <ShopBestSellers skip={!(hasEnteredViewport && hasFocusedScreen)} isScreenRefreshing={refreshing} />
          )}
        </ViewportAware>
        <ShopWishList />
        <ViewportAware preTriggerRatio={0.25}>
          {({ hasEnteredViewport }) => (
            <ShopNewProducts
              skip={!(hasEnteredViewport && hasFocusedScreen)}
              containerStyle={{ paddingBottom: 20 }}
              testID="ShopScreen.ShopNewProducts"
              isScreenRefreshing={refreshing}
            />
          )}
        </ViewportAware>
      </ScrollView>
    </ViewportProvider>
  )
}

export default ShopScreen
