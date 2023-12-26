import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import theme from '../constants/theme'
import TabBarIcon from '../components/ui/TabBarIcon'
import { AccountStack } from './AccountStack'
import { ShopStack } from './ShopStack'
import { HomeStack } from './HomeStack'
import { BeautyIQStack } from './BeautyIQStack'
import { useCartQuantity } from '../store/modules/cart'
import { useIsGuestUser, useIsLoggedIn } from '../store/utils/stateHook'
import Type from '../components/ui/Type'
import { useScreenRouter } from './router/screenRouter'

const Tab = createBottomTabNavigator()

const tabIconConfig = {
  Home: {
    label: 'NEW',
    icon: 'list'
  },
  Shop: {
    label: 'SHOP',
    icon: 'makeup'
  },
  CartTab: {
    label: 'BAG',
    iconComponent: props => <CartTabBarIcon focused={props.focused} name="bag-clear" label="cart" />
  },
  Account: {
    label: 'ME',
    icon: 'account'
  },
  BeautyIQ: {
    label: 'BEAUTY IQ',
    iconComponent: props => <TabBarIcon focused={props.focused} name="iq" style={{ marginLeft: -1 }} size={33} />
  }
}

const CartTabPlaceHolder = () => null

const CartTabBarIcon = ({ focused, label }) => {
  const badgeText = useCartQuantity()
  return (
    <TabBarIcon
      focused={focused}
      name="bag-clear"
      testID="TabCartIcon"
      badgeText={badgeText}
      label={label}
      style={{ marginLeft: -1 }}
    />
  )
}

const tabBarOptions = ({ route }) => ({
  tabBarLabel: ({ focused }) => {
    const name = tabIconConfig[route.name].label
    return (
      <Type style={{ fontSize: 9, color: focused ? theme.black : theme.textGrey, position: 'absolute', bottom: 3 }}>
        {name}
      </Type>
    )
  },
  tabBarTestID: `TabBar.${route.name}`,
  tabBarIcon: props => {
    const { iconComponent } = tabIconConfig[route.name]
    if (iconComponent) {
      return iconComponent(props)
    }
    const iconName = tabIconConfig[route.name].icon
    const { label } = tabIconConfig[route.name]
    return <TabBarIcon name={iconName} focused={props.focused} label={label} />
  }
})

const tabBarStyle = {
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.5,
  shadowRadius: 15
}

const MainTabNavigation = ({ navigation, route }) => {
  const isLoggedIn = useIsLoggedIn()
  const isGuestUser = useIsGuestUser()
  const router = useScreenRouter()
  const { getCurrentScreenPath } = useScreenRouter()

  const cartTabListeners = screen => ({
    tabPress: evt => {
      evt.preventDefault()

      if (!(isGuestUser || isLoggedIn)) {
        navigation.navigate('Login', { next: { screen } })
      } else {
        navigation.navigate(screen)
      }
    }
  })

  const accountTabListeners = screen => ({
    tabPress: evt => {
      evt.preventDefault()
      if (!isLoggedIn) {
        navigation.navigate('Login', { next: { screen } })
      } else {
        router.navigate('MainTab/Account/Account')
      }
    }
  })

  const beautyiqTabListeners = () => ({
    tabPress: evt => {
      evt.preventDefault()
      router.navigate('MainTab/BeautyIQ/BeautyIQ/Articles')
    }
  })

  const shopTabListeners = () => ({
    tabPress: evt => {
      const currentPath = getCurrentScreenPath()
      if (currentPath.includes('/MainDrawer/Main/MainTab/Shop')) {
        evt.preventDefault()
        router.navigate('MainTab/Shop/Shop')
      }
    }
  })

  return (
    <Tab.Navigator
      screenOptions={tabBarOptions}
      lazy={false}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        style: tabBarStyle
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Shop" component={ShopStack} listeners={shopTabListeners()} />
      <Tab.Screen name="CartTab" component={CartTabPlaceHolder} listeners={cartTabListeners('Cart')} />
      <Tab.Screen name="Account" component={AccountStack} listeners={accountTabListeners('Account')} />
      <Tab.Screen name="BeautyIQ" component={BeautyIQStack} listeners={beautyiqTabListeners()} />
    </Tab.Navigator>
  )
}

export default MainTabNavigation
