/* eslint-disable no-undef */
import {
  expectToBeVisible,
  expectToExist,
  expectToHaveText,
  launchApp,
  openUrl,
  tapElement,
  waitToBeVisible
} from '../helpers'
import envConfig from '../../config/envConfig'

/**
 * detox build --configuration ios.sim.debug
 * detox test --configuration ios.sim.debug e2e/005-deeplinks/AccountDeeplinks.e2e.js
 */

describe('Account Deeplinks', () => {
  it('can login to account', async () => {
    await launchApp({ clearAsyncStorage: true })
    await tapElement('TabBar.Account')
    await expectToBeVisible('CartSignIn')

    await element(by.id('CartSignIn.email')).typeText(envConfig.e2e.email)
    await element(by.text('NEXT')).tap()
    await expectToBeVisible('CartLogin')
    await element(by.id('CartLogin.password')).typeText(envConfig.e2e.password)
    await tapElement('CartLogin.ButtonSignIn')
    await tapElement('TabBar.Shop')
  })

  it('can open account screen /customer/account/wishlists', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account/wishlists')
    await waitToBeVisible('AccountWishlistScreen')
  })

  it('can open account screen /customer/account/myrewards', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account/myrewards')
    await waitToBeVisible('AccountRewardsScreen')
  })

  it('can open account screen /customer/account/myaccount', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account/myaccount')
    await waitToBeVisible('AccountProfileScreen')
  })

  it('can open account screen /customer/account/orders', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account/orders')
    await waitToBeVisible('AccountOrdersScreen')
  })

  it('can open account screen /customer/account/addresses', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account/addresses')
    await waitToBeVisible('AccountAddressesScreen')
  })

  it('can open account screen /customer/account', async () => {
    await openUrl('https://www.adorebeauty.com.au/customer/account')
    await waitToBeVisible('AccountScreen')
  })
  it('can open CartScreen /cart.php', async () => {
    await openUrl('https://www.adorebeauty.com.au/cart.php')
    await waitToBeVisible('CartScreen')
  })
})
