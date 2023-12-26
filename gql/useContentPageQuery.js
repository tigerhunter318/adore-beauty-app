import { useLazyQuery, useQuery } from '@apollo/client'
import { graphQuery } from '../services/apollo/apollo'
import PostQuery, { getPostQueryVariables } from './PostQuery'
import { getProductQueryVariables } from './useProductQuery'
import ProductPageQuery from './ProductPageQuery'
import envConfig from '../config/envConfig'
import PageTypeQuery from './PageTypeQuery'

export const ContentPageType = {
  article: 'article',
  product: 'product',
  category: 'category'
}

const getContentPageQuery = (type, { variables, ...options }) => {
  const { defaultFetchPolicy: fetchPolicy } = envConfig.graphQL
  if (type === ContentPageType.article) {
    // TODO add url_path
    const parsedVariables = getPostQueryVariables(variables)
    return { query: PostQuery, options: { variables: parsedVariables, fetchPolicy, ...options } }
  }
  if (type === ContentPageType.product) {
    const parsedVariables = getProductQueryVariables(variables)
    if (Object.values(parsedVariables).length === 1) {
      options.skip = true
    }
    return { query: ProductPageQuery, options: { variables: parsedVariables, fetchPolicy, ...options } }
  }
  if (type === ContentPageType.category) {
    const parsedVariables = {
      includeProducts: false,
      includeArticles: false,
      url_key: variables.identifier
    }
    return { query: PageTypeQuery, options: { variables: parsedVariables, fetchPolicy, ...options } }
  }
  return {}
}

export const useContentPageLazyQuery = (type, params) => {
  const { query, options } = getContentPageQuery(type, params)
  return useLazyQuery(query, options)
}

export const useContentPageQuery = (type, params) => {
  const { query, options } = getContentPageQuery(type, params)
  return useQuery(query, options)
}

export const fetchContentPageQuery = async (type, params) => {
  const { query, options } = getContentPageQuery(type, params)
  if (!query) {
    return null
  }
  return graphQuery({
    query,
    ...options
  })
}
