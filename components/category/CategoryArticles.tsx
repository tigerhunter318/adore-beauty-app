import React, { useCallback } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack/src/types'
import { isValidObject } from '../../utils/validation'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import ProductTitle from '../product/ProductTitle'
import theme from '../../constants/theme'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import ImageSize from '../../constants/ImageSize'
import useCategoryArticlesQuery from '../../gql/hasura/contentful/hooks/useCategoryArticlesQuery'
import ContentLoading from '../ui/ContentLoading'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.borderColor,
    marginBottom: 110
  },
  articleContainer: {
    width: '50%',
    padding: 0.5
  },
  innerArticleContainer: {
    height: 275,
    padding: 15,
    backgroundColor: 'white'
  },
  titleContainer: {
    paddingTop: 10
  }
})

type CategoryArticleContentProps = {
  image: string
  title: string
  onArticlePress: () => void
}

const CategoryArticleContent = ({ image, title, onArticlePress }: CategoryArticleContentProps) => {
  const { width, height } = ImageSize.article.thumbnail

  return (
    <Container onPress={onArticlePress}>
      <ResponsiveImage src={image} width={width} height={height} useAspectRatio />
      <Container style={styles.titleContainer}>
        <ProductTitle name={title} />
      </Container>
    </Container>
  )
}

const CategoryArticle = ({ item }: any) => {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { title, image, sysId } = item || {}

  const handleArticlePress = () => navigation.push('PostScreen', { sysId })

  return (
    <Container style={styles.articleContainer}>
      <Container activeOpacity={0.8} style={styles.innerArticleContainer}>
        {isValidObject(item) && (
          <CategoryArticleContent image={image} title={title} onArticlePress={handleArticlePress} />
        )}
      </Container>
    </Container>
  )
}

type CategoryArticlesProps = {
  articlesQueryConditions: any
  onScroll: () => void
  skip: boolean
}

const CategoryArticles = ({ articlesQueryConditions, skip, onScroll }: CategoryArticlesProps) => {
  const { articles, hasMore, onEndReached, complete, loading } = useCategoryArticlesQuery({
    articlesQueryConditions,
    skip
  })
  const renderItem = useCallback(({ item }) => <CategoryArticle item={item} />, [])

  const keyExtractor = useCallback((item, i) => `${item?.sysId}-${i}`, [])

  if (loading || !complete) return <ContentLoading type="ArticlesGrid" animate={loading} />

  if (!articles) return null

  return (
    <Container style={styles.container}>
      <FlatList
        data={articles}
        numColumns={2}
        onScroll={onScroll}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        ListFooterComponent={<ListFooterLoadingIndicator active={hasMore} />}
        onEndReachedThreshold={0.01}
        renderItem={renderItem}
      />
    </Container>
  )
}

export default CategoryArticles
