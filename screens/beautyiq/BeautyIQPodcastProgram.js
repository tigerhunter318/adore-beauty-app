import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import Type from '../../components/ui/Type'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import { sanitizeContent } from '../../utils/format'
import Container from '../../components/ui/Container'
import PodcastTabs from '../../components/podcasts/PodcastTabs'
import podcasts from '../../store/modules/podcasts'
import { useActionState } from '../../store/utils/stateHook'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { gaEvents } from '../../services/ga'
import PodcastAudioPlayerBar from '../../components/podcasts/PodcastAudioPlayerBar'
import PodcastRichText from '../../components/podcasts/PodcastRichText'
import theme from '../../constants/theme'
import { smartlook } from '../../services/smartlook'
import { hasFetchAtTimeExpired } from '../../hooks/useCacheExpiry'

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 23,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    letterSpacing: 1
  }
})

const BeautyIQPodcastProgram = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false)
  const { programId, isFullScreen } = route.params
  const dispatch = useDispatch()

  const nextCursor = useActionState(`podcasts.programClips.${programId}.nextCursor`)
  const clips = useActionState(`podcasts.programClips.${programId}.clips`)
  const fetchedAt = useActionState(`podcasts.programClips.${programId}.fetchedAt`)
  const isPending = useActionState('podcasts.request.pending')
  const program = useActionState(`podcasts.programs.${programId}`)

  const { Name: programName, ArtworkUrl: image, DescriptionHtml: content } = program || {}

  const fetchData = async (cursor = 1) => {
    if (!isPending) {
      await dispatch(podcasts.actions.fetchProgramClips({ programId, cursor }))
    }
  }

  const handlePullToRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleFetchNext = async () => {
    if (nextCursor) {
      await fetchData(nextCursor)
    }
  }

  const handleScreenLoad = () => {
    if (hasFetchAtTimeExpired(fetchedAt)) {
      fetchData()
    }
  }

  const handleScreenFocus = () => {
    if (programName) {
      gaEvents.screenView('Podcasts', programName)
      smartlook.trackNavigationEvent(`Podcasts - ${programName}`)
    }
  }

  useScreenFocusEffect(handleScreenLoad, [fetchedAt])
  useScreenFocusEffect(handleScreenFocus, [programName])

  return (
    <Container testID="BeautyIQPodcastProgram">
      <PodcastTabs
        TabHeaderComponent={
          <Container mb={2}>
            <Container>
              <ResponsiveImage url={image} width={90} height={80} useAspectRatio />
            </Container>
            <Type semiBold style={styles.title}>
              {sanitizeContent(programName)}
            </Type>
            <PodcastRichText ignoreLinks content={content} color={theme.lightBlack} />
          </Container>
        }
        episodes={clips}
        onEndReached={handleFetchNext}
        loading={isPending}
        onRefresh={handlePullToRefresh}
        refreshing={refreshing}
        isFullScreen={isFullScreen}
      />
      <PodcastAudioPlayerBar isFullScreen={isFullScreen} />
    </Container>
  )
}

export default BeautyIQPodcastProgram
