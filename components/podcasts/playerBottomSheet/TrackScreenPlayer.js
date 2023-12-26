import React from 'react'
import { StyleSheet } from 'react-native'
import {
  AudioPlayerPlayAndPauseButton,
  AudioPlayerProgressBar,
  AudioPlayerSkipToNextButton,
  AudioPlayerSkipToPreviousButton
} from '../AudioPlayerControllers'
import Container from '../../ui/Container'
import { isIos } from '../../../utils/device'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'
import playerTheme from './playerTheme'
import CustomShadow from '../../ui/CustomShadow'

const styles = StyleSheet.create({
  shadow: {
    shadowColor: playerTheme.background,
    shadowOffset: { width: 0, height: -25 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  container: {
    backgroundColor: isIos() ? 'rgba(0,0,0,.90)' : 'rgba(0,0,0,.99)',
    paddingBottom: 60
  },
  innerContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 60,
    paddingTop: 10
  },
  progressBar: {
    position: 'absolute',
    top: -23,
    width: '100%'
  }
})

const TrackScreenPlayer = () => {
  const { trackPlayer } = usePodcastPlayerContext()
  const { currentTrack } = trackPlayer
  const isPending = trackPlayer.isTrackLoading(currentTrack)

  return (
    <>
      {!isIos() && <CustomShadow />}
      <Container style={[isIos() && styles.shadow, styles.container]}>
        <AudioPlayerProgressBar style={styles.progressBar} />
        <Container marginTop={isPending ? 15 : 0} style={styles.innerContainer}>
          <AudioPlayerSkipToPreviousButton />
          <AudioPlayerPlayAndPauseButton
            track={currentTrack}
            color={playerTheme.button}
            loadingIconSize="large"
            iconSize={70}
          />
          <AudioPlayerSkipToNextButton />
        </Container>
      </Container>
    </>
  )
}

export default TrackScreenPlayer
