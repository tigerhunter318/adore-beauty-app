/* eslint-disable no-undef */
import { expectToBeVisible, expectToExist, launchApp, tapElement } from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/CartScreen.e2e.js
 */
describe('CartScreen', () => {
  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.CartTab')
    await tapElement('TabBar.CartTab')
  })

  it('should see CartLoginScreen when not logged in', async () => {
    await expectToBeVisible('CartSignIn')
  })
})
