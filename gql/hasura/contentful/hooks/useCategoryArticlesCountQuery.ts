import { getIn } from '../../../../utils/getIn'
import CategoryArticlesQuery from '../CategoryArticlesQuery'
import useHasuraQuery from '../../utils/useHasuraQuery'

const useCategoryArticlesCountQuery = ({
  articlesQueryConditions,
  isBrandScreen,
  skip = true
}: {
  articlesQueryConditions: any
  isBrandScreen: boolean
  skip: boolean
}) => {
  const collection = `adoreBeauty${isBrandScreen ? 'Brands' : 'Categories'}Collection`

  const { data, loading } = useHasuraQuery(CategoryArticlesQuery, {
    variables: { ...articlesQueryConditions, limit: 0 },
    skip
  })

  return {
    articlesResultCount: getIn(data, `contentful.${collection}.items.0.linkedFrom.simpleBlogPostCollection.total`),
    loading
  }
}

export default useCategoryArticlesCountQuery
