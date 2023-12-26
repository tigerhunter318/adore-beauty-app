import TrackPlayer, { Capability, Event, AppKilledPlaybackBehavior } from 'react-native-track-player'

const setupPlayer = async remoteConfig => {
  try {
    await TrackPlayer.setupPlayer({ waitForBuffer: true, ...remoteConfig })
    await TrackPlayer.updateOptions({
      // icon: require('../assets/img/logo.png'),
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
      },
      alwaysPauseOnInterruption: true,
      capabilities: [Capability.Play, Capability.Pause, Capability.JumpForward, Capability.JumpBackward],
      compactCapabilities: [Capability.Play, Capability.Pause]
      // progressUpdateEventInterval: 2,
    })
  } catch (error) {
    // prevent The player has already been initialized via setupPlayer. error
    console.warn('trackPlayer:setupPlayer', error)
  }
}
/**
 * https://github.com/doublesymmetry/react-native-track-player/blob/main/example/src/services/SetupService.ts
 * @param remoteConfig
 * @returns {Promise<boolean>}
 */
const initTrackPlayer = async (remoteConfig = {}) => {
  let isSetup = false
  try {
    // this method will only reject if player has not been setup yet
    await TrackPlayer.getCurrentTrack()
    isSetup = true
  } catch {
    await setupPlayer(remoteConfig)
    isSetup = true
  }
  return isSetup
}

const remoteTrackPlayer = async () => {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
  })
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    let newPosition = await TrackPlayer.getPosition()
    const duration = await TrackPlayer.getDuration()
    newPosition += 15
    if (newPosition > duration) {
      newPosition = duration
    }
    TrackPlayer.seekTo(newPosition)
  })
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    let newPosition = await TrackPlayer.getPosition()
    newPosition -= 15
    if (newPosition < 0) {
      newPosition = 0
    }
    TrackPlayer.seekTo(newPosition)
  })
}

export const trackPlayerEvents = {
  initTrackPlayer,
  remoteTrackPlayer
}
