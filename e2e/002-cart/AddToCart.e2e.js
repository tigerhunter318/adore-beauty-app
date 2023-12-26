/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  expectToExist,
  launchApp,
  tapChild,
  tapElement,
  waitToBeVisible,
  waitToExist
} from '../helpers'
import { delay } from '../../utils/delay'
import envConfig from '../../config/envConfig'

/**
 * detox build --configuration ios.sim.debug
 * detox test --configuration ios.sim.debug e2e/002-cart/AddToCart.e2e.js
 */
describe('AddToCart', () => {
  beforeEach(async () => {
    await launchApp({ clearAsyncStorage: true })
  })

  it('can add to cart from ShopScreen Top Sellers', async () => {
    const scrollView = 'ShopScreen.ScrollView'
    await tapElement('TabBar.Shop')
    await expectToBeVisible(scrollView)
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', scrollView, 500)
    await tapChild('ShopScreen.ShopBestSellers', 'Button.AddToCart', 0)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.Continue')
    await delay(100)
    await tapChild('ShopScreen.ShopBestSellers', 'Button.AddToCart', 1)
  })

  it('can add to cart from Product Screen', async () => {
    const scrollView = 'ShopScreen.ScrollView'
    await tapElement('TabBar.Shop')
    await expectToBeVisible(scrollView)
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', scrollView, 500)
    await tapChild('ShopScreen.ShopBestSellers', 'ProductListItem.Image')
    await expectToBeVisible('ProductScreen')
    await tapChild('ProductPriceBar', 'Button.AddToCart')
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
  })
  //
  it('can add to cart from Search Results Screen', async () => {
    await tapElement('Header.SearchButton')
    await element(by.id('SearchSuggestions.SearchBox')).typeText('ordinary')
    await waitToExist('SearchSuggestionsHits')
    await tapChild('SearchSuggestionsHits', 'SearchSuggestionsHits.Item', 0)
    await expectToBeVisible('SearchProducts.Hits')
    await tapChild('SearchProducts.Hits', 'Button.AddToCart', 0)
    await waitToBeVisible('CartBottomSheet.SheetContent')
    await tapElement('CartBottomSheet.Continue')
    await delay(100)
    await tapChild('SearchProducts.Hits', 'Button.AddToCart', 1)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
  })
  //
  it('can add to cart from Search Results Product Screen', async () => {
    await tapElement('Header.SearchButton')
    await element(by.id('SearchSuggestions.SearchBox')).typeText('ordinary')
    await waitToExist('SearchSuggestionsHits')
    await tapChild('SearchSuggestionsHits', 'SearchSuggestionsHits.Item', 0)
    await expectToBeVisible('SearchProducts.Hits')
    await tapChild('SearchProducts.Hits', 'ProductListItem.Image')
    await expectToBeVisible('ProductScreen')
    await tapChild('ProductPriceBar', 'Button.AddToCart')
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
  })

  it('can add to cart from Category List Screen', async () => {
    await tapElement('TabBar.Shop')
    await tapElement('ShopTabItem.CATEGORY')
    await expectToBeVisible('ShopCategory.ScrollView')
    await tapChild('ShopCategory.ItemColumns', 'ButtonCategory')
    await expectToBeVisible('ShopCategorySubCategories.ScrollView')
    await tapElement('ShopCategorySubCategories.ButtonShopAll')
    await expectToBeVisible('ShopCategoryProductsScreen.ProductGrid')
    await tapChild('ShopCategoryProductsScreen.ProductGrid', 'Button.AddToCart', 0)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.Continue')
    await delay(200)
    await tapChild('ShopCategoryProductsScreen.ProductGrid', 'Button.AddToCart', 1)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
  })
  //
  it('can add to cart from Category Product Screen', async () => {
    await tapElement('TabBar.Shop')
    await tapElement('ShopTabItem.CATEGORY')
    await expectToBeVisible('ShopCategory.ScrollView')
    await tapChild('ShopCategory.ItemColumns', 'ButtonCategory')
    await expectToBeVisible('ShopCategorySubCategories.ScrollView')
    await tapElement('ShopCategorySubCategories.ButtonShopAll')
    await expectToBeVisible('ShopCategoryProductsScreen.ProductGrid')
    await tapChild('ShopCategoryProductsScreen.ProductGrid', 'ProductListItem.Image', 0)
    await expectToBeVisible('ProductScreen')
    await tapChild('ProductPriceBar', 'Button.AddToCart')
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
  })
  //
  it('can add Product to Cart, Login and add Gift Certificate to Cart', async () => {
    const scrollView = 'ShopScreen.ScrollView'
    await tapElement('TabBar.Shop')
    await expectToBeVisible(scrollView)
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', scrollView, 500)
    await tapChild('ShopScreen.ShopBestSellers', 'ProductListItem.Image')
    await expectToBeVisible('ProductScreen')
    await tapChild('ProductPriceBar', 'Button.AddToCart')
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.CheckoutNow')
    await element(by.id('CartSignIn.email')).typeText(envConfig.e2e.email)
    await element(by.text('NEXT')).tap()
    await expectToBeVisible('CartLogin')
    await element(by.id('CartLogin.password')).typeText(envConfig.e2e.password)
    await tapElement('CartLogin.ButtonSignIn')
    await expectToBeVisibleWhenScrolled('CartTabs.CartCode.gift', 'CartScreen.ScrollView', 500)
    await tapChild('CartTabs.CartCode.gift', 'CartTabs.CartCode.gift.form')
    await element(by.id('CartTabs.CartCode.gift.form')).typeText(envConfig.e2e.giftCertificate)
    await tapElement('CartTabs.CartCode.gift.apply')
    await expectToBeVisible('CartPriceBarGiftCertificates')
  })
})
