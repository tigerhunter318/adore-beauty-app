import { formatContentPath, formatPageIdentifier, formatPagePath } from '../../utils/format'
import { apiFetch } from '../../store/api'
import { graphQuery } from '../../services/apollo/apollo'
import { getRemoteConfigItem } from '../../services/useRemoteConfig'
import PageTypeQuery, { parsePageTypeQueryResult } from '../../gql/PageTypeQuery.js'
import { isAppScreenUrl, isValidObject, isValidRichText } from '../../utils/validation'
import logInfo from '../../utils/logInfo'

/**
 * //TODO consider 404s for product + article
 */
const fetchGraphContentFromUrl = async url => {
  const path = formatContentPath(formatPagePath(url, true))
  const identifier = formatPageIdentifier(path, true)
  const pageTypeQueryVariables = { identifier, url: path, url_key: identifier }
  let contentData = null

  // no match found, lookup content type using PageTypeQuery
  contentData = await graphQuery({
    query: PageTypeQuery,
    variables: pageTypeQueryVariables
  })
  return parsePageTypeQueryResult(contentData?.data, path) // return content data or null
}

const fetchJsonCategoryFromUrl = async url => {
  const identifier = formatPageIdentifier(url)
  const response = await apiFetch(`cat?identifier=${identifier}`)
  if (response?.data?.category_info?.id) {
    return {
      type: 'category',
      identifier,
      url,
      data: response?.data?.category_info
    }
  }
}

const fetchJsonProductFromUrl = async url => {
  const identifier = formatPageIdentifier(url, true)
  const response = await apiFetch(`product?identifier=${identifier}`)
  if (response?.data?.productId) {
    const productData = response?.data || {}
    return {
      type: 'product',
      ...productData
    }
  }
}

const fetchJsonCMSFromUrl = async url => {
  const identifier = formatPageIdentifier(url, true)
  const res = await apiFetch(`cms?identifier=${identifier}`)
  const { postContent, content } = res?.data?.articles?.[0] || {}
  const accountReturnsLinkIdentifier = formatPageIdentifier(getRemoteConfigItem('account_returns_link'), true)

  if (
    (!!postContent?.length && isValidRichText(postContent)) ||
    content ||
    (identifier === accountReturnsLinkIdentifier && !!postContent?.length)
  ) {
    return {
      type: 'cms',
      identifier,
      url
    }
  }
}

/*
https://www.adorebeauty.com.au/new-arrivals.html?dir=desc&order=news_from_date
https://www.adorebeauty.com.au/shipping.html
https://www.adorebeauty.com.au/skinceuticals-giveaway.html
 */

export const fetchContentByType = async (url, contentType) => {
  const path = formatPagePath(url, true)
  let result = null
  switch (contentType) {
    case 'graph':
      result = await fetchGraphContentFromUrl(url)
      break
    case 'product':
      result = await fetchJsonProductFromUrl(path)
      break
    case 'category':
      result = await fetchJsonCategoryFromUrl(path)
      break
    case 'cms':
      result = await fetchJsonCMSFromUrl(path)
      break
    default:
      result = null
      break
  }

  return result
}
/**
 * resolve an adore url to graphql/json api content
 *
 * @param url
 * @param contentTypes content types to check in-order
 * @returns {Promise<{identifier: *, data: *, type: string, url: *}|null|{identifier: *, data: null, type: null, url: *}>}
 */
const resolveUrlToContent = async (url, contentTypes = ['graph', 'category', 'cms', 'product']) => {
  const path = formatPagePath(url, true)
  // const queryParams = parseQueryString(url)
  let index = 0
  const next = async () => {
    let result = null
    try {
      result = await fetchContentByType(url, contentTypes[index])
    } catch (error) {
      console.warn('resolveUrlToContent', 'error', error)
      // ignore errors, fixes ABW-2726 issues
    }
    if (result) {
      logInfo('blue', 'resolveUrlToContent', 'found', contentTypes[index], 'content for', url, result)
      return result
    }
    if (index + 1 < contentTypes.length) {
      index += 1
      return next()
    }
  }
  if (isAppScreenUrl(url) && path) {
    const content = await next()
    return content
  }
  return null
}

export default resolveUrlToContent
