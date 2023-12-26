import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useIsGuestUser, useIsLoggedIn } from '../store/utils/stateHook'
import Cart from '../screens/cart/Cart'
import { LoginStack } from './LoginStack'
import CartCheckoutDeliveryAddress from '../screens/cart/CartCheckoutDeliveryAddress'
import CartCheckoutDeliveryOptions from '../screens/cart/CartCheckoutDeliveryOptions'
import CartPayment from '../screens/cart/CartPayment'
import CartPaymentMethod from '../screens/cart/CartPaymentMethod'
import { config, noHeaderScreenOptions, screenOptions } from './utils'

const Stack = createStackNavigator()
const cartScreenOptions = (title, hasBack = true, hasSearch = true) => screenOptions({ title, hasBack, hasSearch })

export const CartStack = ({ route }) => {
  const isLoggedIn = useIsLoggedIn()
  const isGuestUser = useIsGuestUser()

  return (
    <Stack.Navigator {...config}>
      {!(isLoggedIn || isGuestUser) && (
        <Stack.Screen name="Login" component={LoginStack} options={noHeaderScreenOptions} />
      )}
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={screenOptions({ title: 'Shopping Bag', hasBack: true, hasSearch: true })}
      />
      <Stack.Screen
        name="CartCheckoutDeliveryAddress"
        component={CartCheckoutDeliveryAddress}
        options={cartScreenOptions('Delivery Address')}
      />
      <Stack.Screen
        name="CartCheckoutDeliveryOptions"
        component={CartCheckoutDeliveryOptions}
        options={cartScreenOptions('Delivery Options')}
      />
      <Stack.Screen name="CartPayment" component={CartPayment} options={cartScreenOptions('Payment')} />
      <Stack.Screen
        name="CartPaymentMethod"
        component={CartPaymentMethod}
        options={cartScreenOptions('Payment Method')}
      />
    </Stack.Navigator>
  )
}
