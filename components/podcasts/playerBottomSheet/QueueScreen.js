import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import theme from '../../../constants/theme'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'
import Type from '../../ui/Type'
import Container from '../../ui/Container'
import QueueScreenList from './QueueScreenList'
import playerTheme from './playerTheme'
import { isIos } from '../../../utils/device'
import AnimatedBar from '../../ui/AnimatedBar'

const removeButtonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  bottomSheetContainer: {
    height: isIos() ? 80 : 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: playerTheme.button
  },
  buttonText: {
    paddingBottom: isIos() ? 20 : 30,
    letterSpacing: 1,
    color: theme.black
  }
})

const QueueScreenRemoveItemButton = ({ isVisible = false, onSelectedQueueItems }) => (
  <Container style={removeButtonStyles.container}>
    <AnimatedBar
      isVisible={isVisible}
      style={{ opacity: 1 }}
      initialSharedValue={100}
      title={
        <Container style={removeButtonStyles.bottomSheetContainer} onPress={onSelectedQueueItems}>
          <Type semiBold style={removeButtonStyles.buttonText} mb={isIos() ? 0 : 2}>
            Remove from queue
          </Type>
        </Container>
      }
    />
  </Container>
)

const QueueScreen = () => {
  const [selectedQueueItems, setSelectedQueueItems] = useState([])
  const { trackPlayer } = usePodcastPlayerContext()
  const { queue, currentTrack, currentTrackIndex } = trackPlayer
  const nextEpisodesOnQueue = queue?.filter(item => item?.id !== currentTrack?.id)

  const handleManageQueuePress = item => {
    setSelectedQueueItems(prevState => {
      if (prevState.includes(item)) {
        return prevState.filter(selectedItems => selectedItems?.Id !== item?.Id)
      }
      return [item, ...prevState]
    })
  }

  const removeSelectedQueueItems = () => {
    selectedQueueItems.map(selectedItem => trackPlayer.removeTrack(selectedItem))
    setSelectedQueueItems([])
  }

  return (
    <Container style={{ height: '100%' }}>
      <QueueScreenList
        data={nextEpisodesOnQueue}
        currentTrack={currentTrack}
        selectedItems={selectedQueueItems}
        onManageQueuePress={handleManageQueuePress}
        currentTrackIndex={currentTrackIndex}
      />
      <QueueScreenRemoveItemButton
        onSelectedQueueItems={removeSelectedQueueItems}
        isVisible={!!selectedQueueItems?.length}
      />
    </Container>
  )
}

export default QueueScreen
