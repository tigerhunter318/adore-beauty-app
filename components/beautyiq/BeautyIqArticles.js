import React, { useState } from 'react'
import { FlatList } from 'react-native'
import Container from '../ui/Container'
import Loading from '../ui/Loading'
import ArticleCard from '../article/ArticleCard'
import useRefreshControl from '../../hooks/useRefreshControl'
import { isValidArray } from '../../utils/validation'

const filterDuplicates = allArticles =>
  allArticles.filter((item, index) => allArticles.findIndex(item2 => item.sysId === item2.sysId) === index)

const BeautyIqArticles = ({
  articles,
  onItemPress,
  header,
  noResults,
  footer,
  onFetchMore = null,
  noTopPadding = false,
  refetch = null,
  ...props
}) => {
  const { handleRefresh, refreshing } = useRefreshControl(refetch)

  const renderItem = ({ item, index }) => (
    <ArticleCard
      {...item}
      image={item.fb_image}
      key={`article-${index}`}
      onItemPress={onItemPress}
      containerProps={{ pb: 2, ph: 2 }}
    />
  )
  const keyExtractor = (item, index) => `article-${index}`
  const onEndReached = () => {
    if (pageNumber === Math.floor(pageNumber)) {
      onFetchMore({
        variables: {
          page: pageNumber + 1
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return {
            ...prev,
            beautyiq: [...prev.beautyiq, ...fetchMoreResult.beautyiq]
          }
        }
      })
    }
  }
  const renderArticles = (item, index) => renderItem({ item, index })
  const pageNumber = isValidArray(articles) ? articles.length / 5 : 0

  const data = filterDuplicates(articles)

  return (
    <Container testID="BeautyIqArticles">
      {articles &&
        !noResults &&
        (onFetchMore ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            ListFooterComponent={!(pageNumber > Math.floor(pageNumber)) && <Loading animating />}
            onEndReachedThreshold={0.02}
            keyExtractor={keyExtractor}
            onEndReached={onEndReached}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            {...props}
          />
        ) : (
          <>
            {header}
            {data.map(renderArticles)}
          </>
        ))}
      {noResults && <Container>{noResults}</Container>}

      {footer}
    </Container>
  )
}

export default BeautyIqArticles
