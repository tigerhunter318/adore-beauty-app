/* eslint-disable no-undef */
import {
  elementChild,
  expectToBeVisible,
  launchApp,
  takeScreenshot,
  tapChild,
  tapElement,
  waitToBeVisible
} from '../helpers'
import { guestEmail, testAccountEmail, testAccountPassword } from '../mockdata'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/004-checkout/EmailLoginCheckout.e2e.js
 */
describe('Checkout', () => {
  beforeEach(async () => {
    await launchApp({ clearAsyncStorage: true })
  })

  it('can add to cart and checkout as a email user', async () => {
    await takeScreenshot('TabBar')
    await tapElement('TabBar.Shop')
    await takeScreenshot('CATEGORY')
    await tapElement('ShopTabItem.CATEGORY')
    await takeScreenshot('ScrollView')
    await expectToBeVisible('ShopCategory.ScrollView')
    await takeScreenshot('ButtonCategory')
    await tapChild('ShopCategory.ItemColumns', 'ButtonCategory')
    await expectToBeVisible('ShopCategorySubCategories.ScrollView')
    await takeScreenshot('ButtonShopAll')
    await tapElement('ShopCategorySubCategories.ButtonShopAll')
    await expectToBeVisible('ShopCategoryProductsScreen.ProductGrid')
    await takeScreenshot('AddToCart0')
    await tapChild('ShopCategoryProductsScreen.ProductGrid', 'Button.AddToCart', 0)
    await takeScreenshot('Continue')
    await tapElement('CartBottomSheet.Continue')
    await takeScreenshot('AddToCart1')
    await tapChild('ShopCategoryProductsScreen.ProductGrid', 'Button.AddToCart', 1)
    await waitToBeVisible('CartBottomSheet.CheckoutNow')
    await takeScreenshot('CheckoutNow-pre')
    await tapElement('CartBottomSheet.CheckoutNow')
    await takeScreenshot('CheckoutNow-post')

    await expectToBeVisible('CartSignIn.email')
    await takeScreenshot('CartSignIn')
    await element(by.id('CartSignIn.email')).typeText(testAccountEmail())
    await takeScreenshot('CartSignIn.email')
    await element(by.text('NEXT')).tap()
    await expectToBeVisible('CartLogin.password')
    await element(by.id('CartLogin.password')).typeText(testAccountPassword())
    await device.takeScreenshot('CartLogin.password')

    await tapElement('CartLogin.ButtonSignIn')

    await expect(elementChild('CartListProducts', 'CartLineItem').atIndex(0)).toBeVisible()
    await expect(elementChild('CartListProducts', 'CartLineItem').atIndex(1)).toExist()

    await device.takeScreenshot('Cart')

    await expectToBeVisible('Cart.ButtonCheckoutSecurely')
    await tapElement('Cart.ButtonCheckoutSecurely')
    await expectToBeVisible('CartCheckoutDeliveryAddress.firstName')
    await device.takeScreenshot('CartCheckoutDeliveryAddress')
    // expect text field value to be equal
    await tapElement('CartCheckoutDeliveryAddress.ButtonDeliveryOptions')
    await expectToBeVisible('CartCheckoutDeliveryOptions.title')
    await device.takeScreenshot('CartCheckoutDeliveryOptions')
    //
    await tapElement('CartCheckoutDeliveryOptions.ButtonProceedToPayment')
    await tapElement('CartPaymentMethod.title')
    await device.takeScreenshot('CartPaymentMethod')
  })
})
