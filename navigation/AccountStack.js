import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Account from '../screens/account/Account'
import AccountOrders from '../screens/account/AccountOrders'
import AccountOrderDetail from '../screens/account/AccountOrderDetail'
import AccountAddresses from '../screens/account/AccountAddresses'
import AccountProfile from '../screens/account/AccountProfile'
import AccountGiftCards from '../screens/account/AccountGiftCards'
import { config, noHeaderScreenOptions, screenOptions } from './utils'
import AccountWishlist from '../screens/account/AccountWishlist'
import AccountWishlistProducts from '../screens/account/AccountWishlistProducts'
import AccountRewards from '../screens/account/AccountRewards'
import SocietyScreenTitle from '../components/society/SocietyScreenTitle'
import { useIsLoggedIn } from '../store/utils/stateHook'
import { LoginStack } from './LoginStack'

const Stack = createStackNavigator()

export const AccountStack = () => {
  const isLoggedIn = useIsLoggedIn()
  if (!isLoggedIn) {
    return (
      <Stack.Navigator {...config}>
        {!isLoggedIn && <Stack.Screen name="Login" component={LoginStack} options={noHeaderScreenOptions} />}
      </Stack.Navigator>
    )
  }
  return (
    <Stack.Navigator {...config}>
      <Stack.Screen
        name="Account"
        component={Account}
        options={screenOptions({
          hasBack: false,
          hasSearch: true,
          title: 'ME'
        })}
      />
      <Stack.Screen
        name="AccountWishlist"
        component={AccountWishlist}
        options={screenOptions({ title: 'WISHLIST', hasBack: true })}
      />
      <Stack.Screen
        name="AccountWishlistProducts"
        component={AccountWishlistProducts}
        options={screenOptions({ title: 'WISHLIST', hasBack: true })}
      />
      <Stack.Screen
        name="AccountOrders"
        component={AccountOrders}
        options={screenOptions({ title: 'MY ACCOUNT', hasBack: true })}
      />
      <Stack.Screen
        name="AccountOrderDetail"
        component={AccountOrderDetail}
        options={screenOptions({ title: 'MY ACCOUNT', hasBack: true })}
      />
      <Stack.Screen
        name="AccountGiftCards"
        component={AccountGiftCards}
        options={screenOptions({ title: 'Gift Cards', hasBack: true })}
      />
      <Stack.Screen
        name="AccountAddresses"
        component={AccountAddresses}
        options={screenOptions({ title: 'MY ACCOUNT', hasBack: true })}
      />
      <Stack.Screen
        name="AccountProfile"
        component={AccountProfile}
        options={screenOptions({ title: 'MY ACCOUNT', hasBack: true })}
      />
      <Stack.Screen
        name="AccountRewards"
        component={AccountRewards}
        options={screenOptions({ title: <SocietyScreenTitle />, hasBack: true })}
      />
    </Stack.Navigator>
  )
}
