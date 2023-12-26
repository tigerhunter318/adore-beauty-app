import React, { useRef, memo, useCallback } from 'react'
import { FlatList } from 'react-native'
import { deepEqual } from 'fast-equals'
import Loading from '../ui/Loading'
import settings from '../../constants/settings'
import ScrollToTopButton from '../ui/ScrollToTopButton'
import useScrollDirection from '../../hooks/useScrollDirection'
import PodcastEpisodesListItem from './PodcastEpisodesListItem'
import { useSafeInsets } from '../../utils/dimensions'

const PodcastEpisodesList = ({
  episodes,
  loading = false,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  isPlayerVisible,
  contentContainerStyle = {},
  isFullScreen = false,
  testID,
  ...props
}) => {
  const { bottom: safeBottomInset } = useSafeInsets()
  const { handleScroll, isActive } = useScrollDirection({
    target: 1200
  })
  const listRef = useRef(null)
  const scrollTopHandler = () => {
    listRef?.current?.scrollToOffset({ offset: 0, animated: true })
  }

  const renderItem = useCallback(
    ({ item }) =>
      item && (
        <PodcastEpisodesListItem episode={item} isPlayerVisible={isPlayerVisible} testID="PodcastEpisodesListItem" />
      ),
    []
  )

  const keyExtractor = useCallback((item, index) => `${item?.Id}-${index}`, [])

  return (
    <>
      <ScrollToTopButton
        isVisible={isActive}
        onPress={scrollTopHandler}
        containerStyle={{ bottom: isFullScreen ? safeBottomInset + 60 : 60 }}
      />
      <FlatList
        testID="PodcastEpisodesList"
        data={episodes}
        ref={listRef}
        renderItem={renderItem}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        onEndReachedThreshold={0.1}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent || <Loading animating={loading} />}
        onEndReached={onEndReached}
        viewabilityConfig={settings.viewConfigRef}
        onScroll={handleScroll}
        scrollEventThrottle={settings.defaultScrollEventThrottle}
        contentContainerStyle={[
          {
            marginTop: 20,
            paddingBottom: isFullScreen ? safeBottomInset + 45 : 45
          },
          contentContainerStyle
        ]}
        {...props}
      />
    </>
  )
}

const areEqual = (prevProps, nextProps) => {
  const { episodes, refreshing } = prevProps || {}
  const { episodes: nextEpisodes, refreshing: nextRefreshing } = nextProps || {}

  /*
   * if the props are equal, it won't update
   */

  const isEqual = deepEqual(nextEpisodes, episodes) && refreshing === nextRefreshing

  return isEqual
}

export default memo(PodcastEpisodesList, areEqual)
