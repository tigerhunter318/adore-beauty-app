import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import PostScreen from '../screens/post/PostScreen'
import BeautyIQTitle from '../components/beautyiq/BeautyIQTitle'

const Stack = createStackNavigator()

export const PostStack = ({ route }) => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      initialParams={route.params}
      name="PostScreen"
      component={PostScreen}
      options={screenOptions({
        title: <BeautyIQTitle />,
        hasBack: true,
        hasSearch: true
      })}
    />
  </Stack.Navigator>
)
