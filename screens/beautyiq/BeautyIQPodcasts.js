import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { useActionState } from '../../store/utils/stateHook'
import podcasts, { useAllProgramsClips } from '../../store/modules/podcasts'
import Container from '../../components/ui/Container'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import { vh, vw } from '../../utils/dimensions'
import theme from '../../constants/theme'
import Hr from '../../components/ui/Hr'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import Loading from '../../components/ui/Loading'
import PodcastTabs from '../../components/podcasts/PodcastTabs'
import Type from '../../components/ui/Type'
import PodcastAudioPlayerBar from '../../components/podcasts/PodcastAudioPlayerBar'
import { isValidObject } from '../../utils/validation'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { hasFetchAtTimeExpired } from '../../hooks/useCacheExpiry'

const styles = StyleSheet.create({
  tabHeaderListContainer: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  header: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 1.5,
    color: theme.black,
    marginBottom: 20,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  loader: {
    height: vh(80)
  },
  hr: {
    backgroundColor: theme.splitorColor,
    marginTop: 10,
    height: 1
  }
})

const BeautyIQPodcastsList = ({ programs, onProgramClick }) =>
  Object.entries(programs)?.map((program, index) => (
    <Container
      mb={1}
      onPress={() => onProgramClick({ programId: program?.[1]?.Id })}
      key={index}
      testID="BeautyIQPodcastsListItem"
      background={theme.backgroundLightGrey}
    >
      <ResponsiveImage url={program?.[1]?.ArtworkUrl} displayWidth={vw(28)} displayHeight={vw(28)} />
    </Container>
  ))

const BeautyIQPodcasts = () => {
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const fetchedAt = useActionState('podcasts.fetchedAt')
  const pageSizeOnState = useActionState('podcasts.pageSize')
  const programs = useActionState('podcasts.programs')
  const isPending = useActionState('podcasts.request.pending')
  const clips = useAllProgramsClips()
  const hasSavedPrograms = isValidObject(programs)
  const pageSize = 10

  const fetchData = async () => {
    if (!isPending) {
      await dispatch(podcasts.actions.fetchPodcasts(pageSize))
    }
  }
  const handlePullToRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handlePodcastClick = ({ programId }) => navigation.push('BeautyIQPodcastProgram', { programId })

  const handleScreenLoad = () => {
    emarsysEvents.trackScreen('Podcast Show screen')
    if (hasFetchAtTimeExpired(fetchedAt) || pageSizeOnState !== pageSize) {
      fetchData()
    }
  }

  useScreenFocusEffect(handleScreenLoad, [fetchedAt])

  const TabHeader = (
    <Container>
      <Container style={styles.tabHeaderListContainer} testID="BeautyIQPodcastsScreen.BeautyIQPodcastsList">
        <BeautyIQPodcastsList programs={programs} onProgramClick={handlePodcastClick} />
      </Container>
      <Hr style={styles.hr} />
      <Type style={styles.header}>
        Latest <Type bold>podcasts</Type>
      </Type>
    </Container>
  )

  return (
    <Container testID="BeautyIQPodcastsScreen" flexGrow={1}>
      <PodcastTabs
        TabHeaderComponent={hasSavedPrograms ? TabHeader : <Loading lipstick style={styles.loader} />}
        episodes={clips}
        loading={isPending}
        onRefresh={handlePullToRefresh}
        refreshing={refreshing}
      />
      {hasSavedPrograms && <PodcastAudioPlayerBar />}
    </Container>
  )
}

export default BeautyIQPodcasts
