import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import GiftCertificate from '../components/gift-certificate/GiftCertificate'

const Stack = createStackNavigator()

export const GiftStack = ({ navigation, route }) => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="GiftCertificate"
      initialParams={route.params}
      component={GiftCertificate}
      options={screenOptions({
        title: 'Adore Beauty',
        hasSearch: true,
        hasBack: true
      })}
    />
  </Stack.Navigator>
)
