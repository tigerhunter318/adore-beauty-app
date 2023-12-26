import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import { isValidArray } from '../../utils/validation'

/*
 * regex pattern match urls to ScreenPaths
 */
const routes = [
  // static routes
  { pattern: 'appScreenPath=' }, // wildcard match and rewrite
  { pattern: '^$', screen: 'MainTab/Home' },
  { pattern: '^cart.php', screen: 'Cart' },
  { pattern: '^results\\?', screen: 'MainDrawer/Main/ProductStack/SearchResults' },
  { pattern: '^promotion.html', screen: 'MainTab/Shop/ShopPromotions' },
  { pattern: '^adore-society.html', screen: 'AdoreSocietyModalScreen' },
  { pattern: '^beautyiq(\\/|\\?)*$', screen: 'MainTab/BeautyIQ/BeautyIQ/Articles' },
  { pattern: '^giftcertificates.php', screen: 'GiftCertificate' },
  { pattern: '^(p/)?adore-beauty/gift-certificate', screen: 'GiftCertificate' },

  // customer routes
  { pattern: '^account/resetpassword', screen: 'Login/LoginResetPassword' },
  { pattern: '^customer/account/wishlists', screen: 'MainTab/Account/AccountWishlist' },
  { pattern: '^customer/account/myrewards', screen: 'MainTab/Account/AccountRewards' },
  { pattern: '^customer/account/myaccount', screen: 'MainTab/Account/AccountProfile' },
  { pattern: '^customer/account/orders', screen: 'MainTab/Account/AccountOrders' },
  { pattern: '^customer/account/addresses', screen: 'MainTab/Account/AccountAddresses' },
  { pattern: '^customer/account/giftcards', screen: 'MainTab/Account/AccountGiftCards' },
  { pattern: '^customer/account', screen: 'MainTab/Account/Account' },
  // ?app= routes
  { pattern: '^\\?app=Shop/brand', screen: 'MainTab/Shop/ShopTabs/brand' },
  { pattern: '^\\?app=Shop/category', screen: 'MainTab/Shop/ShopTabs/category' },
  { pattern: '^\\?app=Shop/concern', screen: 'MainTab/Shop/ShopTabs/concern' },
  { pattern: '^\\?app=BeautyIQ/Podcasts', screen: 'MainTab/BeautyIQ/BeautyIQ/Podcasts' },
  // { pattern: '^\\?app=BeautyIQPodcastEpisode', screen: 'BeautyIQPodcastEpisode' },
  { pattern: '^\\?app=Product', screen: 'ProductStack/Product' },
  { pattern: '^\\?app=Shop', screen: 'MainTab/Shop/Shop' },

  // content routes
  { pattern: '^c/.+', key: 'pathIdentifier', param: 'url', screen: 'MainTab/Shop/ShopCategoryProducts' }, // starts with c/
  { pattern: '^p/.+', key: 'pageIdentifier', param: 'identifier', screen: 'ProductStack/Product' }, // starts with p/
  { pattern: '^b/.+', key: 'pathIdentifier', param: 'url', screen: 'MainTab/Shop/ShopCategoryProducts' }, // starts with b/
  { pattern: '^beautyiq\\/(?!category|\\?).+', key: 'path', param: 'url', screen: 'PostScreen' }, // start with beautyiq, but not category
  {
    pattern: '^beautyiq\\/(category).+',
    key: 'pageIdentifier',
    param: 'slug',
    screen: 'MainTab/BeautyIQ/BeautyIQ/Articles'
  }, // beautyiq category
  { pattern: 'routines\\.html$', key: 'pathIdentifier', param: 'slug', screen: 'MainTab/BeautyIQ/BeautyIQ/Articles' }, // starts with number
  { pattern: '^\\d+.html', key: 'pageIdentifier', param: 'product_id', screen: 'ProductStack/Product' }, // starts with number

  { pattern: 'empi=([^&#]*)', key: 'empi', screen: 'ProductStack/Product' } // contains empi query string
]

const screenRoutes = {
  getRoutes: () => {
    const remote = getRemoteConfigJson('screenRoutes')
    if (isValidArray(remote)) {
      return [...remote, ...routes]
    }
    return routes
  }
}

/**
 * rewrite an old screenPath format to a new path
 * @param path
 * @returns {*}
 */
export const rewriteScreenPath = path => {
  if (path.indexOf('ProductStack/') === 0 && !path.includes('ProductStack/')) {
    return path.replace('ProductStack/', 'ProductStack/')
  }
  if (path.indexOf('Product') === 0 && !path.includes('ProductStack')) {
    return path.replace('Product', 'ProductStack/Product')
  }

  return path
}

export default screenRoutes
