import configLocalJson from './config.local.json'
import configNzJson from './config.nz.json'
import { deepFreeze, deepMerge } from '../utils/object'

const productIndex = 'live_Comestri_Products_Au'

const envConfig = {
  appVersion: '0.0.0', // injected by bitrise in build workflow
  buildNumber: 9999, // injected by bitrise in build workflow
  jiraId: 'MOB-000', // injected by bitrise in build workflow
  networkOfflineCheck: true,
  isStagingApp: false,
  isApiPerformanceMonitoringEnabled: false,
  siteUrl: 'https://www.adorebeauty.com.au/',
  apiUri: 'https://www.adorebeauty.com.au/api',
  graphUri: 'https://www.adorebeauty.com.au/graphql',
  hasuraUri: 'https://www.adorebeauty.com.au/hasura/v1/graphql',
  graphQL: {
    defaultFetchPolicy: 'cache-first'
  },
  afterpayUrl: 'adorebeauty.com.au/nativestatic/afterpay/index.html',
  country: 'Australia',
  countryCode: 'AU',
  currencyCode: 'AUD',
  timezone: 'Australia/Melbourne',
  googleWebClientId: '',
  googleIosClientId: '',
  facebookAppId: '1469392956707347',
  locale: 'en-AU',
  hasura: {
    categorySortIndexes: [
      { index: { product_sales_year: 'desc_nulls_last' }, label: 'Recommended', identifier: 'recommended' },
      { index: { created_at: 'desc_nulls_last' }, label: 'New', identifier: 'new_arrivals' },
      { index: { amount: 'asc_nulls_last' }, label: 'Lowest to highest price', identifier: 'price_asc' },
      { index: { amount: 'desc_nulls_last' }, label: 'Highest to lowest price', identifier: 'price_desc' },
      { index: { product_sales_year: 'desc_nulls_last' }, label: 'Best sellers', identifier: 'best_sellers' },
      {
        index: { 'reviews_aggregate.aggregate.avg.rating_value': 'desc_nulls_last' },
        label: 'Top rated',
        identifier: 'top_rated'
      }
    ],
    categoryPriceFilters: [
      { code: JSON.stringify({ _gte: 0, _lte: 25 }), name: 'Under $25' },
      { code: JSON.stringify({ _gte: 25, _lte: 50 }), name: '$25 - $50' },
      { code: JSON.stringify({ _gte: 50, _lte: 100 }), name: '$50 - $100' },
      { code: JSON.stringify({ _gte: 100, _lte: 200 }), name: '$100 - $200' },
      { code: JSON.stringify({ _gte: 200, _lte: 10000 }), name: 'From $200' }
    ],
    priceBookName: 'AUD List Price',
    paths: {
      product: '/p/'
    }
  },
  sentry: {
    dsn: '',
    enableInExpoDevelopment: false,
    ignoreConsoleLogs: true,
    debug: true,
    maxBreadcrumbs: 200,
    autoSessionTracking: true
  },
  braintree: {
    merchantIdentifier: 'merchant.com.au.adorebeauty.web',
    googlePayMerchantId: '12607411705618691120',
    countryCode: 'AU', // apple pay setting
    currencyCode: 'AUD', // apple pay setting
    merchantName: 'Adore Beauty',
    googlePay: true,
    applePay: false,
    vaultManager: true,
    payPal: true,
    cardDisabled: false,
    darkTheme: true
  },
  algolia: {
    appId: 'KE81A5WUZB',
    apiKey: '', // moved to Bitrise secret
    productIndex,
    categoryIndex: 'live_Comestri_Categories_Au',
    articlesIndex: 'retrieval_api_production',
    suggestionIndex: `${productIndex}_query_suggestions`,
    attributes: [
      { label: 'Categories', attribute: 'categories_without_path' },
      { label: 'Brand', attribute: 'manufacturer' },
      { label: 'Choices', attribute: 'choices' },
      { label: 'Skin Concern', attribute: 'skin_concern' },
      { label: 'Key Ingredients', attribute: 'key_ingredients' },
      { label: 'Age', attribute: 'age' },
      { label: 'Coverage', attribute: 'coverage' },
      { label: 'Finish Powder', attribute: 'finish_powder' },
      { label: 'Hair Curl Type', attribute: 'hair_curl_type' },
      { label: 'Hair Texture', attribute: 'hair_texture' },
      { label: 'Skin Type', attribute: 'skin_type' }
    ],
    filtersLimit: 30,
    showMoreLimit: 200,
    sortIndices: [
      { label: 'Recommended', value: productIndex },
      { label: 'Lowest Price', value: `${productIndex}_price_default_asc` },
      { label: 'Highest Price', value: `${productIndex}_price_default_desc` },
      { label: 'Top Rated', value: `${productIndex}_products_rating_summary_desc` },
      { label: 'New', value: `${productIndex}_news_from_date_desc` },
      { label: 'Best Sellers', value: `${productIndex}_Best_Sellers` }
    ]
  },
  tealium: {
    enabled: true,
    account: 'adore.beauty',
    profile: 'reactapp'
  },
  smartlook: {
    enabled: true,
    apiKey: '' // on Bitrise secret
  },
  firebase: {
    dynamicLinkDomain: 'https://www.adorebeauty.com.au',
    domainUriPrefix: 'https://app.adorebeauty.com.au/dl',
    isApolloPerformanceMonitoringEnabled: false,
    isApolloPerformanceMonitoringDebugEnabled: false
  },
  omny: {
    enabled: true,
    orgID: '133eb022-d538-494d-9082-aaa90065f49b'
  },
  branch: {
    gaTrackingId: 196422872 // 228992428
  },
  forterId: '4029971c299e',
  isForterEnabled: true,
  disableJailBreak: true,
  disableInAppMessaging: false,
  enablePushNotifications: true,
  enableYellowBox: true,
  isAfterpayEnabled: true,
  isAppleEnabled: true,
  isKlarnaEnabled: false,
  zendeskAccountKey: '',
  enableZendesk: true,
  enableTrackingTransparency: true,
  enableUpdateCheck: true,
  enableReduxLogger: false,
  enableApiLogger: false,
  enableNetworkDebugging: false,
  enableHasuraQueryLogger: false,
  enablePartnerizeLogger: false,
  enableSecureStoreMigration: true, // set to false after release 1.12
  enableGaLogger: false,
  enableImageLogger: false,
  enableAppReview: true,
  e2e: {
    email: '',
    password: '',
    giftCertificate: 'YD6-C6F-UIA-998',
    promoCode: 'BONUSDUMMY'
  },
  findation: {
    apiKey: '6d02548cf680800e13ad5544d470d4f78d999383471be0669b82fcbd8c76'
  },
  emarsys: {
    contactFieldId: '56497',
    recommendedProductsEnabled: true
  },
  cartSheetTimeout: 5000,
  ignoredLogs: [
    'Native splash screen is already hidden.',
    'EventEmitter.removeListener',
    'new NativeEventEmitter',
    'Could not find image'
  ]
}

export const versionNumber = () => `${envConfig.appVersion}.${envConfig.buildNumber}`

export const versionName = () => `v${versionNumber()}`

let mergedConfig = envConfig
if (envConfig.locale === 'en-NZ') {
  mergedConfig = deepMerge(envConfig, configNzJson)
}

const immutableEnvConfig = deepFreeze(deepMerge(mergedConfig, configLocalJson))

export default immutableEnvConfig
