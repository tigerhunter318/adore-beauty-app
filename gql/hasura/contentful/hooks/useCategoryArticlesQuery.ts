import { useState } from 'react'
import { getIn } from '../../../../utils/getIn'
import { isValidArray } from '../../../../utils/validation'
import useHasuraQuery from '../../utils/useHasuraQuery'
import CategoryArticlesQuery from '../../contentful/CategoryArticlesQuery'
import { formatContentfulData } from '../utils/formatContentfulData'

type useCategoryArticlesQueryProps = {
  articlesQueryConditions: any
  skip: boolean
  limit?: number
}

type CategoryArticlesQueryResult = {
  complete: boolean
  hasMore: boolean
  articles: any[]
  onEndReached?: () => void
  loading: boolean
  error
}

const useCategoryArticlesQuery = ({
  articlesQueryConditions,
  skip = true,
  limit = 20
}: useCategoryArticlesQueryProps): CategoryArticlesQueryResult => {
  const [page, setPage] = useState(0)
  const offset = (page + 1) * limit
  const { data, loading, fetchMore, error } = useHasuraQuery(CategoryArticlesQuery, {
    variables: { ...articlesQueryConditions, limit },
    skip
  })

  const collection = articlesQueryConditions?.skipBrands
    ? `adoreBeautyCategoriesCollection`
    : `adoreBeautyBrandsCollection`
  const path = `contentful.${collection}.items.0.linkedFrom.simpleBlogPostCollection`

  const getItems = itemsData => getIn(itemsData, `${path}.items`) || []

  const total = getIn(data, `${path}.total`)
  const fetchedItems = getItems(data) || []
  const hasMore = loading || (total && isValidArray(fetchedItems) && total > fetchedItems.length)

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    const items = [...getItems(prev), ...getItems(fetchMoreResult)]

    return {
      ...prev,
      contentful: {
        __typename: prev.contentful.__typename,
        [collection]: {
          __typename: getIn(prev, `contentful.${collection}.__typename`),
          items: [
            {
              __typename: getIn(prev, `contentful.${collection}.items.0.__typename`),
              sys: {
                __typename: getIn(prev, `contentful.${collection}.items.0.sys.__typename`),
                id: getIn(prev, `contentful.${collection}.items.0.sys.id`)
              },
              linkedFrom: {
                __typename: getIn(prev, `contentful.${collection}.items.0.linkedFrom.__typename`),
                simpleBlogPostCollection: {
                  __typename: getIn(prev, `${path}.__typename`),
                  total,
                  items
                }
              }
            }
          ]
        }
      }
    }
  }

  const onEndReached = () => {
    fetchMore({
      variables: { skip: offset },
      updateQuery
    })

    setPage(prev => prev + 1)
  }

  return {
    ...formatContentfulData(getIn(data, path)),
    hasMore,
    loading,
    error,
    onEndReached,
    complete: !!data && !loading && !error
  }
}

export default useCategoryArticlesQuery
