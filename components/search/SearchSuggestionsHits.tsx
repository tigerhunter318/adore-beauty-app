import React, { memo, useCallback } from 'react'
import { FlatList, Keyboard, ScrollViewProps, StyleSheet } from 'react-native'
import { UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { useNavigation } from '@react-navigation/native'
import { BaseHit, Hit } from 'instantsearch.js'
import { algoliaInsights } from '../../services/algolia'
import { useActionState } from '../../store/utils/stateHook'
import { isValidArray } from '../../utils/validation'
import { useRecentSearchTerms } from './hooks/useRecentSearchTerms'
import { useInfiniteHitsResults } from './hooks'
import { capitalize } from '../../utils/case'
import { objectCompareValues } from '../../utils/object'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import SearchSuggestionsHitsHighlightItem from './SearchSuggestionsHitsHighlightItem'
import SearchSuggestionsProductsCarousel from './SearchSuggestionsProductsCarousel'
import settings from '../../constants/settings'
import useSearchRecommendedProducts from './hooks/useSearchRecommendedProducts'
import Icon from '../ui/Icon'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import useLuxuryBrands from '../../gql/hasura/brands/hooks/useLuxuryBrands'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const styles = StyleSheet.create({
  clearButtonContainer: {
    flexDirection: 'row',
    backgroundColor: theme.lightGrey,
    position: 'absolute',
    right: 20,
    top: 20,
    paddingVertical: 5,
    paddingHorizontal: 10
  }
})

const SuggestionsListHeader = ({ loading, hits }: { loading: boolean; hits: Hit<BaseHit>[] }) => (
  <Container>
    {!loading ? (
      <Container mt={isValidArray(hits) ? 0.5 : 0}>
        <Type bold size={13} pt={2} pb={1} ph={2} letterSpacing={0.5}>
          Suggestions
        </Type>
        {!isValidArray(hits) && (
          <Type color={theme.lightBlack} size={13} mt={1} ph={2}>
            no results found
          </Type>
        )}
      </Container>
    ) : null}
  </Container>
)

const RecentSearchesListHeader = ({
  resetRecentSearchTerms,
  recentSearchTerms
}: {
  resetRecentSearchTerms: () => void
  recentSearchTerms: []
}) => (
  <Container>
    {isValidArray(recentSearchTerms) && (
      <Container>
        <Type bold size={13} pt={2.5} pb={1} ph={2} letterSpacing={0.5}>
          Recent Searches
        </Type>
        <Container style={styles.clearButtonContainer} onPress={resetRecentSearchTerms}>
          <Icon name="close" size={15} type="material" />
          <Type heading semiBold size={12} pl={0.3} letterSpacing={0.5}>
            clear
          </Type>
        </Container>
      </Container>
    )}
  </Container>
)
type SearchSuggestionsHitListItemProps = {
  isSuggestion: boolean
  item?: any
  query?: string
  onItemPress?: any
  index?: number
  onRemovePress?: any
}

const SearchSuggestionsHitListItem = ({
  isSuggestion,
  item,
  query,
  onItemPress,
  index,
  onRemovePress
}: SearchSuggestionsHitListItemProps) => (
  <Container testID="SearchSuggestionsHits.Item" key={`SearchSuggestionsHits.Item.${index}`}>
    {isSuggestion ? (
      <Container pv={1} ph={2} onPress={() => onItemPress(item)}>
        <SearchSuggestionsHitsHighlightItem highlightResult={item._highlightResult} />
      </Container>
    ) : (
      <Container ph={2} rows justify="space-between" align>
        <Container pv={1} onPress={() => onItemPress(item)} style={{ width: '90%' }}>
          <Type size={13} color={theme.lightBlack} numberOfLines={1}>
            {capitalize(query)}
          </Type>
        </Container>
        <Container
          width={35}
          height={35}
          pl={2}
          onPress={() => onRemovePress(item)}
          justify
          style={{ position: 'absolute', right: 6, justifyContent: 'center' }}
        >
          <Icon style={[{ right: 10 }]} color={theme.black} name="close" type="material" size={18} />
        </Container>
      </Container>
    )}
  </Container>
)

const SearchSuggestionsHitListItemMemo = memo(
  SearchSuggestionsHitListItem,
  (prevProps: SearchSuggestionsHitListItemProps, nextProps: SearchSuggestionsHitListItemProps) => {
    if (nextProps.isSuggestion) {
      return objectCompareValues(prevProps, nextProps, ['query', 'searchQuery', 'item._highlightResult.query.value'])
    }
    return objectCompareValues(prevProps, nextProps, ['query', 'searchQuery'])
  }
)
type SearchSuggestionsHitsProps = ScrollViewProps & UseInfiniteHitsProps<BaseHit> & { query: string | undefined }

const SearchSuggestionsHits = (props: SearchSuggestionsHitsProps) => {
  const navigation = useNavigation()
  const urlNavigation = useUrlNavigation()
  const account = useActionState('customer.account')
  const { loading, hits, showMore, isLastPage } = useInfiniteHitsResults(props)
  const { query } = props
  const {
    recentSearchTerms,
    addRecentSearchTerm,
    resetRecentSearchTerms,
    removeRecentSearchTerm
  } = useRecentSearchTerms()
  const { findLuxuryBrandUrl } = useLuxuryBrands()
  const { recentProducts, recommendedProducts, trackRecommendationClick } = useSearchRecommendedProducts()

  const hasMore: boolean = !isLastPage

  const onEndReached = () => hasMore && showMore()

  const handleSuggestionPress = (item: any) => {
    Keyboard.dismiss()
    if (query) {
      algoliaInsights.clickSuggestion(account, item)
      addRecentSearchTerm(item.query)
    }
    const text = item.query || item

    const luxuryBrandUrl = findLuxuryBrandUrl(text)

    if (luxuryBrandUrl) {
      return urlNavigation.navigate(luxuryBrandUrl, { name: text })
    }

    navigation.navigate('SearchResults', { q: text })
  }

  const hasSuggestions: boolean = !!query && !loading

  const keyExtractor = useCallback((item: any, index) => item.query || index, [])

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <SearchSuggestionsHitListItemMemo
      item={item}
      index={index}
      isSuggestion={hasSuggestions}
      onItemPress={handleSuggestionPress}
      onRemovePress={removeRecentSearchTerm}
      query={typeof item === 'string' ? item : item?.query}
    />
  )

  return (
    <FlatList
      data={hasSuggestions ? hits : recentSearchTerms}
      testID="SearchSuggestionsHits"
      renderItem={renderItem}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      initialNumToRender={20}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.1}
      onEndReached={onEndReached}
      viewabilityConfig={settings.viewConfigRef}
      ListHeaderComponent={
        <>
          <SearchSuggestionsProductsCarousel
            recommendedProducts={recommendedProducts}
            recentProducts={recentProducts}
            query={hasSuggestions ? query : undefined}
            trackRecommendationClick={trackRecommendationClick}
          />
          {hasSuggestions ? (
            <SuggestionsListHeader loading={!!loading} hits={hits} />
          ) : (
            <RecentSearchesListHeader
              resetRecentSearchTerms={resetRecentSearchTerms}
              recentSearchTerms={recentSearchTerms}
            />
          )}
        </>
      }
      ListFooterComponent={<ListFooterLoadingIndicator active={!!(hasMore && query)} />}
      contentContainerStyle={{ paddingBottom: 30 }}
      {...props}
    />
  )
}
export default memo(SearchSuggestionsHits)
