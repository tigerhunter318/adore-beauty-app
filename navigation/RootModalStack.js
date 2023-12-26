import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { noHeaderScreenOptions, screenOptions } from './utils'
import { LoginStack } from './LoginStack'
import ProductQuickViewScreen from '../screens/product/ProductQuickViewScreen'
import ArticleShopProductsScreen from '../screens/post/ArticleShopProductsScreen'
import SidebarContainer from '../components/sidebar/SidebarContainer'
import { MainStack } from './MainStack'
import { CMSStack } from './CMSStack'
import { SidebarContext } from '../components/sidebar/SidebarContext'
import PromoQuickViewScreen from '../screens/shop/PromoQuickViewScreen'
import HasuraPromoQuickViewScreen from '../screens/shop/HasuraPromoQuickViewScreen'
import AdoreSociety from '../screens/society/AdoreSociety'
import SocietyScreenTitle from '../components/society/SocietyScreenTitle'
import { isIos } from '../utils/device'
import theme from '../constants/theme'
import DeeplinkLoader from './DeeplinkLoader'
import NoInternetConnection from '../screens/noconnection/NoInternetConnection'

const drawerConfig = {
  drawerStyle: { width: '85%' },
  drawerContent: props => <SidebarContainer navigation={props.navigation} />,
  drawerPosition: 'right',
  overlayColor: theme.black70
}

const DrawerStack = createDrawerNavigator()
const RootStack = createStackNavigator()

const MainDrawerStack = () => {
  const { swipeEnabled, drawerStyle: contextDrawerStyle } = useContext(SidebarContext)
  const { drawerStyle } = drawerConfig

  return (
    <DrawerStack.Navigator
      {...drawerConfig}
      drawerStyle={contextDrawerStyle ?? drawerStyle}
      screenOptions={() => ({ swipeEnabled })}
    >
      <DrawerStack.Screen name="Main" component={MainStack} />
    </DrawerStack.Navigator>
  )
}

const rootScreenConfig = { header: () => null }
const modalScreenConfig = { header: () => null, cardStyle: { backgroundColor: theme.black50 } }

const RootModalStack = () => (
  <RootStack.Navigator
    screenOptions={{
      cardStyle: { backgroundColor: 'transparent' },
      animationEnabled: isIos()
    }}
    mode="modal"
  >
    <RootStack.Screen name="MainDrawer" component={MainDrawerStack} options={noHeaderScreenOptions} />
    <RootStack.Screen name="Login" component={LoginStack} options={rootScreenConfig} />
    <RootStack.Screen name="ProductQuickView" component={ProductQuickViewScreen} options={modalScreenConfig} />
    <RootStack.Screen name="HasuraPromoQuickView" component={HasuraPromoQuickViewScreen} options={modalScreenConfig} />
    <RootStack.Screen name="PromoQuickView" component={PromoQuickViewScreen} options={modalScreenConfig} />
    <RootStack.Screen name="ArticleShopProducts" component={ArticleShopProductsScreen} options={modalScreenConfig} />
    <RootStack.Screen name="DeeplinkLoader" component={DeeplinkLoader} options={rootScreenConfig} />
    <RootStack.Screen
      name="AdoreSocietyModalScreen"
      component={AdoreSociety}
      options={screenOptions({ title: <SocietyScreenTitle />, hasBack: true })}
    />
    <RootStack.Screen name="CMS" component={CMSStack} options={noHeaderScreenOptions} />
    <RootStack.Screen
      name="NoInternetConnection"
      component={NoInternetConnection}
      options={screenOptions({ title: 'No Internet Connection' })}
    />
  </RootStack.Navigator>
)

export default RootModalStack
