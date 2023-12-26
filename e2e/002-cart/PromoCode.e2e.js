/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToBeVisibleWhenScrolled,
  tapChild,
  launchApp,
  tapElement,
  waitToBeVisible,
  openUrl
} from '../helpers'
import { delay } from '../../utils/delay'
import { testAccountEmail, testAccountPassword } from '../mockdata'
import envConfig from '../../config/envConfig'

/**
 * detox test --configuration ios.sim.debug e2e/002-cart/PromoCode.e2e.js
 */
describe('PromoCode', () => {
  it('can launch app', async () => {
    await launchApp({ clearAsyncStorage: true })
  })

  it('can add ShopScreen Top Sellers', async () => {
    const scrollView = 'ShopScreen.ScrollView'
    await tapElement('TabBar.Shop')
    await expectToBeVisible(scrollView)
    await expectToBeVisibleWhenScrolled('ShopScreen.ShopBestSellers', scrollView, 500)
    await tapChild('ShopScreen.ShopBestSellers', 'Button.AddToCart', 0)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.Continue')
    await delay(200)
    await tapChild('ShopScreen.ShopBestSellers', 'Button.AddToCart', 1)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.Continue')
    await delay(200)
  })

  it('can add $100+ product', async () => {
    await openUrl('https://www.adorebeauty.com.au/skinceuticals/skinceuticals-c-e-ferulic-serum.html')
    await waitToBeVisible('ProductScreen')
    await delay(100)
    await tapChild('ProductPriceBar', 'Button.AddToCart')
    await delay(100)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await tapElement('CartBottomSheet.CheckoutNow')
  })

  it('can login to cart', async () => {
    await expectToBeVisible('CartSignIn.email')
    await element(by.id('CartSignIn.email')).typeText(testAccountEmail())
    await element(by.text('NEXT')).tap()
    await expectToBeVisible('CartLogin.password')
    await element(by.id('CartLogin.password')).typeText(testAccountPassword())
    await tapElement('CartLogin.ButtonSignIn')
  })

  it('should see carousel element when promo code is applied', async () => {
    const scrollView = 'CartScreen.ScrollView'
    await expectToBeVisibleWhenScrolled('CartTabs.CartCode.coupon', scrollView, 500)
    await tapChild('CartTabs.CartCode.coupon', 'CartTabs.CartCode.coupon.form')
    await element(by.id('CartTabs.CartCode.coupon.form')).typeText(envConfig.e2e.promoCode)
    await tapElement('CartTabs.CartCode.coupon.apply')
    await waitToBeVisible('CartScreen.Promotions.CartChooseGift-0')
  })
})
