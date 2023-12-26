import React, { useCallback, useEffect } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { Hit } from 'instantsearch.js'
import { isTablet } from '../../utils/device'
import { useInfiniteHitsResults } from './hooks'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import ArticleCard from '../algolia/ArticleCard'
import SearchNoResults from './SearchNoResults'
import ContentLoading from '../ui/ContentLoading'
import SearchError from './SearchError'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'

type SearchArticlesHitsProps = UseInfiniteHitsProps & {
  onCountChange: any
  isVisible: boolean
}

const SearchArticlesHits = ({ onCountChange, isVisible, ...props }: SearchArticlesHitsProps) => {
  const { error, loading, hasResults, hits, isLastPage, showMore, nbHits } = useInfiniteHitsResults(props)

  const hasMore: boolean = !isLastPage

  const onEndReached = () => hasMore && showMore()

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Hit>) => (
      // @ts-ignore
      <ArticleCard data={item} key={item.objectID} />
    ),
    []
  )

  const keyExtractor = useCallback((item: { objectID: any }) => item.objectID, [])

  const handleArticlesCount = () => {
    onCountChange({ articles: { nbHits, loading } })
  }

  useEffect(handleArticlesCount, [nbHits, loading])

  if (!isVisible) return null
  if (error) return <SearchError />
  if (loading) return <ContentLoading type="SearchProductGrid" />
  if (!hasResults) return <SearchNoResults />

  return (
    <Container backgroundColor={theme.borderColor} flexGrow={1}>
      <Container flex={1}>
        <FlatList
          data={hits}
          numColumns={isTablet() ? 3 : 2}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.01}
          onEndReached={onEndReached}
          renderItem={renderItem}
          ListFooterComponent={<ListFooterLoadingIndicator active={hasMore} />}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </Container>
    </Container>
  )
}
export default SearchArticlesHits
