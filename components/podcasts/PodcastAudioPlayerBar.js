import React from 'react'
import { StyleSheet } from 'react-native'
import theme from '../../constants/theme'
import { isTablet, isSmallDevice } from '../../utils/device'
import { px, useSafeInsets, vw } from '../../utils/dimensions'
import { sanitizeContent } from '../../utils/format'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import Type from '../ui/Type'
import { AudioPlayerPlayAndPauseButton } from './AudioPlayerControllers'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import { isValidArray } from '../../utils/validation'
import AnimatedBar from '../ui/AnimatedBar'

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  bottomSheet: {
    opacity: 1,
    width: vw(100)
  },
  bottomSheetContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.black,
    height: 44
  },
  imageContainer: {
    justifyContent: 'center',
    paddingRight: 10
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: isSmallDevice() ? vw(70) : vw(72)
  },
  title: {
    fontSize: 12,
    letterSpacing: 1,
    color: theme.white,
    paddingRight: 10
  },
  program: {
    fontSize: 10,
    letterSpacing: 1,
    color: theme.white,
    paddingTop: 2
  }
})

const PodcastAudioPlayerBar = ({ imageSize = isTablet() ? px(18) : px(29), isFullScreen }) => {
  const { bottom: safeBottomInset } = useSafeInsets()
  const {
    trackPlayer: { currentTrack, queue },
    openPlayer
  } = usePodcastPlayerContext()

  const { title, thumbnail, artist } = currentTrack || {}

  const isVisible = currentTrack && isValidArray(queue)

  return (
    <Container style={styles.container} pointerEvents={!isVisible ? 'none' : undefined}>
      <AnimatedBar
        isVisible={isVisible}
        style={styles.bottomSheet}
        title={
          currentTrack && (
            <Container
              style={[
                styles.bottomSheetContainer,
                {
                  paddingBottom: isFullScreen ? safeBottomInset : 0,
                  height: isFullScreen ? safeBottomInset + 44 : 44
                }
              ]}
            >
              <Container style={styles.imageContainer} onPress={openPlayer}>
                <ResponsiveImage url={thumbnail} displayWidth={imageSize} displayHeight={imageSize} />
              </Container>
              <Container style={styles.textContainer}>
                <Container onPress={openPlayer}>
                  <Type numberOfLines={1} semiBold style={styles.title}>
                    {sanitizeContent(title)}
                  </Type>
                  <Type numberOfLines={1} style={styles.program}>
                    {sanitizeContent(artist)}
                  </Type>
                </Container>
              </Container>
              <AudioPlayerPlayAndPauseButton track={currentTrack} color={theme.white} />
            </Container>
          )
        }
      />
    </Container>
  )
}

export default PodcastAudioPlayerBar
