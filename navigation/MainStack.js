import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import MainTabNavigation from './MainTabNavigation'
import { CartStack } from './CartStack'
import { ProductStack } from './ProductStack'
import { noHeaderScreenOptions } from './utils'
import { OrderConfirmStack } from './OrderConfirmStack'
import { isIos } from '../utils/device'
import { GiftStack } from './GiftStack'
import { PostStack } from './PostStack'
import { PodcastStack } from './PodcastStack'
import { getFocusedRouteStateFromNavigation } from './utils/navigationUtils'
import { searchOpenAnimation } from './animation/screenAnimations'

const Stack = createStackNavigator()

const productStackScreenOptions = ({ navigation, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route)
  const state = getFocusedRouteStateFromNavigation(navigation)
  const isOpeningSearch =
    routeName === 'ProductStack' &&
    (state?.name === 'SearchSuggestions' || state?.params?.screen === 'SearchSuggestions')
  if (isOpeningSearch) {
    return {
      ...searchOpenAnimation(),
      header: () => null
    }
  }
  return {
    header: () => null
  }
}

export const MainStack = props => (
  <Stack.Navigator screenOptions={{ animationEnabled: isIos() }}>
    <Stack.Screen name="MainTab" component={MainTabNavigation} options={noHeaderScreenOptions} />
    <Stack.Screen name="Cart" component={CartStack} options={noHeaderScreenOptions} />
    <Stack.Screen name="ProductStack" component={ProductStack} options={productStackScreenOptions(props)} />
    <Stack.Screen name="GiftCertificate" component={GiftStack} options={noHeaderScreenOptions} />
    <Stack.Screen name="PostScreen" component={PostStack} options={noHeaderScreenOptions} />
    <Stack.Screen name="BeautyIQPodcastEpisode" component={PodcastStack} options={noHeaderScreenOptions} />
    <Stack.Screen name="OrderConfirm" component={OrderConfirmStack} options={noHeaderScreenOptions} />
  </Stack.Navigator>
)
