import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useActionState } from '../../store/utils/stateHook'
import podcasts, { useAllProgramsClips } from '../../store/modules/podcasts'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import PodcastEpisodesListItem from './PodcastEpisodesListItem'
import CustomButton from '../ui/CustomButton'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import { isValidArray } from '../../utils/validation'
import ContentLoading from '../ui/ContentLoading'
import SectionTitle from '../ui/SectionTitle'
import { hasFetchAtTimeExpired } from '../../hooks/useCacheExpiry'

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 10
  },
  button: {
    backgroundColor: theme.white,
    borderColor: theme.black,
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    paddingTop: 15,
    paddingBottom: 15
  }
})

const PodcastLatestEpisodesWidget = ({
  buttonStyle = {},
  inViewport = false,
  refreshing = false,
  maxItems = 3,
  testID
}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const fetchedAt = useActionState('podcasts.fetchedAt')
  const isPending = useActionState('podcasts.request.pending')
  const clips = useAllProgramsClips()
  const episodes = clips?.slice(0, maxItems)

  const handleViewAllPodcasts = () => {
    navigation.navigate('BeautyIQ', {
      screen: 'BeautyIQ',
      params: {
        screen: 'Podcasts'
      }
    })
  }

  const fetchData = async () => {
    if (!isPending) {
      await dispatch(podcasts.actions.fetchPodcasts())
    }
  }

  const handleScreenRefresh = () => {
    const clearFetchedAt = async () => {
      await dispatch(podcasts.actions.fetchedAt(null))
    }

    if (refreshing) {
      clearFetchedAt()
    }
  }

  const handleInViewport = () => {
    if (inViewport && hasFetchAtTimeExpired(fetchedAt)) {
      fetchData()
    }
  }

  useEffect(handleInViewport, [inViewport])
  useEffect(handleScreenRefresh, [refreshing])

  return (
    <Container testID={testID}>
      <Container style={styles.headerContainer}>
        <Container rows>
          <AdoreSvgIcon name="Listen" width={26} height={28} color={theme.black} />
          <SectionTitle text={`Latest `} highlightedText="Podcasts" style={{ paddingLeft: 10 }} />
        </Container>
      </Container>
      <Container testID="PodcastLatestEpisodesWidget">
        {isValidArray(episodes) &&
          episodes.map((episode, index) => (
            <PodcastEpisodesListItem key={episode.Id} episode={episode} isPlayerVisible={false} />
          ))}
      </Container>
      {isPending &&
        [...Array(maxItems)].map((item, index) => (
          <ContentLoading
            type="Article"
            key={`Article-Content-Loader${index}`}
            styles={{ container: { paddingTop: 7 } }}
          />
        ))}
      <CustomButton semiBold color={theme.black} style={buttonStyle} onPress={handleViewAllPodcasts}>
        View all podcasts
      </CustomButton>
    </Container>
  )
}

export default PodcastLatestEpisodesWidget
