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
import { guestAddress, guestEmail, testAccountEmail } from '../mockdata'

/**
 * detox test --configuration ios.sim.debug --loglevel trace e2e/004-checkout/GuestCheckout.e2e.js
 */
describe('Guest Checkout', () => {
  beforeEach(async () => {
    await launchApp({ clearAsyncStorage: true, useTestDeliveryAddress: true })
  })

  it('can add to cart and checkout as a guest', async () => {
    await tapElement('TabBar.Shop')
    await takeScreenshot('CATEGORY')
    await tapElement('ShopTabItem.CATEGORY')
    await takeScreenshot('ScrollView')
    await expectToBeVisible('ShopCategory.ScrollView')
    await takeScreenshot('ButtonCategory')
    await tapChild('ShopCategory.ItemColumns', 'ButtonCategory')
    await takeScreenshot('ScrollView')
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
    await element(by.id('CartSignIn.email')).typeText(guestEmail())
    await takeScreenshot('CartSignIn.email')
    await element(by.text('NEXT')).tap()

    await expectToBeVisible('CartSignup.ButtonGuestContinue')
    await tapElement('CartSignup.ButtonGuestContinue')

    await expect(elementChild('CartListProducts', 'CartLineItem').atIndex(0)).toBeVisible()
    await expect(elementChild('CartListProducts', 'CartLineItem').atIndex(1)).toExist()

    await device.takeScreenshot('Checkout.GuestCart')

    await expectToBeVisible('Cart.ButtonCheckoutSecurely')
    await tapElement('Cart.ButtonCheckoutSecurely')
    await expectToBeVisible('CartCheckoutDeliveryAddress.firstName')
    await device.takeScreenshot('CartCheckoutDeliveryAddress')

    await element(by.id('CartCheckoutDeliveryAddress.firstName')).typeText('test')
    await element(by.id('CartCheckoutDeliveryAddress.lastName')).typeText('guest')
    await element(by.id('CartCheckoutDeliveryAddress.phone')).typeText('0400000000')
    await element(by.id('CartCheckoutDeliveryAddress.phone')).tapReturnKey()

    await tapElement('CartCheckoutDeliveryAddress.ButtonDeliveryOptions')
    await expectToBeVisible('CartCheckoutDeliveryOptions.title')
  })
})
