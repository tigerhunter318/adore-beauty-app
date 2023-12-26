import { useNavigation } from '@react-navigation/core'
import { NavigationContainerRef } from '@react-navigation/native'
import { formatContentPath, formatPageIdentifier, formatPagePath, parseQueryString } from '../../utils/format'
import screenRoutes, { rewriteScreenPath } from './routes'
import linkTo from './linkTo'
import logInfo from '../../utils/logInfo'
import getPathFromState from './utils/getPathFromState'

type ScreenRouteType = {
  pattern: string
  key: string
  param: string
  screen: string
}

const matchScreenRoute = (uri: string, stripQueryString = true): ScreenRouteType =>
  screenRoutes
    .getRoutes()
    .find(item => item.pattern && new RegExp(item.pattern, 'i').test(formatPagePath(uri, stripQueryString)))

type resetDefaultType = {
  isDeepLink?: boolean
  showLoader?: boolean
  triggerFetch?: boolean
}

const resetDefaultScreenParams = (params: resetDefaultType) => {
  const result = {
    ...params // as any additional params from query string
  }
  delete result.isDeepLink
  delete result.showLoader
  delete result.triggerFetch
  return result
}

const matchUrl = (uri: string) => {
  let match = matchScreenRoute(uri, false)
  if (!match) {
    match = matchScreenRoute(uri, true)
  }

  if (match) {
    const urlPath = formatPagePath(uri, false)
    const url = formatContentPath(urlPath)
    let { screen, key, param, pattern } = match

    const result: { [key: string]: string } = {
      url,
      fullPath: formatPagePath(url, false),
      path: formatPagePath(url, true),
      pageIdentifier: formatPageIdentifier(url, true),
      pathIdentifier: formatPageIdentifier(url, false)
    }
    const queryStringParams = parseQueryString(uri) || {}
    delete queryStringParams.app
    // replace screen with appScreenPath
    if (queryStringParams.appScreenPath) {
      screen = queryStringParams.appScreenPath as string
      delete queryStringParams.appScreenPath
    }

    const params = resetDefaultScreenParams(queryStringParams)
    if (result[key]) {
      // @ts-ignore
      params[param || key] = result[key] // add only matched key
    }
    return {
      screen,
      params,
      fullPath: result.fullPath
    }
  }
}

/**
 * //TODOs
 * - merge screenRoutes with Firebase config
 * - merge defaultRouteParams with Firebase config
 * - check other urls new-arrivals.html, shipping.html and skinceuticals-giveaway.html
 *
 * @param options
 * @returns {{navigate: (function(*=, *=): *), matchUrl: ((function(*): ({screen: *, params: *}|undefined))|*)}}
 */
type screenRouterOptions = {
  navigation?: NavigationContainerRef
}

const screenRouter = (options: screenRouterOptions = {}) => {
  const { navigation } = options
  const navigateUrl = (url: string, routeParams = {}) => {
    const result = matchUrl(url)
    if (result?.screen) {
      const { screen: screenPath, params, fullPath } = result
      return navigateScreen(screenPath, { ...routeParams, ...params, fullPath })
    }
  }
  const navigateScreen = (screenPath: string, routeParams: any = {}, actionType?: string) => {
    if (screenPath && navigation) {
      const fromScreenPath = getCurrentScreenPath()

      let params = { ...routeParams }
      let resetToMainTab = screenPath.includes('MainTab')

      if (getTargetScreenName(fromScreenPath) === getTargetScreenName(screenPath)) {
        resetToMainTab = true
      } else {
        params = { fromScreenPath, ...routeParams }
      }
      let preventPush = false
      try {
        const previousScreenFromPath = `${parseQueryString(decodeURIComponent(fromScreenPath).replace('?screen=', '/'))
          ?.fromScreenPath || ''}`
        preventPush = previousScreenFromPath.includes(screenPath)
      } catch (error) {
        //
      }

      let type = 'NAVIGATE'
      if (routeParams.isDeepLink && resetToMainTab) {
        navigation.navigate('MainTab') /* reset to main tab to avoid initial params issues */
      } else if (resetToMainTab && !preventPush) {
        type = actionType ?? 'PUSH'
      }

      logInfo('green', `screenRouter linkTo [${screenPath}]`, params)
      const link = linkTo({ screenPath: rewriteScreenPath(screenPath), navigation, params, type })
      return link
    }
  }

  const getRootNavigation = () => {
    let root = navigation
    if (root) {
      let current
      /*eslint-disable*/
      // Traverse up to get the root navigation
      // @ts-ignore
      while ((current = root.dangerouslyGetParent()))
      {// @ts-ignore
        root = current
      }
      /* eslint-enable */
      return root
    }
  }

  const getCurrentScreenPath = () => {
    const root = getRootNavigation()
    const path = root ? getPathFromState(root.dangerouslyGetState()) : ''
    if (path === '/MainDrawer/Main/MainTab/Shop') {
      return `${path}/Shop` // get path to Shop screen, not Shop stack
    }
    return path
  }
  const getTargetScreenName = (path: string) => path.replace(/(.*\/)*/, '').replace(/\?.*$/, '')

  return {
    navigateUrl,
    matchUrl,
    getCurrentScreenPath,
    // push a string path and params to navigation
    push: (screenPath: string, params?: any) => linkTo({ navigation, screenPath, params, type: 'PUSH' }),
    // navigate a string path and add params
    navigate: (screenPath: string, params?: any) => linkTo({ navigation, screenPath, params }),
    // navigate to a screen path and add fromScreenPath param
    navigateScreen
  }
}

export const isBeautyIQUrl = (url: string) => screenRouter().matchUrl(url)?.screen === 'PostScreen'

export const withScreenRouter = (navigation: any) => screenRouter({ navigation })

export const useScreenRouter = () => {
  const navigation = useNavigation<any>()
  return screenRouter({ navigation })
}
export default screenRouter
