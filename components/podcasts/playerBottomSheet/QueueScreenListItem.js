import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Type from '../../ui/Type'
import Icon from '../../ui/Icon'
import Container from '../../ui/Container'
import ResponsiveImage from '../../ui/ResponsiveImage'
import { formatEpisodeTrackData } from '../utils'
import { sanitizeContent } from '../../../utils/format'
import { px } from '../../../utils/dimensions'
import { useActionState } from '../../../store/utils/stateHook'
import playerTheme from './playerTheme'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%'
  },
  episodeTitle: {
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 16,
    color: playerTheme.primaryColor
  },
  programTitle: {
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 16,
    paddingTop: 5,
    color: playerTheme.secondaryColor
  },
  circleIconContainer: {
    height: '100%',
    paddingRight: 20,
    flexDirection: 'row'
  },
  contentContainer: {
    width: px(288)
  }
})

const QueueScreenListItem = ({
  episode,
  isCurrentTrack,
  selectedItems = null,
  onManageQueuePress,
  imageSize = px(29),
  ItemSeparatorComponent,
  isLastItem,
  currentTrackIndex
}) => {
  const [trackIndex, setTrackIndex] = useState(null)
  const { trackPlayer } = usePodcastPlayerContext()
  const { getTrackIndex } = trackPlayer

  const programName = useActionState(`podcasts.programs.${episode?.ProgramId}.Name`)
  const { thumbnail, title, track } = formatEpisodeTrackData({
    episode,
    programName
  })

  const handleCirclePress = () => onManageQueuePress(episode)

  const onMount = () => {
    setTrackIndex(getTrackIndex(track))
  }

  useEffect(onMount, [])

  if (trackIndex < currentTrackIndex) return null

  return (
    <>
      <Container style={styles.container}>
        {isCurrentTrack ? (
          <Container pr={2}>
            <ResponsiveImage url={thumbnail} displayWidth={imageSize} displayHeight={imageSize} />
          </Container>
        ) : (
          <Container style={styles.circleIconContainer} onPress={handleCirclePress}>
            <Icon
              type="materialcommunityicons"
              name={selectedItems ? 'check-circle' : `checkbox-blank-circle-outline`}
              color={playerTheme.button}
              size={30}
            />
          </Container>
        )}
        <Container style={styles.contentContainer}>
          <Type semiBold style={styles.episodeTitle}>
            {sanitizeContent(title)}
          </Type>
          <Type style={styles.programTitle}>{programName}</Type>
        </Container>
      </Container>
      {!isLastItem && ItemSeparatorComponent}
    </>
  )
}

export default QueueScreenListItem
