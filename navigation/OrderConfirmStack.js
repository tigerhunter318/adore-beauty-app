import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import CartOrderConfirm from '../screens/cart/CartOrderConfirm'
import Icon from '../components/ui/Icon'
import { appReview } from '../services/appReview'

const Stack = createStackNavigator()

export const OrderConfirmStack = () => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="CartOrderConfirm"
      component={CartOrderConfirm}
      options={screenOptions({
        title: 'Order Confirmation',
        right: <Icon name="close" color="white" type="material" />,
        onRightPress: navigation => {
          appReview.rateApp()
          navigation.navigate('Shop')
        }
      })}
    />
  </Stack.Navigator>
)
