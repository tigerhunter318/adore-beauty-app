import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/core'
import theme from '../../constants/theme'
import Type from '../../components/ui/Type'
import { sanitizeContent } from '../../utils/format'
import { ViewportProvider } from '../../components/viewport/ViewportContext'
import settings from '../../constants/settings'
import Avatar from '../../components/ui/Avatar'
import Container from '../../components/ui/Container'
import { formatEpisodeTrackData } from '../../components/podcasts/utils'
import { useActionState } from '../../store/utils/stateHook'
import podcasts from '../../store/modules/podcasts'
import { useScreenHeaderTitle } from '../../navigation/utils'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { gaEvents } from '../../services/ga'
import PodcastRichText from '../../components/podcasts/PodcastRichText'
import PodcastAudioPlayerBar from '../../components/podcasts/PodcastAudioPlayerBar'
import { fromNow } from '../../utils/date'
import { usePodcastPlayerContext } from '../../components/podcasts/PodcastPlayerContext'
import SafeScreenView from '../../components/ui/SafeScreenView'
import { PodcastEpisodesListItemPlayerButtons } from '../../components/podcasts/PodcastEpisodesListItem'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { smartlook } from '../../services/smartlook'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    position: 'relative'
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    padding: 0,
    paddingBottom: 40
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
    lineHeight: 34,
    letterSpacing: 0.5,
    color: theme.lightBlack
  },
  avatarContainer: {
    marginLeft: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  description: {
    lineHeight: 23,
    letterSpacing: 0.3
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.black
  },
  shareButton: {
    position: 'absolute',
    zIndex: 10,
    right: 20.2
  }
})

const BeautyIQPodcastEpisode = ({ route }) => {
  const [podcastEpisodeFromUrl, setPodcastEpisodeFromUrl] = useState(null)
  const { trackPlayer } = usePodcastPlayerContext()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { url, episode } = route.params || {}
  const programName = useActionState(`podcasts.programs.${episode?.ProgramId}`)?.Name
  const clips = useActionState(`podcasts.programClips.${episode?.ProgramId}.clips`)
  const clip = clips?.find(item => item.Id === episode?.Id)

  const { thumbnail, content, title, track, publishedAt } = formatEpisodeTrackData({
    episode: clip || podcastEpisodeFromUrl || episode,
    programName
  })
  const isCurrentTrack = trackPlayer.isCurrentTrack(track)

  const handleProgramPress = () => {
    if (episode?.ProgramId) {
      navigation.push('BeautyIQPodcastProgram', {
        programId: episode?.ProgramId
      })
    }
  }

  const onMount = () => {
    const fetchPodcastEpisodeFromUrl = async () => {
      const data = await dispatch(podcasts.actions.fetchClipDetails({ url }))
      setPodcastEpisodeFromUrl(data)
    }
    if (!episode && url) {
      fetchPodcastEpisodeFromUrl()
    }
  }

  const handleScreenFocus = () => {
    if (title) {
      emarsysEvents.trackScreen('Podcast Episode screen')
      gaEvents.screenView('Podcasts', title)
      smartlook.trackNavigationEvent(`Podcasts - ${title}`)
    }
  }

  useEffect(onMount, [url])
  useScreenHeaderTitle(programName)
  useScreenFocusEffect(handleScreenFocus, [title])

  if (!content) return null

  return (
    <>
      <ViewportProvider lazyLoadImage>
        <SafeScreenView
          edges={['right', 'left']}
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollViewContainer}
          scrollEventThrottle={settings.defaultScrollEventThrottle}
          scroll
        >
          <Type semiBold style={styles.title} testID="BeautyIQPodcastEpisodeScreen.Title">
            {sanitizeContent(title)}
          </Type>
          <View>
            <Container style={styles.avatarContainer}>
              <Container onPress={handleProgramPress} style={{ flex: 1 }}>
                <Avatar
                  hasRoundEdges={false}
                  name={programName}
                  url={thumbnail}
                  publishDate={fromNow(publishedAt)}
                  background={theme.backgroundLightGrey}
                />
              </Container>
            </Container>
            <PodcastEpisodesListItemPlayerButtons
              track={track}
              pl={0.8}
              pt={2}
              pb={1}
              isCurrentTrack={isCurrentTrack}
            />
          </View>
          {!!content && (
            <Container pr={2} pb={6}>
              <PodcastRichText content={content} color={theme.black} styleProps={{ p: { color: theme.lightBlack } }} />
            </Container>
          )}
        </SafeScreenView>
      </ViewportProvider>
      <PodcastAudioPlayerBar isFullScreen />
    </>
  )
}

export default BeautyIQPodcastEpisode
