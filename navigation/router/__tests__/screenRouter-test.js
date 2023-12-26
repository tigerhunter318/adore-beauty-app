import screenRouter from '../screenRouter'
import { rewriteScreenPath } from '../routes'

/* eslint-disable  global-require */
describe('Test screenRouter.matchUrl', () => {
  const contentRoutesCases = [
    {
      name: 'can match /p/ product url to screenPath',
      url: 'https://www.adorebeauty.com.au/p/estee-lauder/estee-lauder-double-wear-makeup.html?foo=bar',
      expected: {
        screen: 'ProductStack/Product',
        params: {
          identifier: 'estee-lauder-double-wear-makeup',
          foo: 'bar'
        }
      }
    },
    {
      name: 'can match product_id url to screenPath',
      url: 'https://www.adorebeauty.com.au/541178.html',
      expected: {
        screen: 'ProductStack/Product',
        params: {
          product_id: '541178'
        }
      }
    },
    {
      name: 'cant resolve /p/product_id url to screenPath',
      url: 'https://www.adorebeauty.com.au/p/541178.html',
      expected: {
        screen: 'ProductStack/Product',
        params: {
          identifier: '541178'
        }
      }
    },
    {
      name: 'can match /c/ category url to screenPath',
      url: 'https://www.adorebeauty.com.au/c/skin-care/neck-care.html',
      expected: {
        screen: 'MainTab/Shop/ShopCategoryProducts',
        params: {
          url: 'skin-care/neck-care'
        }
      }
    },
    {
      name: 'can match /b/ brand url to screenPath',
      url: 'https://www.adorebeauty.com.au/b/estee-lauder.html',
      expected: {
        screen: 'MainTab/Shop/ShopCategoryProducts',
        params: {
          url: 'estee-lauder'
        }
      }
    },
    {
      name: 'can match /beauty/ url to screenPath',
      url: 'https://www.adorebeauty.com.au/beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/',
      expected: {
        screen: 'PostScreen',
        params: {
          url: 'beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/'
        }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/beautyiq/skin-care/what-is-crows-feet/',
      expected: {
        screen: 'PostScreen',
        params: {
          url: 'beautyiq/skin-care/what-is-crows-feet/'
        }
      }
    }
  ]
  const staticRoutesCases = [
    // {
    //   name: 'can match promotion.html url to screenPath',
    //   url: 'https://www.adorebeauty.com.au/promotion.html?foo=bar',
    //   expected: {
    //     screen: 'MainTab/Shop/ShopPromotions',
    //     params: {
    //       foo: 'bar'
    //     }
    //   }
    // },
    {
      url: 'https://www.adorebeauty.com.au/',
      expected: {
        screen: 'MainTab/Home',
        params: {}
      }
    },
    // TODO handle query string to homepage
    // {
    //   name: 'can match homepage url with query string to screenPath',
    //   url: 'https://www.adorebeauty.com.au/?foo-bar',
    //   expected: {
    //     screen: 'MainTab/Home',
    //     params: {  foo: 'bar' }
    //   }
    // },
    {
      url: 'https://www.adorebeauty.com.au',
      expected: {
        screen: 'MainTab/Home',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/cart.php',
      expected: {
        screen: 'Cart',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/cart.php?setCurrencyId=1',
      expected: {
        screen: 'Cart',
        params: { setCurrencyId: '1' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/cart.php?setCurrencyId=1',
      expected: {
        screen: 'Cart',
        params: { setCurrencyId: '1' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/results?q=hair',
      expected: {
        screen: 'MainDrawer/Main/ProductStack/SearchResults',
        params: { q: 'hair' }
      }
    },
    {
      url: 'https://staging.adorebeauty.com.au/results?q=hair',
      expected: {
        screen: 'MainDrawer/Main/ProductStack/SearchResults',
        params: { q: 'hair' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/adore-society.html',
      expected: {
        screen: 'AdoreSocietyModalScreen',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/beautyiq',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/beautyiq?foo=bar',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: { foo: 'bar' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/beautyiq/',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/beautyiq/?foo=bar',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: { foo: 'bar' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/giftcertificates.php',
      expected: {
        screen: 'GiftCertificate',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/giftcertificates.php?foo=bar',
      expected: {
        screen: 'GiftCertificate',
        params: { foo: 'bar' }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/p/adore-beauty/gift-certificate.html',
      expected: {
        screen: 'GiftCertificate',
        params: {}
      }
    }
  ]

  const appRoutes = [
    {
      url: 'https://www.adorebeauty.com.au/?app=Shop/brand',
      expected: {
        screen: 'MainTab/Shop/ShopTabs/brand',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/?app=Shop/category',
      expected: {
        screen: 'MainTab/Shop/ShopTabs/category',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/?app=Shop/concern',
      expected: {
        screen: 'MainTab/Shop/ShopTabs/concern',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/?app=BeautyIQ/Podcasts',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Podcasts',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/?app=Product',
      expected: {
        screen: 'ProductStack/Product',
        params: {}
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/?app=Product&identifier=estee-lauder-double-wear-makeup',
      expected: {
        screen: 'ProductStack/Product',
        params: {
          identifier: 'estee-lauder-double-wear-makeup'
        }
      }
    },
    // https://www.adorebeauty.com.au/?app=Product&identifier=estee-lauder-double-wear-makeup
    {
      url: 'https://www.adorebeauty.com.au/?app=Shop',
      expected: {
        screen: 'MainTab/Shop/Shop',
        params: {}
      }
    }
  ]

  const customerRoutes = [
    {
      url: 'https://www.adorebeauty.com.au/account/resetpassword',
      expected: { screen: 'Login/LoginResetPassword' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account/wishlists',
      expected: { screen: 'MainTab/Account/AccountWishlist' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account/myrewards',
      expected: { screen: 'MainTab/Account/AccountRewards' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account/myaccount',
      expected: { screen: 'MainTab/Account/AccountProfile' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account/orders',
      expected: { screen: 'MainTab/Account/AccountOrders' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account/addresses',
      expected: { screen: 'MainTab/Account/AccountAddresses' }
    },
    {
      url: 'https://www.adorebeauty.com.au/customer/account',
      expected: { screen: 'MainTab/Account/Account' }
    }
  ]
  const empiProductRoutes = [
    {
      url: 'https://www.adorebeauty.com.au/none.html?empi=12752',
      expected: { screen: 'ProductStack/Product', params: { empi: '12752' } }
    }
  ]

  const appScreenPathRoutes = [
    {
      url: 'https://www.adorebeauty.com.au/?appScreenPath=ProductStack/Product&productSku=xxx',
      expected: { screen: 'ProductStack/Product', params: { productSku: 'xxx' } }
    },
    {
      url:
        'https://www.adorebeauty.com.au/beautyiq/podcasts/episode-50-a-dietitian-spills-the-tea-on-superfoods/?appScreenPath=PostScreen&url=xxx',
      expected: { screen: 'PostScreen', params: { url: 'xxx' } }
    },
    {
      url: 'https://www.adorebeauty.com.au/anything.html?appScreenPath=MainTab/Shop/ShopCategoryProducts&url=skin-care',
      expected: {
        screen: 'MainTab/Shop/ShopCategoryProducts',
        params: {
          url: 'skin-care'
        }
      }
    },
    {
      url:
        'https://www.adorebeauty.com.au/beautyiq?appScreenPath=BeautyIQPodcastEpisode&url=https://omny.fm/shows/beauty-iq-uncensored/q-does-cutting-your-hair-make-it-grow-faster',
      expected: {
        screen: 'BeautyIQPodcastEpisode',
        params: {
          url: 'https://omny.fm/shows/beauty-iq-uncensored/q-does-cutting-your-hair-make-it-grow-faster'
        }
      }
    },
    {
      url:
        'https://www.adorebeauty.com.au/beautyiq/podcasts/episode-50-a-dietitian-spills-the-tea-on-superfoods/?appScreenPath=BeautyIQPodcastEpisode&url=https://omny.fm/shows/beauty-iq-uncensored/q-does-cutting-your-hair-make-it-grow-faster',
      expected: {
        screen: 'BeautyIQPodcastEpisode',
        params: {
          url: 'https://omny.fm/shows/beauty-iq-uncensored/q-does-cutting-your-hair-make-it-grow-faster'
        }
      }
    }
  ]

  const beautyIqCategoryCases = [
    {
      url: 'https://www.adorebeauty.com.au/beautyiq/category/skincare/',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: {
          slug: 'skincare'
        }
      }
    },
    {
      url: 'https://www.adorebeauty.com.au/skin-care/routines.html',
      expected: {
        screen: 'MainTab/BeautyIQ/BeautyIQ/Articles',
        params: {
          slug: 'skin-care/routines'
        }
      }
    }
  ]

  const groups = {
    staticRoutesCases,
    customerRoutes,
    contentRoutesCases,
    appRoutes,
    empiProductRoutes,
    appScreenPathRoutes,
    beautyIqCategoryCases
  }
  Object.keys(groups).forEach(type => {
    const cases = groups[type]
    cases.forEach(item => {
      const { name, url, expected } = item
      const testName = name ?? `can match `
      it(`[${type}] ${testName} (${url})`, async () => {
        const { matchUrl } = screenRouter()
        const result = matchUrl(url)
        expect(result).toEqual(expect.objectContaining(expected))
      })
    })
  })
})
describe('Test screenRouter.getCurrentScreenPath', () => {
  it(`can convert product with initial navigation state to path`, async () => {
    const navigation = {
      dispatch: jest.fn(),
      dangerouslyGetParent: jest.fn(),
      dangerouslyGetState: () => require('../__mocks__/mockState-product-with-initial-state.json')
    }
    const router = screenRouter({ navigation })
    const path = router.getCurrentScreenPath()
    expect(path).toMatch(/^\/MainDrawer\/Main\/ProductStack\/Product/)
  })

  it(`can convert product navigation state to path`, async () => {
    const navigation = {
      dispatch: jest.fn(),
      dangerouslyGetParent: jest.fn(),
      dangerouslyGetState: () => require('../__mocks__/mockState-product.json')
    }
    const router = screenRouter({ navigation })
    const path = router.getCurrentScreenPath()
    expect(path).toBe(
      '/MainDrawer/Main/ProductStack/Product?inStock=true&is_consent_needed=false&productSku=MB185400&product_id=5232&q='
    )
  })

  it(`can convert product shop state to path`, async () => {
    const navigation = {
      dispatch: jest.fn(),
      dangerouslyGetParent: jest.fn(),
      dangerouslyGetState: () => require('../__mocks__/mockState-shop.json')
    }
    const router = screenRouter({ navigation })
    const path = router.getCurrentScreenPath()
    expect(path).toMatch(/^\/MainDrawer\/Main\/MainTab\/Shop\/Shop/)
  })

  it(`can convert product ShopCategoryProducts state to path`, async () => {
    const navigation = {
      dispatch: jest.fn(),
      dangerouslyGetParent: jest.fn(),
      dangerouslyGetState: () => require('../__mocks__/mockState-ShopCategoryProducts.json')
    }
    const router = screenRouter({ navigation })
    const path = router.getCurrentScreenPath()
    expect(path).toMatch(/^\/MainDrawer\/Main\/MainTab\/Shop\/ShopCategoryProducts/)
  })
})

describe('Test rewriteScreenPath', () => {
  expect(rewriteScreenPath('Product')).toEqual('ProductStack/Product')
  expect(rewriteScreenPath('ProductStack/Product')).toEqual('ProductStack/Product')
  expect(rewriteScreenPath('Product?a=1')).toEqual('ProductStack/Product?a=1')
  expect(rewriteScreenPath('ProductStack/Reviews')).toEqual('ProductStack/Reviews')
})
