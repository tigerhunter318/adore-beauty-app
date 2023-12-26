import remoteConfig from '@react-native-firebase/remote-config'
import { useEffect, useState } from 'react'
import envConfig from '../config/envConfig'

export const getRemoteConfigItem = name =>
  remoteConfig()
    .getValue(name)
    .asString() || null

export const getRemoteConfigNumber = name =>
  remoteConfig()
    .getValue(name)
    .asNumber() || 0

export const getRemoteConfigBoolean = name =>
  remoteConfig()
    .getValue(name)
    .asBoolean() || false

/**
 * get remote config value as json.
 * parse as json or return empty object if invalid json
 * @param name
 * @returns object if valid parses as json or empty object. null if name does not exist
 */
export const getRemoteConfigJson = name => {
  try {
    return JSON.parse(getRemoteConfigItem(name))
  } catch (error) {
    return {}
  }
}

export const defaults = {
  dispatch_cut_off_time: 0,
  rerankmodel: '',
  min_app_version: '',
  live_app_version: '',
  update_url: '',
  disabled_payment_methods: '',
  store_credit_enabled: true,
  express_post_min_amount: 50,
  express_post_enabled: true,
  minimum_stock_level: 20,
  minimum_spend: 25,
  home_header_logo: '',
  excluded_promo_stock_message_skus: [],
  max_line_item_quantity: 10,
  api_headers: JSON.stringify({
    staging: { 'x-px-access-token': 'IhY5YslUpIyfTTEelVd8ovdIEm7lQ4Jq747Wf425imtXKSW26tzju0Q8yhTFIkx7' },
    production: { 'x-px-access-token': 'v4WUN74WEU5Jq0FNNG94QHDm1Nz1x5ydN5H5RO5dh72QRtIkS8jEGzeYOmMdIwJK' }
  }),
  smartlook_recording_enabled: true,
  gift_certificate: JSON.stringify({ themes: ['General'], image_url: null }),
  screenRoutes: JSON.stringify([]),
  defaultRouteParams: JSON.stringify({}),
  findation_enabled: false,
  log_product_not_found: false,
  account_returns_link: 'https://www.adorebeauty.com.au/returns.html',
  max_gift_card_codes: 1,
  graphql_cache_ttl: 60,
  search_suggestions: { products: 20, articles: 20 },
  footer_links: JSON.stringify([
    { text: 'TERMS & CONDITIONS', url: 'https://www.adorebeauty.com.au/terms-conditions.html' },
    { text: ' | ' },
    { text: 'PRIVACY POLICY', url: 'https://www.adorebeauty.com.au/privacy.html' },
    { text: 'Shipping Information', url: 'https://www.adorebeauty.com.au/shipping.html' }
  ]),
  account_menu_items: JSON.stringify([
    // webview fallback
    // {
    //   name: 'Need Help?',
    //   iconName: 'speech',
    //   webview: 'https://support.adorebeauty.com.au/hc/en-us'
    // },
    {
      name: 'Live Chat Help',
      iconName: 'speech',
      type: 'zendesk'
    },
    {
      name: 'Shipping Information',
      iconName: 'shipping',
      link: 'https://www.adorebeauty.com.au/shipping.html'
    },
    {
      name: 'Where is my order?',
      iconName: 'PreOrder',
      webview: 'https://support.adorebeauty.com.au/hc/en-us/articles/4407218187673-Unable-to-Locate-Order-'
    }
  ]),
  comestri_image_patterns: JSON.stringify(['/pim_media/', '/pim_brand_logo/'])
}

export const resetRemoteConfigCache = async () => {
  await remoteConfig().reset()
  await remoteConfig().fetch(0)
}

export const useRemoteConfig = () => {
  const [values, setValues] = useState(null)

  const logInfo = (message, color = 'green', configValues) => {
    console.info(`%c ${message}`, `color: ${color}`, '\n', configValues)
  }

  const initRemoteConfig = async () => {
    const fbRemote = await remoteConfig().setDefaults({ ...defaults })
    const fetchedRemotely = await remoteConfig().fetchAndActivate()
    const configValues = remoteConfig().getAll()
    if (fetchedRemotely) {
      logInfo('REMOTE config fetched and activated', 'green', configValues)
    } else {
      logInfo('LOCAL config activated', 'red', configValues)
    }
    setValues(configValues)
  }
  const handleMount = () => {
    initRemoteConfig()
  }
  useEffect(handleMount, [])

  return values
}

/**
 * fetch perimeter-x token for api headers request
 * @returns {any|{}|{}}
 */
export const getRemoteApiHeaders = () => {
  const apiHeaders = getRemoteConfigJson('api_headers') || {}
  const env = envConfig.apiUri.includes('www') ? 'production' : 'staging'
  if (apiHeaders?.[env]) {
    return apiHeaders[env]
  }

  return apiHeaders
}
