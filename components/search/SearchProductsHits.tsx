import React, { useCallback, useEffect, useRef } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { UseInfiniteHitsProps } from 'react-instantsearch-hooks'
import { useNavigation } from '@react-navigation/native'
import { Hit } from 'instantsearch.js'
import { isTablet } from '../../utils/device'
import { useInfiniteHitsResults } from './hooks'
import { isValidArray } from '../../utils/validation'
import { useSearchCurrentOffers } from './hooks/useSearchCurrentoffers'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import settings from '../../constants/settings'
import ProductCard from '../algolia/ProductCard'
import useScrollDirection from '../../hooks/useScrollDirection'
import useViewableItems from '../../hooks/useViewableItems'
import SearchNoResults from './SearchNoResults'
import ContentLoading from '../ui/ContentLoading'
import SearchError from './SearchError'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import SearchCurrentOffers from './SearchCurrentOffers'
import useConsentForm from '../../hooks/useConsentForm'

type SearchProductsHitsProps = UseInfiniteHitsProps & {
  itemHeight?: number
  onCountChange: any
  isVisible?: boolean
}

const SearchProductsHits = ({ itemHeight = 305, onCountChange, isVisible, ...props }: SearchProductsHitsProps) => {
  const navigation = useNavigation()
  const { handleScroll, direction } = useScrollDirection()
  const { handleViewableItemsChanged, isItemViewable, keyExtractor } = useViewableItems({
    keyName: 'product_id',
    initialNumToRender: 6
  })
  const { error, loading, hasResults, hits, isLastPage, showMore, results, nbHits } = useInfiniteHitsResults(props)
  const listRef = useRef<FlatList>(null)
  const hasMore: boolean = !isLastPage
  const { offers, headerHeight: offerHeaderHeight } = useSearchCurrentOffers(hits)
  const isConsentRequired = !!hits?.slice(0, 20)?.find((hit: any) => hit?.categories?.toLowerCase()?.includes('sex'))
  const consentForm = useConsentForm(isConsentRequired)

  const onEndReached = () => hasMore && showMore()

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Hit>) => (
      <ProductCard
        data={item}
        index={index}
        itemHeight={itemHeight}
        navigation={navigation}
        isContentVisible={isItemViewable(item, index)}
      />
    ),
    []
  )

  const getItemLayout = useCallback(
    (_, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index
    }),
    []
  )

  const handleScrollToTop = () => {
    listRef.current?.scrollToOffset({ animated: true, offset: 0 })
  }

  const handleProductsCount = () => {
    onCountChange({ products: { nbHits, loading } })
  }

  useEffect(handleProductsCount, [nbHits, loading])
  useEffect(handleScrollToTop, [results?.nbHits, results?.index])

  if (consentForm) return consentForm
  if (!isVisible) return null
  if (error) return <SearchError />
  if (loading) return <ContentLoading type="SearchProductGrid" />
  if (!hasResults) return <SearchNoResults />
  if (!isValidArray(hits)) return null

  return (
    <Container backgroundColor={theme.borderColor} flexGrow={1}>
      <Container flex={1}>
        <FlatList
          ref={listRef}
          testID="SearchProducts.Hits"
          data={hits}
          numColumns={isTablet() ? 3 : 2}
          windowSize={4}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          onScroll={handleScroll}
          onEndReachedThreshold={0.1}
          onEndReached={onEndReached}
          getItemLayout={getItemLayout}
          viewabilityConfig={settings.viewConfigRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          ListFooterComponent={<ListFooterLoadingIndicator active={hasMore} />}
          contentContainerStyle={{ paddingBottom: isValidArray(offers) ? offerHeaderHeight : 0 }}
        />
      </Container>
      <SearchCurrentOffers hits={hits} hidden={direction === 'down'} />
    </Container>
  )
}
export default SearchProductsHits
