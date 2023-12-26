/* eslint-disable no-undef */

import {
  doesChildExist,
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  expectToExist,
  launchApp,
  takeScreenshot,
  tapChild,
  tapElement
} from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/ShopScreen.e2e.js
 * detox test --configuration ios.sim.debug e2e/000-screens/ShopScreen.e2e.js
 */

describe('ShopScreen', () => {
  const scrollView = 'ShopScreen.ScrollView'

  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.Shop')
    await element(by.id('TabBar.Shop')).tap()
    await expectToBeVisible(scrollView)
  })

  it('can tap on ShopPromo and see ShopPromotionsScreen', async () => {
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopPromo', scrollView, 50)
    await takeScreenshot('ShopScreen.ShopPromo.Scroll')
    await tapChild('ShopScreen.ShopPromo', 'ShopAllPromotions')
    await expectToBeVisible('ShopPromotionsScreen')
  })

  it('can tap on ShopNewProducts and see ProductScreen', async () => {
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopNewProducts', scrollView, 500)
    await takeScreenshot('ShopScreen.ShopNewProducts.Scroll')
    await tapChild('ShopScreen.ShopNewProducts', 'ProductListItem.Image')
    await expectToBeVisible('ProductScreen')
  })

  it('can tap on ShopBestSellers and see ProductScreen', async () => {
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', scrollView, 500)
    await takeScreenshot('ShopScreen.ShopBestSellers.Scroll')
    await tapChild('ShopScreen.ShopBestSellers', 'ProductListItem.Image')
    await expectToBeVisible('ProductScreen')
  })

  it('can tap on ShopPromoItem, open HasuraPromoQuickView and close modal', async () => {
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopPromo', scrollView, 50)
    await takeScreenshot('ShopScreen.ShopPromo.Scroll')
    if (await doesChildExist('ShopScreen.ShopPromo', 'ShopPromoItem')) {
      await tapChild('ShopScreen.ShopPromo', 'ShopPromoItem')
      await expectToBeVisible('HasuraPromoQuickView')
      await tapElement('ScreenViewModal.CloseButton')
      await expectToBeVisible(scrollView)
    }
  })
})
