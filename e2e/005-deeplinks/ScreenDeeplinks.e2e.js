/* eslint-disable no-undef */
import { expectToExist, expectToHaveText, launchApp, openUrl, waitToBeVisible } from '../helpers'

/**
 * detox build --configuration ios.sim.debug
 * detox test --configuration ios.sim.debug e2e/005-deeplinks/ScreenDeeplinks.e2e.js
 */
describe('Screen Deeplinks', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })

  it('can open Shop tab Category /?app=Shop/category', async () => {
    await openUrl('https://www.adorebeauty.com.au/?app=Shop/category')
    await waitToBeVisible('ShopCategory.ScrollView')
  })
  it('can open Shop tab Concern /?app=Shop/concern', async () => {
    await openUrl('https://www.adorebeauty.com.au/?app=Shop/concern')
    await waitToBeVisible('ShopConcern.List')
  })
  it('can open Shop tab Brand /?app=Shop/brand', async () => {
    await openUrl('https://www.adorebeauty.com.au/?app=Shop/brand')
    await waitToBeVisible('ShopBrand.FlatList')
  })
  it('can open Shop screen /?app=Shop', async () => {
    await openUrl('https://www.adorebeauty.com.au/?app=Shop')
    await waitToBeVisible('ShopScreen.ScrollView')
  })

  it('can open Home screen /', async () => {
    await openUrl('https://www.adorebeauty.com.au')
    await waitToBeVisible('HomeScreen.ScrollView')
  })
  //
  it('can open Search screen /results?q=hair', async () => {
    await openUrl('https://www.adorebeauty.com.au/results?q=hair')
    await waitToBeVisible('SearchProducts.Hits')
    await expectToHaveText('SearchResults.SearchBox', 'hair')
  })
  it('can open product screen /estee-lauder/estee-lauder-double-wear-makeup.html after search', async () => {
    await openUrl('https://www.adorebeauty.com.au/p/estee-lauder/estee-lauder-double-wear-makeup.html')
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'Estée Lauder Double Wear Stay In Place Makeup')
  })
  it('can open Search screen /results?q=skin after product', async () => {
    await openUrl('https://www.adorebeauty.com.au/results?q=skin')
    await waitToBeVisible('SearchProducts.Hits')
    await expectToHaveText('SearchResults.SearchBox', 'skin')
  })

  it('can open Promotion screen /promotion.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/promotion.html')
    await waitToBeVisible('ShopPromotionsScreen')
  })

  it('can open product screen when search suggestions screen is still mounted', async () => {
    await openUrl('https://www.adorebeauty.com.au/p/estee-lauder/estee-lauder-double-wear-makeup.html')
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'Estée Lauder Double Wear Stay In Place Makeup')
  })
  //
  //
  it('can open Adore Society screen /adore-society.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/adore-society.html')
    await waitToBeVisible('AdoreSocietyScreen')
  })

  it('can open Beautyiq screen /beautyiq', async () => {
    await openUrl('https://www.adorebeauty.com.au/beautyiq')
    await waitToBeVisible('BeautyIQScreen')
  })

  it('can open Gift Certificates screen /giftcertificates.php', async () => {
    await openUrl('https://www.adorebeauty.com.au/giftcertificates.php')
    await waitToBeVisible('GiftCertificateScreen')
  })

  it('can open appScreenPath /?appScreenPath=MainTab/Shop/ShopCategoryProducts&url=skin-care', async () => {
    await openUrl('https://www.adorebeauty.com.au/?appScreenPath=MainTab/Shop/ShopCategoryProducts&url=skin-care')
    await waitToBeVisible('ShopCategoryProductsScreen')
    await expectToExist('ShopCategoryProductsScreen.ProductGrid')
    await expectToExist('urlIdentifier:skin-care')
  })
  it('can open appScreenPath anything.html?appScreenPath=Product&identifier=estee-lauder-double-wear-makeup', async () => {
    await openUrl(
      'https://www.adorebeauty.com.au/anything.html?appScreenPath=Product&identifier=estee-lauder-double-wear-makeup'
    )
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'Estée Lauder Double Wear Stay In Place Makeup')
  })
})
