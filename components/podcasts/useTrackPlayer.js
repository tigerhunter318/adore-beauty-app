import { useState, useEffect } from 'react'
import TrackPlayer, {
  Event,
  usePlaybackState,
  useProgress,
  State,
  useTrackPlayerEvents
} from 'react-native-track-player'
import envConfig from '../../config/envConfig'
import { gaEvents } from '../../services/ga'
import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import useOmnyConsumptionAPI from './useOmnyConsumptionAPI'
import { trackPlayerEvents } from '../../services/trackPlayer'

/**
 * React Native Track Player
 * http://react-native-track-player.js.org/documentation/
 * https://github.com/DoubleSymmetry/react-native-track-player/blob/main/src/hooks.ts#L5
 */

const useTrackPlayer = () => {
  const playbackState = usePlaybackState()
  const [queue, setQueue] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { updateConsumptionData, seqNumber } = useOmnyConsumptionAPI()

  const hasNext = queue?.length - 1 !== currentTrackIndex
  const hasPrevious = currentTrackIndex !== 0

  const isCurrentTrack = track => getTrackIndex(track) === currentTrackIndex

  const isTrackState = (track, stateName) => isCurrentTrack(track) && playbackState === stateName

  const isTrackLoading = track =>
    isCurrentTrack(track) && (playbackState === State.Buffering || playbackState === State.Connecting)

  const getTrackIndex = track => track?.id && queue?.findIndex(item => item?.id === track?.id)

  const getCurrentTrack = async () => {
    const index = await TrackPlayer.getCurrentTrack()
    let track = null

    if (parseInt(index) >= 0) {
      track = await TrackPlayer.getTrack(index)
    }

    return { index, track }
  }

  const updateQueue = async () => {
    const tracks = await TrackPlayer.getQueue()
    const { index, track } = await getCurrentTrack()

    if (track) {
      setQueue(tracks)
      setCurrentTrack(track)
      setCurrentTrackIndex(index)

      if (!currentTrack) {
        TrackPlayer.play(track)
        await handleSessionStarted()
      }

      if (currentTrack && currentTrack?.id !== track?.id) {
        await handleSessionFinished()
        await handleSessionStarted()
      }
    } else {
      handleSessionFinished()
      setQueue([])
      setCurrentTrack(null)
      setCurrentTrackIndex(null)
    }

    return tracks
  }

  const removeTrack = async track => {
    const trackIndex = getTrackIndex(track)
    if (queue?.length === 1) {
      return resetPlayer()
    }

    if (isCurrentTrack(track)) {
      if (trackIndex >= 0 && queue?.length - 1 !== currentTrackIndex) {
        await nextTrack()
      }
      if (queue?.length - 1 === currentTrackIndex) {
        await previousTrack()
      }
      await TrackPlayer.remove(trackIndex)
      return updateQueue()
    }

    if (trackIndex >= 0) {
      await TrackPlayer.remove(trackIndex)
      return updateQueue()
    }
  }

  const addTrack = async track => {
    await TrackPlayer.add([track])
    return updateQueue()
  }

  const playWhenReady = track => {
    const promise = new Promise(resolve => {
      const handler = event => {
        if (event.state === State?.Ready) {
          sub.remove()

          if (track) {
            TrackPlayer.play(track)
          } else {
            TrackPlayer.play()
          }
        }
        resolve(event)
      }
      const sub = TrackPlayer.addEventListener(Event.PlaybackState, handler)
    })
    return promise
  }

  const pauseTrack = async () => {
    await TrackPlayer.pause()
    updateConsumptionData({
      track: currentTrack,
      eventType: 'Stop'
    })
    gaEvents.trackAudioPlayer('play_pause')
  }

  /**
   * add a track to queue and play when loaded
   *
   * @param track
   * @returns {Promise<void>}
   */
  const playTrack = async track => {
    await TrackPlayer.pause()
    gaEvents.trackAudioPlayer('play_pause')

    let trackIndex = getTrackIndex(track)
    if (trackIndex === currentTrackIndex) {
      if (seqNumber !== 1) {
        updateConsumptionData({
          track,
          eventType: 'Start'
        })
      }
      return TrackPlayer.play()
    }

    if (trackIndex === -1) {
      trackIndex = queue?.length
      await addTrack(track)
    }

    await TrackPlayer.skip(trackIndex)
    await updateQueue()
    await playWhenReady()
  }

  const nextTrack = async () => {
    if (hasNext) {
      gaEvents.trackAudioPlayer('next_skip')
      await TrackPlayer.skipToNext()
      await updateQueue()
    }
  }

  const previousTrack = async () => {
    if (hasPrevious) {
      gaEvents.trackAudioPlayer('previous_skip')
      await TrackPlayer.skipToPrevious()
      await updateQueue()
    }
  }

  const resetPlayer = async () => {
    setIsPending(true)
    await pauseTrack()
    await TrackPlayer.reset()
    await updateQueue()
    setIsPending(false)
  }

  const handleSessionStarted = async () => {
    const { track } = await getCurrentTrack()

    if (track) {
      await updateConsumptionData({
        track,
        eventType: 'Start'
      })
    }
  }

  const handleSessionFinished = async () => {
    await updateConsumptionData({
      track: currentTrack,
      eventType: 'Stop',
      sendData: true
    })
  }

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged) {
      await updateQueue()
    }
  })

  const handleInit = async () => {
    const trackPlayerConfig = getRemoteConfigJson('track_player_config')
    if (envConfig.omny.enabled) {
      await trackPlayerEvents.initTrackPlayer(trackPlayerConfig)
    }
    await updateQueue()
  }

  useEffect(() => {
    handleInit()
  }, [])

  return {
    queue,
    addTrack,
    playTrack,
    pauseTrack,
    removeTrack,
    nextTrack,
    resetPlayer,
    currentTrack,
    previousTrack,
    getTrackIndex,
    isCurrentTrack,
    isTrackState,
    isTrackLoading,
    isPending,
    trackPlayerState: State,
    useProgress,
    usePlaybackState,
    currentTrackIndex,
    player: TrackPlayer,
    hasNext,
    hasPrevious
  }
}

export default useTrackPlayer
