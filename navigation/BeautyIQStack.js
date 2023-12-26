import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { DEFAULT_FONT_FAMILY } from '../components/ui/Type'
import { config, screenOptions } from './utils'
import BeautyIQ from '../screens/beautyiq/BeautyIQ'
import BeautyIQTitle from '../components/beautyiq/BeautyIQTitle'
import BeautyIQPodcasts from '../screens/beautyiq/BeautyIQPodcasts'
import BeautyIQPodcastProgram from '../screens/beautyiq/BeautyIQPodcastProgram'
import getTabBar from '../components/ui/TabBarLabel'

const Stack = createStackNavigator()
const TopTab = createMaterialTopTabNavigator()

const topTabOptions = {
  labelStyle: {
    fontSize: 14,
    fontFamily: DEFAULT_FONT_FAMILY
  },
  indicatorStyle: {
    backgroundColor: 'black'
  }
}

const topTabScreenOptions = ({ route }) => ({
  tabBarTestID: `BeautyIQTabBar.${route?.name}`
})

const BeautyIQTabStack = () => (
  <TopTab.Navigator tabBarOptions={topTabOptions} screenOptions={topTabScreenOptions} swipeEnabled={false}>
    <TopTab.Screen name="Articles" component={BeautyIQ} options={{ tabBarLabel: getTabBar('articles', 'Read') }} />
    <TopTab.Screen
      name="Podcasts"
      component={BeautyIQPodcasts}
      options={{
        tabBarLabel: getTabBar('podcasts', 'listen to')
      }}
    />
    {/* <TopTab.Screen name='videos' component={BeautyIQPodcasts} options={{tabBarLabel: getTabBar('videos', 'watch') }} /> */}
  </TopTab.Navigator>
)

export const BeautyIQStack = () => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="BeautyIQ"
      component={BeautyIQTabStack}
      options={screenOptions({
        title: <BeautyIQTitle />,
        hasSearch: true,
        hasBack: true
      })}
    />
    <Stack.Screen
      name="BeautyIQPodcastProgram"
      component={BeautyIQPodcastProgram}
      options={screenOptions({
        title: <BeautyIQTitle />,
        hasBack: true,
        hasSearch: true
      })}
    />
  </Stack.Navigator>
)
