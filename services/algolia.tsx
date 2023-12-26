import algoliasearch from 'algoliasearch/lite'
import { sha256 } from 'js-sha256'
import AlgoliaAnalytics from 'search-insights/lib/insights'
import envConfig from '../config/envConfig'
import { generateUserToken, getUserToken } from '../utils/userToken'

let _algoliaClient: any = null
const algoliaClient = () => _algoliaClient

export const createAlgoliaClient = () => {
  generateUserToken()
  _algoliaClient = algoliasearch(envConfig.algolia.appId, envConfig.algolia.apiKey)
  insights.init({
    appId: envConfig.algolia.appId,
    apiKey: envConfig.algolia.apiKey
  })
  return _algoliaClient
}

const searchClient: any = {
  search(requests: any[]) {
    if (requests.every(({ params }) => !params.query || params.query.length < 1)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0
        }))
      })
    }
    return algoliaClient().search(requests)
  }
}

export const insights = new AlgoliaAnalytics({
  requestFn(url, data) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
})

const fetchUserToken = async (account: any) => {
  if (account && account.id) {
    return sha256(account.email)
  }

  const result = await getUserToken()
  return result
}

const clickArticle = async (account: any, data: { objectID: any; __queryID: any; __position: any }) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.articlesIndex,
    eventName: 'Click article',
    objectIDs: [data.objectID],
    queryID: data.__queryID,
    positions: [data.__position],
    userToken
  }

  insights.clickedObjectIDsAfterSearch(eventData)
}

const clickFilter = async (account: any, attribute: any, label: any) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.categoryIndex,
    eventName: 'Click filter',
    filters: [`${attribute}:${label}`],
    userToken
  }

  insights.clickedFilters(eventData)
}

const getProductId = (productData: { parent_product_id: any; product_id: any }) =>
  productData?.parent_product_id || productData?.product_id

const clickProduct = async (account: any, data: any) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.productIndex,
    eventName: 'Click product',
    objectIDs: [getProductId(data)],
    queryID: data.__queryID,
    positions: [data.__position],
    userToken
  }

  insights.clickedObjectIDsAfterSearch(eventData)
}

const clickSuggestion = async (account: any, data: { objectID: any; __queryID: any; __position: any }) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.suggestionIndex,
    eventName: 'Click suggestion',
    objectIDs: [data.objectID],
    queryID: data.__queryID,
    positions: [data.__position],
    userToken
  }

  insights.clickedObjectIDsAfterSearch(eventData)
}

const clickProductQuickView = async (account: any, data: any) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.productIndex,
    eventName: 'Product Quick Viewed',
    objectIDs: [getProductId(data)],
    queryID: data.__queryID,
    positions: [data.__position],
    userToken
  }

  insights.clickedObjectIDsAfterSearch(eventData)
}

const addProductToCart = async (account: any, data: { objectId: any; queryId: any }) => {
  const userToken = await fetchUserToken(account)
  const eventData = {
    index: envConfig.algolia.productIndex,
    eventName: 'Add Product to Cart',
    objectIDs: [data.objectId],
    queryID: data.queryId,
    userToken
  }

  insights.convertedObjectIDsAfterSearch(eventData)
}

const addProductToFavorite = async (account: any, data: any) => {
  const userToken = await fetchUserToken(account)

  let productId = getProductId(data)

  if (envConfig.algoliaConfigName !== 'production' && data.childProductId) {
    productId = data.childProductId
  }

  const eventData = {
    index: envConfig.algolia.productIndex,
    eventName: 'Add Product to Favorite',
    objectIDs: [productId],
    queryID: data.queryId,
    userToken
  }

  insights.convertedObjectIDsAfterSearch(eventData)
}

export default searchClient

export const algoliaInsights = {
  clickProduct,
  clickFilter,
  clickArticle,
  clickSuggestion,
  clickProductQuickView,
  addProductToCart,
  addProductToFavorite,
  getProductId
}
