import React from 'react'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import AudioPlayerMinimizedButton from './AudioPlayerMinimizedButton'
import PlayerBottomSheet from './playerBottomSheet/PlayerBottomSheet'

const PodcastAudioPlayer = () => {
  const { isPodcastPage } = usePodcastPlayerContext()

  return (
    <>
      {!isPodcastPage && <AudioPlayerMinimizedButton />}
      <PlayerBottomSheet />
    </>
  )
}

export default PodcastAudioPlayer
