/* eslint-disable no-undef */

import {
  elementWithAncestor,
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  expectToExist,
  launchApp,
  tapChild,
  tapElement
} from '../helpers'
/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/ShopScreen.e2e.js
 */
describe('CategoryScreen', () => {
  const scrollView = 'ShopScreen.ScrollView'

  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.Shop')
    await tapElement('TabBar.Shop')
    await expectToBeVisible(scrollView)
  })

  it('can tap on Category Tab and see Shop Categories', async () => {
    await tapElement('TabBar.Shop')
    await tapElement('ShopTabItem.CATEGORY')
    await expectToBeVisible('ShopCategory.ScrollView')
    await tapChild('ShopCategory.ItemColumns', 'ButtonCategory')
    await expectToBeVisible('ShopCategorySubCategories.ScrollView')
  })
})
