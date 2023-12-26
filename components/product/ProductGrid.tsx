import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, View } from 'react-native'
import { isTablet } from '../../utils/device'
import { isValidArray } from '../../utils/validation'
import ProductListItem from './ProductListItem'
import settings from '../../constants/settings'
import useViewableItems from '../../hooks/useViewableItems'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import theme from '../../constants/theme'
import useViewedItemsTracking from '../../hooks/useViewedItemsTracking'
import branchEvents from '../../services/branch/branchEvents'
import remoteLog from '../../services/remoteLog'

type ProductGridProps = {
  products: []
  styles?: {} | any
  containerStyle?: {} | any
  navigation?: any
  onEndReached?: any
  refreshing?: boolean
  onRefresh?: () => void
  onScroll?: any
  cb?: () => void
  hasReview?: boolean
  quickViewParams?: {} | any
  testID?: any
  hasOffers?: boolean
  initialNumToRender?: number
  itemHeight?: number
  appliedFiltersCount?: number
  appliedSortingOrder?: string
  ListHeaderComponent?: any
  ListFooterComponent?: any
  hasImpressionTracking?: boolean
  isFetchingMore?: boolean
}

const ProductGrid = ({
  products,
  styles,
  containerStyle,
  navigation,
  onEndReached,
  refreshing,
  onRefresh,
  onScroll,
  cb,
  hasReview = false,
  quickViewParams,
  testID,
  hasOffers = false,
  isFetchingMore = false,
  initialNumToRender = 4,
  itemHeight = 305,
  appliedFiltersCount = 0,
  appliedSortingOrder,
  ...props
}: ProductGridProps) => {
  const [sortingOrder, setSortingOrder] = useState<string>()
  const [filtersCount, setFiltersCount] = useState<number | any>()
  const [refresh, setRefresh] = useState(false)
  const scrollRef = useRef<FlatList | any>()

  const {
    handleViewableItemsChanged,
    isItemViewable,
    keyExtractor,
    viewableItemsState,
    viewableItemsDataRef
  } = useViewableItems({
    keyName: 'product_id',
    initialNumToRender
  })

  const handleViewedItemsTrackingChange = async (items: any) => {
    await branchEvents.trackViewProducts(items, {})
  }

  useViewedItemsTracking({
    state: viewableItemsState,
    itemsRef: viewableItemsDataRef,
    onUpdate: handleViewedItemsTrackingChange
  })

  const renderItem = useCallback(
    ({ item, index }) => (
      <ProductListItem
        data={item}
        navigation={navigation}
        cb={cb}
        hasAddToCart
        hasQuickView
        itemHeight={itemHeight}
        hasReview={hasReview}
        quickViewParams={quickViewParams}
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

  const handleFilterChange = () => {
    if (
      !!scrollRef?.current?.scrollToIndex &&
      (appliedFiltersCount !== filtersCount || appliedSortingOrder !== sortingOrder) &&
      isValidArray(products)
    ) {
      setFiltersCount(appliedFiltersCount)
      setRefresh(!refresh)
      setSortingOrder(appliedSortingOrder)
      try {
        scrollRef.current.scrollToIndex({ index: 0 })
      } catch (error) {
        console.warn('125', '', 'handleFilterChange', error)
        remoteLog.logError(`ProductGrid`, { message: error })
      }
    }
  }

  useEffect(handleFilterChange, [appliedFiltersCount, appliedSortingOrder, sortingOrder, products])

  if (!isValidArray(products)) return null

  return (
    <View style={[styles, { backgroundColor: theme.borderColor }, containerStyle]}>
      <FlatList
        ref={scrollRef}
        testID={testID}
        data={products}
        numColumns={isTablet() ? 3 : 2}
        windowSize={4}
        onScroll={onScroll}
        keyExtractor={keyExtractor}
        initialNumToRender={initialNumToRender}
        maxToRenderPerBatch={6}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        refreshing={refreshing}
        getItemLayout={getItemLayout}
        onRefresh={onRefresh}
        viewabilityConfig={settings.viewConfigRef}
        onViewableItemsChanged={handleViewableItemsChanged}
        renderItem={renderItem}
        ListFooterComponent={<ListFooterLoadingIndicator active={isFetchingMore} />}
        contentContainerStyle={{ paddingBottom: hasOffers ? 45 : 0 }}
        {...props}
      />
    </View>
  )
}

export default ProductGrid
