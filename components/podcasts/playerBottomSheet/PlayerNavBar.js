import React from 'react'
import { Alert, StyleSheet } from 'react-native'
import { gaEvents } from '../../../services/ga'
import { isSmallDevice } from '../../../utils/device'
import AdoreSvgIcon from '../../ui/AdoreSvgIcon'
import Container from '../../ui/Container'
import Icon from '../../ui/Icon'
import Type from '../../ui/Type'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'
import playerTheme from './playerTheme'

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute'
  },
  minimize: {
    left: 6,
    bottom: 1,
    width: 48,
    height: 48
  },
  goBack: {
    left: 0,
    bottom: 0,
    width: 48,
    height: 48
  },
  queue: {
    right: isSmallDevice() ? 40 : 58,
    bottom: -2,
    width: 48,
    height: 48
  },
  close: {
    right: 0,
    bottom: 0,
    width: 48,
    height: 48
  },
  closeText: {
    textAlign: 'center',
    color: playerTheme.button,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  titleContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 18,
    width: '100%'
  },
  title: {
    textAlign: 'center',
    color: playerTheme.primaryColor,
    fontSize: 12
  }
})

const MinimizeButton = ({ onPress }) => (
  <Container style={[styles.icon, styles.minimize]} onPress={onPress}>
    <AdoreSvgIcon name="angle-down" color={playerTheme.button} />
  </Container>
)

const GoBackButton = ({ onPress }) => (
  <Container style={[styles.icon, styles.goBack]} onPress={onPress}>
    <Icon name="ios-arrow-back" size={24} type="ion" color={playerTheme.button} />
  </Container>
)

const QueueButton = ({ onPress }) => (
  <Container style={[styles.icon, styles.queue]} onPress={onPress}>
    <Icon type="materialcommunityicons" name="playlist-play" color={playerTheme.button} size={27} />
  </Container>
)

const CloseButton = ({ onPress }) => (
  <Container style={[styles.icon, styles.close, !isSmallDevice() && { right: 8 }]} onPress={onPress}>
    {isSmallDevice() ? (
      <Icon name="close" size={26} type="material" color={playerTheme.button} />
    ) : (
      <Type bold style={styles.closeText}>
        quit
      </Type>
    )}
  </Container>
)

const ScreenTitle = ({ title }) => (
  <Container style={styles.titleContainer}>
    <Type semiBold style={styles.title}>
      {title}
    </Type>
  </Container>
)

const playerCloseAlert = ({ onPress }) => {
  Alert.alert(
    'Would you like to exit the player and clear your queue?',
    '',
    [
      {
        text: 'Cancel',
        onPress: () => {}
      },
      {
        text: 'Yes',
        onPress
      }
    ],
    {
      cancelable: false
    }
  )
}

const PlayerNavBar = ({ onQueuePress, isQueueVisible }) => {
  const {
    trackPlayer: { resetPlayer, currentTrack },
    minimizePlayer
  } = usePodcastPlayerContext()
  const title = currentTrack?.artist

  const handleClosePress = () => {
    const onPress = async () => {
      gaEvents.trackAudioPlayer('close')
      await resetPlayer()
      onQueuePress()
    }
    playerCloseAlert({ onPress })
  }

  return (
    <Container style={{ height: 48 }} flexGrow={1}>
      {!isQueueVisible ? (
        <>
          <MinimizeButton onPress={minimizePlayer} />
          <ScreenTitle title={title} />
          <QueueButton onPress={onQueuePress} />
          <CloseButton onPress={handleClosePress} />
        </>
      ) : (
        <>
          <GoBackButton onPress={onQueuePress} />
          <ScreenTitle title={title} />
          <CloseButton onPress={handleClosePress} />
        </>
      )}
    </Container>
  )
}

export default PlayerNavBar
