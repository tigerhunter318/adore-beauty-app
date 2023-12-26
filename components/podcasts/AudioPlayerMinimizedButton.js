import React from 'react'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { useTranslateAnimation } from '../../utils/animate'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import Icon from '../ui/Icon'
import { isValidArray } from '../../utils/validation'
import { vh } from '../../utils/dimensions'

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    right: 20,
    bottom: vh(50) - 55,
    zIndex: 9
  },
  innerContainer: {
    backgroundColor: theme.black80,
    width: 48,
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const AudioPlayerMinimizedButton = ({ style }) => {
  const {
    trackPlayer: { queue, usePlaybackState, trackPlayerState },
    openPlayer
  } = usePodcastPlayerContext()
  const playbackState = usePlaybackState()
  const isVisible = isValidArray(queue) && playbackState !== trackPlayerState?.None
  const animationRef = useSharedValue(100)
  const animatedStyle = useTranslateAnimation({
    animationType: 'translateX',
    animationRef,
    isVisible
  })

  if (!isValidArray(queue)) return null

  return (
    <Animated.View style={[animatedStyle, styles.outerContainer]}>
      <Container style={[styles.innerContainer, style]} onPress={openPlayer}>
        <Icon type="materialcommunityicons" name="podcast" color={theme.white} size={34} />
      </Container>
    </Animated.View>
  )
}
export default AudioPlayerMinimizedButton
