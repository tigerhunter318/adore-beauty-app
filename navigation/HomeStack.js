import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import HomeScreen from '../screens/home/HomeScreen'
import { shopScreenOptions } from './ShopStack'

const Stack = createStackNavigator()

export const HomeStack = () => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={shopScreenOptions({
        hasBack: false,
        showTabNav: true,
        hasSearch: true,
        showLogo: true
      })}
    />
  </Stack.Navigator>
)
