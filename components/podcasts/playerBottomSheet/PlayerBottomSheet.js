import React, { useState, useEffect, memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'
import { vh } from '../../../utils/dimensions'
import { isIos } from '../../../utils/device'
import QueueScreen from './QueueScreen'
import PlayerNavBar from './PlayerNavBar'
import TrackScreen from './TrackScreen'
import CustomBottomSheet from '../../ui/CustomBottomSheet'
import { gaEvents } from '../../../services/ga'
import SafeScreenView from '../../ui/SafeScreenView'
import { isValidArray } from '../../../utils/validation'
import LoadingOverlay from '../../ui/LoadingOverlay'
import playerTheme from './playerTheme'

const PlayerBottomSheetContent = ({ style, isPending }) => {
  const [isQueueVisible, setIsQueueVisible] = useState(false)

  const handleQueuePress = () => {
    setIsQueueVisible(!isQueueVisible)
    gaEvents.trackAudioPlayer('queue')
  }

  return (
    <LinearGradient colors={['rgba(0, 0, 0, 0.95)', playerTheme.background]} locations={[0.1, 0.3]} style={style}>
      <LoadingOverlay
        active={isPending}
        spinnerSize="large"
        spinnerColor={playerTheme.primaryColor}
        backgroundColor={playerTheme.overlay}
        containerStyle={{ zIndex: 9 }}
      />
      <SafeScreenView edges={['right', 'bottom', 'left', 'top']} style={{ paddingBottom: isIos() ? 0 : 20 }} flex={1}>
        <PlayerNavBar onQueuePress={handleQueuePress} isQueueVisible={isQueueVisible} />
        {isQueueVisible ? <QueueScreen /> : <TrackScreen />}
      </SafeScreenView>
    </LinearGradient>
  )
}

const PlayerBottomSheet = () => {
  const {
    bottomSheetRef,
    trackPlayer: { queue, isPending },
    minimizePlayer
  } = usePodcastPlayerContext()

  const handleEmptyQueue = () => {
    if (!isValidArray(queue)) {
      minimizePlayer()
    }
  }

  useEffect(handleEmptyQueue, [queue])

  return (
    <CustomBottomSheet
      duration={250}
      height={vh(100)}
      hasBackdrop={false}
      ref={bottomSheetRef}
      style={{ opacity: 1 }}
      hasHeaderClose={false}
      content={<PlayerBottomSheetContent isPending={isPending} style={{ height: vh(100) }} />}
      enabledContentGestureInteraction={!!isIos()}
      contentContainerStyle={{ backgroundColor: 'transparent' }}
    />
  )
}

export default memo(PlayerBottomSheet)
