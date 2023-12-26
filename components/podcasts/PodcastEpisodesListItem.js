import React from 'react'
import { StyleSheet } from 'react-native'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import { sanitizeContent } from '../../utils/format'
import Container from '../ui/Container'
import { px } from '../../utils/dimensions'
import { AudioPlayerPlayAndPauseButton, AudioPlayerAddToQueueButton } from './AudioPlayerControllers'
import { formatEpisodeTrackData } from './utils'
import { fromNow } from '../../utils/date'
import { useActionState } from '../../store/utils/stateHook'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import { isSmallDevice } from '../../utils/device'

const styles = StyleSheet.create({
  buttonContainer: {
    width: 90,
    paddingVertical: 5
  },
  outerContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    backgroundColor: theme.white
  },
  innerContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 15,
    paddingTop: 5
  },
  date: {
    alignItems: 'center',
    textTransform: 'uppercase',
    fontSize: 8,
    paddingTop: 7,
    color: theme.textGreyDark
  },
  title: {
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 20,
    color: theme.black,
    paddingRight: 10,
    marginBottom: 20
  },
  description: {
    fontSize: 12,
    color: theme.textGreyDark,
    letterSpacing: 0.5,
    lineHeight: 18
  }
})

export const PodcastEpisodesListItemPlayerButtons = ({
  track,
  duration,
  color = theme.lightBlack,
  textColor = theme.textGreyDark,
  isCurrentTrack,
  ...rest
}) => (
  <Container center rows {...rest}>
    <Container style={styles.buttonContainer}>
      <AudioPlayerPlayAndPauseButton
        loadingContainerStyle={{ paddingLeft: 15 }}
        hasText
        track={track}
        color={color}
        textColor={textColor}
        containerStyle={{ paddingLeft: isCurrentTrack ? 7 : 0 }}
      />
    </Container>
    <Container style={styles.buttonContainer}>
      <AudioPlayerAddToQueueButton hasText track={track} color={color} textColor={textColor} />
    </Container>
  </Container>
)

const PodcastEpisodesListItem = ({ episode, imageSize = px(66), isPlayerVisible = true, testID }) => {
  const { navigation, trackPlayer } = usePodcastPlayerContext()
  const programName = useActionState(`podcasts.programs.${episode.ProgramId}.Name`)

  const { thumbnail, description, title, duration, track, publishedAt } = formatEpisodeTrackData({
    episode,
    programName
  })

  if (!description) {
    return null
  }

  const isCurrentTrack = trackPlayer.isCurrentTrack(track)

  const handleEpisodePress = () => {
    navigation.navigate('BeautyIQPodcastEpisode', { episode })
  }

  return (
    <Container
      testID={testID}
      style={[
        styles.outerContainer,
        {
          borderWidth: isCurrentTrack ? 2 : 1,
          borderColor: isCurrentTrack ? theme.lightBlack : theme.borderColor,
          paddingHorizontal: isCurrentTrack ? 14 : 15,
          paddingVertical: isCurrentTrack ? 14 : 15
        }
      ]}
    >
      <Container
        style={styles.innerContainer}
        onPress={handleEpisodePress}
        testID="PodcastLatestEpisodesWidget.Container"
      >
        <Container style={styles.imageContainer}>
          <Container background={theme.backgroundLightGrey}>
            <ResponsiveImage url={thumbnail} displayWidth={imageSize} displayHeight={imageSize} />
          </Container>
          <Type style={styles.date}>{fromNow(publishedAt)}</Type>
        </Container>
        <Container flex={1}>
          <Type bold style={styles.title}>
            {sanitizeContent(title)}
          </Type>
          <Container mb={1} rows>
            <Type numberOfLines={isSmallDevice() ? 3 : 5} style={styles.description}>
              {sanitizeContent(description)}
            </Type>
          </Container>
          {isPlayerVisible && (
            <PodcastEpisodesListItemPlayerButtons
              pt={1}
              ml={-1}
              duration={duration}
              track={track}
              isCurrentTrack={isCurrentTrack}
            />
          )}
        </Container>
      </Container>
    </Container>
  )
}

export default PodcastEpisodesListItem
