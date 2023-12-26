import './wdyr'
import { AppRegistry, ScrollView } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import App from './App'
import { name as appName } from './app.json'
import { polyfills } from './config/polyfills'
import { trackPlayerEvents } from './services/trackPlayer'

polyfills.init()

ScrollView.defaultProps = {
  ...(ScrollView.defaultProps || {}),
  automaticallyAdjustsScrollIndicatorInsets: false,
  scrollIndicatorInsets: { right: 1 },
  indicatorStyle: 'black'
}

AppRegistry.registerComponent(appName, () => App)

TrackPlayer.registerPlaybackService(() => trackPlayerEvents.remoteTrackPlayer)
