import React, { useCallback } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import ReviewListViewItemHeader from './ReviewListItemHeader'
import ReviewListItem from './ReviewListItem'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import useScreenQuery from '../../gql/useScreenQuery'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import ProductReviewsAggregateQuery from '../../gql/hasura/reviews/ProductReviewsAggregateQuery'
import { formatReviewsData } from '../../gql/hasura/reviews/utils/formatReviewsData'
import { formatProductUrlPath } from '../../utils/format'
import useQueryPagination from '../../gql/hasura/utils/useQueryPagination'
import settings from '../../constants/settings'
import ProductReviewsQuery from '../../gql/hasura/reviews/ProductReviewsQuery'

const styles = StyleSheet.create({
  itemSeparator: {
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: theme.darkGray,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  }
})

const ItemSeparatorComponent = () => <Container style={styles.itemSeparator} />

const ReviewListView = ({ productUrl }: { productUrl: string }) => {
  const variables = {
    conditions: {
      metadata: {
        url_path: { _eq: formatProductUrlPath(productUrl) }
      }
    }
  }
  const {
    data: reviews,
    onEndReached,
    refreshing,
    refreshControl,
    hasNextPage,
    handleRefresh,
    initialComponent
  } = useQueryPagination(ProductReviewsQuery, {
    variables,
    target: 'reviews',
    skip: !variables,
    formatResponse: response => response?.reviews,
    hasMoreResults: (fetchMoreResult, { limit }) => fetchMoreResult?.reviews?.length === limit
  })

  const { data: reviewsAggregateData, initialComponent: initialAggregatesComponent } = useScreenQuery(
    ProductReviewsAggregateQuery,
    {
      variables,
      useQueryHook: useHasuraQuery,
      formatResponse: response => ({
        ...formatReviewsData(response),
        mostRecentPositive: response?.most_recent_positive?.[0],
        mostRecentCriticism: response?.most_recent_criticism?.[0]
      })
    }
  )

  const renderReview = useCallback(({ item }) => <ReviewListItem item={item} />, [])

  const keyExtractor = useCallback(item => item?.id, [])

  if (initialComponent || initialAggregatesComponent) {
    return initialComponent || initialAggregatesComponent
  }

  return (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      refreshControl={refreshControl}
      initialNumToRender={4}
      ListHeaderComponent={<ReviewListViewItemHeader {...reviewsAggregateData} />}
      ListFooterComponent={<ListFooterLoadingIndicator active={hasNextPage} />}
      onEndReachedThreshold={0.1}
      onEndReached={() => onEndReached(reviews)}
      viewabilityConfig={settings.viewConfigRef}
      ItemSeparatorComponent={() => <ItemSeparatorComponent />}
      contentContainerStyle={{ paddingBottom: 30 }}
      removeClippedSubviews
    />
  )
}

export default ReviewListView
