import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { config, screenOptions } from './utils'
import BeautyIQPodcastEpisode from '../screens/beautyiq/BeautyIQPodcastEpisode'
import BeautyIQTitle from '../components/beautyiq/BeautyIQTitle'
import BeautyIQPodcastProgram from '../screens/beautyiq/BeautyIQPodcastProgram'

const Stack = createStackNavigator()

export const PodcastStack = ({ route }) => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      initialParams={route.params}
      name="BeautyIQPodcastEpisode"
      component={BeautyIQPodcastEpisode}
      options={screenOptions({
        title: <BeautyIQTitle />,
        hasBack: true,
        hasSearch: true,
        swipeEnabled: true
      })}
    />
    <Stack.Screen
      name="BeautyIQPodcastProgram"
      initialParams={{ isFullScreen: true }}
      component={BeautyIQPodcastProgram}
      options={screenOptions({
        title: <BeautyIQTitle />,
        hasBack: true,
        hasSearch: true
      })}
    />
  </Stack.Navigator>
)
