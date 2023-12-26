import React, { useState, useEffect } from 'react'
import Slider from '@react-native-community/slider'
import { Animated, StyleSheet, View } from 'react-native'
import { State as TrackPlayerState } from 'react-native-track-player'
import theme from '../../constants/theme'
import Icon from '../ui/Icon'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import Loading from '../ui/Loading'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { isIos } from '../../utils/device'
import { formatDuration } from '../../utils/date'
import { gaEvents } from '../../services/ga'
import playerTheme from './playerBottomSheet/playerTheme'
import { useAnimationRef, animate } from '../../utils/animate'

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 9,
    textTransform: 'uppercase',
    paddingLeft: 5
  },
  timeIndicatorContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeIndicator: {
    fontSize: 10,
    paddingTop: 15,
    letterSpacing: 1,
    color: playerTheme.secondaryColor
  },
  positionIndicatorContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: playerTheme.primaryColor,
    paddingLeft: 3,
    width: 70,
    height: 30,
    borderRadius: 30
  },
  positionIndicator: {
    color: theme.black,
    letterSpacing: 1
  }
})

export const AudioPlayerProgressBar = ({
  style = {},
  thumbTintColor = playerTheme.primaryColor,
  scale = isIos() ? 0.92 : 0.975
}) => {
  const opacity = useAnimationRef()
  const { trackPlayer } = usePodcastPlayerContext()
  const { useProgress } = trackPlayer
  const [sliderValue, setSliderValue] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const { position, duration } = useProgress()
  const trackDuration = duration

  const start = formatDuration(position)
  const end = formatDuration(trackDuration - position)

  const handleSlidingStarted = () => {
    setIsSeeking(true)
  }

  const handleSlidingCompleted = async value => {
    gaEvents.trackAudioPlayer('scrubber')
    await trackPlayer.player.seekTo(value)
    setSliderValue(value)
    setIsSeeking(false)
  }

  const handleValueChange = value => {
    setSliderPosition(value)
  }

  const onMount = () => {
    if (!isSeeking && position && duration) {
      setSliderValue(position)
      setSliderPosition(position)
    }
  }

  const handleAnimation = () => {
    if (isSeeking) {
      animate(opacity, { toValue: 1, duration: 300 })
    } else {
      animate(opacity, { toValue: 0, duration: 200 })
    }
  }

  useEffect(onMount, [position, duration])
  useEffect(handleAnimation, [isSeeking])

  return (
    <>
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ scale }]
          },
          style
        ]}
      >
        <Animated.View
          style={[
            {
              opacity
            },
            styles.positionIndicatorContainer
          ]}
        >
          <Container>
            <Type semiBold style={styles.positionIndicator}>
              {formatDuration(sliderPosition)}
            </Type>
          </Container>
        </Animated.View>
        <Slider
          style={{ width: '100%', height: 50 }}
          minimumValue={0}
          maximumValue={trackDuration}
          value={sliderValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor={playerTheme.primaryColor}
          maximumTrackTintColor={theme.textGreyDark}
          onSlidingStart={handleSlidingStarted}
          onSlidingComplete={handleSlidingCompleted}
          thumbTintColor={thumbTintColor}
          tapToSeek
        />
      </View>
      {start && end && (
        <Container style={styles.timeIndicatorContainer}>
          <Type pl={2} style={styles.timeIndicator}>
            {start}
          </Type>
          <Type pr={2} style={styles.timeIndicator}>
            {`-${end}`}
          </Type>
        </Container>
      )}
    </>
  )
}

export const AudioPlayerPlayAndPauseButton = ({
  track,
  color = theme.lightBlack,
  textColor = theme.textGreyDark,
  hasText = false,
  iconSize = 30,
  loadingIconSize = 'small',
  loadingContainerStyle = {},
  containerStyle = {}
}) => {
  const { trackPlayer } = usePodcastPlayerContext()
  const { duration } = track || {}
  const isCurrentTrack = trackPlayer.isCurrentTrack(track)
  const isPlaying = trackPlayer.isTrackState(track, TrackPlayerState.Playing)
  const isPending = trackPlayer.isTrackLoading(track)

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await trackPlayer.pauseTrack(track)
    } else {
      await trackPlayer.playTrack(track)
    }
  }

  if (isPending) {
    return (
      <Container
        ph={loadingIconSize === 'large' ? 1.8 : 0}
        pt={loadingIconSize === 'large' ? 0.5 : 0}
        rows
        center
        style={loadingContainerStyle}
      >
        <Loading animating size={loadingIconSize} />
        {hasText && (
          <Type semiBold color={textColor} style={styles.buttonText}>
            {'Loading\nepisode'}
          </Type>
        )}
      </Container>
    )
  }

  const icon = (
    <Icon
      name={isPlaying ? 'pause-circle' : 'play-circle'}
      type="materialcommunityicons"
      size={iconSize}
      color={color}
    />
  )

  const text = isCurrentTrack ? `Now\nplaying` : `Play\n${duration} min`

  if (hasText) {
    return (
      <Container onPress={handleTogglePlay} rows center justify style={containerStyle}>
        {icon}
        {duration && (
          <Type semiBold color={textColor} style={styles.buttonText}>
            {text}
          </Type>
        )}
      </Container>
    )
  }

  return <Container onPress={handleTogglePlay}>{icon}</Container>
}

export const AudioPlayerAddToQueueButton = ({
  track,
  color = theme.lightBlack,
  textColor = theme.textGreyDark,
  iconSize = 30,
  hasText = false
}) => {
  const { trackPlayer } = usePodcastPlayerContext()
  const trackIndex = trackPlayer.getTrackIndex(track)
  const isTrackOnQueue = trackIndex >= 0

  const handleQueue = async () => {
    if (isTrackOnQueue) {
      await trackPlayer.removeTrack(track)
    } else {
      await trackPlayer.addTrack(track)
    }
  }

  const icon = (
    <Icon
      name={isTrackOnQueue ? 'check-circle' : 'plus-circle'}
      type="materialcommunityicons"
      size={iconSize}
      color={color}
    />
  )

  if (hasText) {
    return (
      <Container onPress={handleQueue} rows center justify="flex-end">
        {icon}
        <Type semiBold color={textColor} style={styles.buttonText}>
          {isTrackOnQueue ? 'Added\nto queue' : 'Add\nto queue'}
        </Type>
      </Container>
    )
  }

  return <>{icon}</>
}

export const AudioPlayerSkipToPreviousButton = ({ iconSize = 40 }) => {
  const { trackPlayer } = usePodcastPlayerContext()
  const { hasPrevious, previousTrack } = trackPlayer

  return (
    <Icon
      onPress={previousTrack}
      name="skip-previous"
      type="materialcommunityicons"
      size={iconSize}
      color={hasPrevious ? playerTheme.button : playerTheme.disabled}
    />
  )
}

export const AudioPlayerSkipToNextButton = ({ iconSize = 40 }) => {
  const { trackPlayer } = usePodcastPlayerContext()
  const { hasNext, nextTrack } = trackPlayer

  return (
    <Icon
      onPress={nextTrack}
      name="skip-next"
      type="materialcommunityicons"
      size={iconSize}
      color={hasNext ? playerTheme.button : playerTheme.disabled}
    />
  )
}
