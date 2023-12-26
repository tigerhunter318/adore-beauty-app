import { ApolloClient, ApolloLink, defaultDataIdFromObject, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getIn } from '../../utils/getIn'
import { objectHasKey } from '../../utils/object'
import remoteLog from '../remoteLog'

let _apolloClientInstance = null

export const apolloClient = () => _apolloClientInstance

export const graphQuery = options => _apolloClientInstance.query(options)

export const apolloErrorLogLink = onError(({ graphQLErrors, networkError, operation, response }) => {
  const { operationName, query, variables } = operation || {}
  remoteLog.addBreadcrumb({ category: 'graphql', message: 'response', data: { json: JSON.stringify(response) } })
  remoteLog.addBreadcrumb({
    category: 'graphql',
    message: 'query',
    data: {
      _name: operationName,
      _variables: variables,
      body: remoteLog.formatString(query?.loc?.source?.body || {})
    }
  })

  if (graphQLErrors) {
    graphQLErrors.forEach(error => {
      const { message, locations, path } = error
      console.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      remoteLog.addBreadcrumb({
        category: 'graphql',
        message: 'error',
        data: error
      })
      remoteLog.logError(`GraphQLError-${operationName}`, { message })
    })
  }
  if (networkError) {
    console.warn(`[Network error]: ${networkError}`)
    remoteLog.addBreadcrumb({
      category: 'graphql',
      message: 'error',
      data: { json: JSON.stringify(networkError) }
    })
    remoteLog.logError(`GraphQLNetworkError-${operationName}`, { message: networkError })
  }
})

/**
 * https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic
 *
 * createApolloLinkMiddleware({'authorization' : 'testx1'})
 *
 * @param customHeaders
 * @returns {ApolloLink}
 */
export const createApolloLinkMiddleware = (customHeaders = {}) => {
  const middleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...customHeaders
      }
    }))

    return forward(operation)
  })

  return middleware
}

export const createApolloClient = (options = {}) => {
  const cache = new InMemoryCache({
    dataIdFromObject(responseObject, context) {
      const customCacheKey = Object.keys(responseObject).find(name => name.startsWith('__cache_as_'))
      if (customCacheKey) {
        return `${customCacheKey.replace('__cache_as_', '')}:${responseObject.id}`
      }

      if (responseObject.__typename === 'richContentPost') {
        return `richContentPost:${responseObject.sysId}`
      }
      if (responseObject.__typename === 'contentfulQuery') {
        let contentfulCollection = ''
        if (objectHasKey(responseObject, 'adoreBeautyCategoriesCollection')) {
          contentfulCollection = 'adoreBeautyCategoriesCollection'
        }
        if (objectHasKey(responseObject, 'adoreBeautyBrandsCollection')) {
          contentfulCollection = 'adoreBeautyBrandsCollection'
        }
        if (contentfulCollection) {
          return `${contentfulCollection}:${getIn(responseObject, `${contentfulCollection}.items.0.sys.id`)}`
        }
      }

      return defaultDataIdFromObject(responseObject)
    }
  })

  const createOptions = {
    // link, //link should be provided in options
    cache,
    ...options
  }
  _apolloClientInstance = new ApolloClient(createOptions)
  return _apolloClientInstance
}
