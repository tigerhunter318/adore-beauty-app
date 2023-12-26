import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Type from '../../ui/Type'
import Icon from '../../ui/Icon'
import Container from '../../ui/Container'
import { fromNow } from '../../../utils/date'
import ResponsiveImage from '../../ui/ResponsiveImage'
import { px } from '../../../utils/dimensions'
import PodcastRichText from '../PodcastRichText'
import { useActionState } from '../../../store/utils/stateHook'
import { formatEpisodeTrackData } from '../utils'
import { usePodcastPlayerContext } from '../PodcastPlayerContext'
import { gaEvents } from '../../../services/ga'
import playerTheme from './playerTheme'

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    fontSize: 18,
    color: playerTheme.primaryColor
  },
  dateAndTime: {
    textTransform: 'uppercase',
    fontSize: 9,
    letterSpacing: 1,
    lineHeight: 20,
    paddingTop: 10,
    color: playerTheme.primaryColor
  }
})

const TrackScreenContentHeader = ({ navigation, minimizePlayer, currentTrack, imageSize = px(225) }) => {
  const programName = useActionState(`podcasts.programs.${currentTrack?.ProgramId}.Name`)
  const { image, title, duration, publishedAt } = formatEpisodeTrackData({
    episode: currentTrack,
    programName
  })

  const handleEpisodePress = () => {
    gaEvents.trackAudioPlayer('episode_title')
    minimizePlayer()
    navigation.navigate('BeautyIQPodcastEpisode', {
      episode: currentTrack
    })
  }

  const handleProgramPress = () => {
    gaEvents.trackAudioPlayer('show_image')
    minimizePlayer()
    navigation.navigate('BeautyIQPodcastProgram', {
      programId: currentTrack?.ProgramId
    })
  }

  return (
    <>
      <Container onPress={handleProgramPress} center pt={2}>
        <ResponsiveImage url={image} displayWidth={imageSize} displayHeight={imageSize} />
      </Container>
      <Container pt={4} pb={3}>
        <Container ph={2}>
          <Type semiBold onPress={handleEpisodePress} style={styles.title}>
            {title}
          </Type>
          <Container justify="space-between">
            <Container rows>
              <Type semiBold style={styles.dateAndTime}>
                {fromNow(publishedAt)}
              </Type>
              <Container pt={1.1}>
                <Icon type="materialcommunityicons" name="circle-small" color={playerTheme.primaryColor} size={18} />
              </Container>
              <Type semiBold style={styles.dateAndTime}>
                {duration} min
              </Type>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  )
}

const TrackScreenContentBody = ({ content }) => (
  <PodcastRichText
    hasBoldLinks
    isModalScreen
    styleProps={{
      p: { color: playerTheme.secondaryColor },
      container: { marginBottom: 20 }
    }}
    color={playerTheme.primaryColor}
    content={content}
  />
)

const TrackScreenContent = () => {
  const {
    trackPlayer: { currentTrack },
    navigation,
    minimizePlayer
  } = usePodcastPlayerContext()

  if (!currentTrack) return null

  return (
    <ScrollView>
      <TrackScreenContentHeader navigation={navigation} currentTrack={currentTrack} minimizePlayer={minimizePlayer} />
      <TrackScreenContentBody content={currentTrack.DescriptionHtml} />
    </ScrollView>
  )
}

export default TrackScreenContent
