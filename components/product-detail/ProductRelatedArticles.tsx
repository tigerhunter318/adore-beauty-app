import React from 'react'
import { StyleSheet } from 'react-native'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import ArticleCardSmall from '../article/ArticleCardSmall'
import SectionTitle from '../ui/SectionTitle'
import ArticleCard from '../article/ArticleCard'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import Hr from '../ui/Hr'
import theme from '../../constants/theme'
import ContentLoading from '../ui/ContentLoading'
import { formatContentfulArticle } from '../../gql/hasura/contentful/utils/formatContentfulData'
import { searchObjectByKey } from '../../utils/searchObject'
import PostCollectionQuery from '../../gql/hasura/contentful/PostCollectionQuery'
import CategoryArticlesQuery from '../../gql/hasura/contentful/CategoryArticlesQuery'

const styles = StyleSheet.create({
  hr: {
    backgroundColor: theme.splitorColor,
    height: 1,
    marginBottom: 30,
    marginTop: 0
  }
})

type ProductRelatedArticlesProps = {
  categoryId: number
  brandId: number
  isLuxuryProduct: boolean
  skip?: boolean
}

const ProductRelatedArticles = ({
  categoryId,
  brandId,
  isLuxuryProduct = false,
  skip: skipQuery = true
}: ProductRelatedArticlesProps) => {
  let articles
  let title = 'related'
  let skip = skipQuery || !brandId

  const { data: brandsData, loading: brandsLoading } = useHasuraQuery(CategoryArticlesQuery, {
    variables: { brandIds: [brandId], skipCategories: true, skip: 0, limit: 3 },
    skip
  })

  articles = searchObjectByKey(brandsData, 'simpleBlogPostCollection')?.items
  skip = isLuxuryProduct || brandsLoading || isValidArray(articles) || !categoryId || skipQuery

  const { data: categoriesData, loading: categoriesLoading } = useHasuraQuery(CategoryArticlesQuery, {
    variables: { categoryIds: [categoryId], skipBrands: true, skip: 0, limit: 3 },
    skip
  })
  articles = isValidArray(articles) ? articles : searchObjectByKey(categoriesData, 'simpleBlogPostCollection')?.items
  skip = skip || categoriesLoading || isValidArray(articles)
  title = skip ? title : 'latest'

  const { data: postsData, loading: postsLoading } = useHasuraQuery(PostCollectionQuery, {
    variables: { limit: 3 },
    skip
  })

  articles = isValidArray(articles) ? articles : searchObjectByKey(postsData, 'simpleBlogPostCollection')?.items

  const loading = brandsLoading || categoriesLoading || postsLoading

  if (loading || skipQuery) {
    return <ContentLoading type="Article" height={300} animate={loading} />
  }
  if (!isValidArray(articles)) {
    return null
  }
  const articlesData = articles.map(item => formatContentfulArticle(item))

  return (
    <Container>
      <Hr style={styles.hr} />
      <SectionTitle text={`${title} `} highlightedText={`${title === 'related' ? 'articles' : 'beauty IQ'}`} />
      <ArticleCard
        {...articlesData[0]}
        image={articlesData[0]?.facebookImage || articlesData[0]?.image}
        key={articlesData[0]?.sysId}
        containerProps={{ pb: 1, ph: 2 }}
        imageHeight={undefined}
      />
      <Container rows ph={1.5} pb={1}>
        {articlesData.slice(1, 3)?.map((article, key) => (
          <ArticleCardSmall key={`ProductRelatedArticles-Article${key}`} {...article} containerProps={{ mr: 0.5 }} />
        ))}
      </Container>
    </Container>
  )
}

export default ProductRelatedArticles
