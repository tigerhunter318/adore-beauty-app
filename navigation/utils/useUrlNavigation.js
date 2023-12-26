import { useNavigation } from '@react-navigation/native'
import resolveUrlToContent from './resolveUrlToContent'
import { formatExternalUrl } from '../../utils/format'
import openInAppBrowser from '../../utils/openInAppBrowser'
import { isAppBrowserUrl, isExternalBrowserUrl } from '../../utils/validation'
import { openExternalUrl } from '../../utils/openExternalUrl'
import screenRouter from '../router/screenRouter'

export const navigateUrlToScreen = async (navigation, url, method = 'navigate', params = {}) => {
  if (isExternalBrowserUrl(url) || isAppBrowserUrl(url)) {
    let result
    if (isAppBrowserUrl(url)) {
      result = await openInAppBrowser(formatExternalUrl(url))
    } else {
      result = await openExternalUrl(url)
    }
    return !!result
  }

  // if (params?.isDeepLink) {
  // navigation.navigate('MainTab') // reset navigation stack
  // }

  const { matchUrl, navigateScreen, navigateUrl } = screenRouter({ navigation })

  if (matchUrl(url)) {
    // url matches a pattern
    return navigateUrl(url, params)
  }

  if (params?.showLoader) {
    // navigation.navigate('DeeplinkLoader') // only show loader if a lookup query is required
  }

  let content = params?.content

  try {
    // unknown url pattern, look up content type using query
    content = await resolveUrlToContent(url)
  } catch (error) {
    console.warn('navigateToPageType', 'url not resolved', url)
  }

  if (content) {
    const { ...routeParams } = params || {}
    if (content.type === 'product') {
      return navigateScreen('ProductStack/Product', {
        ...routeParams,
        url: content.url,
        product_id: content.product_id,
        identifier: content.identifier,
        productSku: content.productSku,
        is_consent_needed: content.is_consent_needed
      })
    }
    if (content.type === 'article' && (content?.url || content?.url_path)) {
      return navigateScreen('PostScreen', {
        ...routeParams,
        url: content.url,
        url_path: content.url_path,
        sysId: content.sysId
      })
    }
    if (content.type === 'category') {
      return navigateScreen('MainTab/Shop/ShopCategoryProducts', { ...routeParams, url: content?.url })
    }
    if (content.type === 'cms') {
      return navigateScreen('CMS', { ...routeParams, ...content })
    }
  } else {
    // cant use a screen, open in-app-browser
    const result = await openInAppBrowser(formatExternalUrl(url))
    return !!result
  }
  return null
}
/**
 * resolve a url to a content type and navigate to the correct screen
 * //product
 * await urlNavigation.push("https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html")
 * // beautyiq
 * await urlNavigation.push("https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/")
 * // category
 * await urlNavigation.push("https://adorebeauty.com.au/skin-care/cosmeceuticals/bhas-salicylic-acid.html")
 *
 * //navigate when page type and id is known
 * urlNavigation.push(content.url, {content:{type:'product',identifier:1000}})
 * urlNavigation.push(content.url, {content:{type:'post',sysId:1000}})
 * urlNavigation.push(content.url, {content:{type:'category'}})
 *
 */

const useUrlNavigation = () => {
  const navigation = useNavigation()

  const push = async (url, params = {}) => navigateUrlToScreen(navigation, url, 'push', params)
  const navigate = async (url, params = {}) => navigateUrlToScreen(navigation, url, 'navigate', params)
  const replace = async (url, params = {}) => navigateUrlToScreen(navigation, url, 'replace', params)

  return {
    push,
    navigate,
    replace
  }
}

export default useUrlNavigation
