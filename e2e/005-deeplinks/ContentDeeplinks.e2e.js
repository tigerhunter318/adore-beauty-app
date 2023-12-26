/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToExist,
  expectToHaveText,
  jestExpect,
  launchApp,
  openUrl,
  waitToBeVisible
} from '../helpers'
/**
 * detox build --configuration ios.sim.debug
 * detox test --configuration ios.sim.debug e2e/005-deeplinks/ContentDeeplinks.e2e.js
 */
describe('Content Deeplinks', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })
  it('can open product screen /estee-lauder/estee-lauder-double-wear-makeup.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/estee-lauder/estee-lauder-double-wear-makeup.html')
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'Estée Lauder Double Wear Stay In Place Makeup')
  })

  it('can open product screen /p/the-ordinary/the-ordinary-hyaluronic-acid-2-b5-60ml.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/p/the-ordinary/the-ordinary-hyaluronic-acid-2-b5-60ml.html')
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'The Ordinary Supersize Hyaluronic Acid 2% + B5 - 60ml')
  })

  it('can open product screen /none.html?empi=12752', async () => {
    await openUrl('https://www.adorebeauty.com.au/none.html?empi=12752')
    await waitToBeVisible('ProductScreen')
    await expectToHaveText('ProductScreen.Header.Title', 'Estée Lauder Double Wear Stay In Place Makeup')
  })

  it('can open category product list screen /skin-care/moisturisers/night.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/skin-care/moisturisers/night.html')
    await waitToBeVisible('ShopCategoryProductsScreen')
    await expectToExist('ShopCategoryProductsScreen.ProductGrid')
    await expectToExist('urlIdentifier:skin-care/moisturisers/night')
  })

  it('can open category product list screen /c/skin-care', async () => {
    await openUrl('https://www.adorebeauty.com.au/c/skin-care')
    await waitToBeVisible('ShopCategoryProductsScreen')
    await expectToExist('ShopCategoryProductsScreen.ProductGrid')
    await expectToExist('urlIdentifier:skin-care')
  })

  it('can open brand product list screen /b/ultra-violette.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/b/ultra-violette.html')
    await waitToBeVisible('ShopCategoryProductsScreen')
    await expectToExist('ShopCategoryProductsScreen.ProductGrid')
    await expectToExist('urlIdentifier:ultra-violette')
    await expectToBeVisible('ShopCategoryProductsScreen.BrandHeader')
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

  //

  it('can open beauty screen /the-ordinary/guide/the-ordinary-skincare-guide-what-product-is-right-for-me', async () => {
    await openUrl(
      'https://www.adorebeauty.com.au/the-ordinary/guide/the-ordinary-skincare-guide-what-product-is-right-for-me'
    )
    await waitToBeVisible('PostScreen')
    await expectToHaveText(
      'PostScreen.Title',
      'We’ve Found the Best The Ordinary Products to Add to Cart, Based on Your Skin Concerns'
    )
  })

  it('can open beauty screen /beautyiq/hair/popular-hair-care-products/', async () => {
    await openUrl('https://www.adorebeauty.com.au/beautyiq/hair/popular-hair-care-products/')
    await waitToBeVisible('PostScreen')
    await expectToHaveText(
      'PostScreen.Title',
      '10 AB Staff Share the One Hair Product They Use (Almost) Every Single Day'
    )
  })
  it('can open beautyiq category /beautyiq/category/skincare/', async () => {
    await openUrl('https://www.adorebeauty.com.au/beautyiq/category/skincare/')
    await waitToBeVisible('BeautyIQScreen')
    const tabItem = await element(by.text('SKIN CARE').withAncestor(by.id('BeautyIQSubNavigation')))
    const attributes = await tabItem.getAttributes()
    await expect(tabItem).toExist()
    jestExpect(attributes.identifier).toBe('BeautyIQSubNavigationItem.Type:checked')
  })

  it('can open beautyiq routine /make-up/routines.html', async () => {
    await openUrl('https://www.adorebeauty.com.au/make-up/routines.html')
    await waitToBeVisible('BeautyIQScreen')
    const tabItem = await element(by.text('MAKEUP').withAncestor(by.id('BeautyIQSubNavigation')))
    const attributes = await tabItem.getAttributes()
    await expect(tabItem).toExist()
    jestExpect(attributes.identifier).toBe('BeautyIQSubNavigationItem.Type:checked')
  })

  it('can open beautyiq category /beautyiq/category/hair/', async () => {
    await openUrl('https://www.adorebeauty.com.au/beautyiq/category/hair/')
    await waitToBeVisible('BeautyIQScreen')
    const tabItem = await element(by.text('HAIR').withAncestor(by.id('BeautyIQSubNavigation')))
    const attributes = await tabItem.getAttributes()
    await expect(tabItem).toExist()
    jestExpect(attributes.identifier).toBe('BeautyIQSubNavigationItem.Type:checked')
  })
})
