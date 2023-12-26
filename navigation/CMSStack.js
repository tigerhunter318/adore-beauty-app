import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import CMSScreen from '../screens/cms/CMSScreen'
import AdoreLogo from '../assets/images/logo.png'

const Stack = createStackNavigator()

export const CMSStack = ({ route }) => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="CMS"
      initialParams={route.params}
      component={CMSScreen}
      options={screenOptions({
        logoSource: AdoreLogo,
        hasBack: true,
        hasSearch: true
      })}
    />
  </Stack.Navigator>
)
