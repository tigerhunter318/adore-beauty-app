/* eslint-disable no-undef */
import { expectToBeVisible, expectToExist, launchApp, tapElement } from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/AccountScreen.e2e.js
 */
describe('AccountScreen', () => {
  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.Account')
    await tapElement('TabBar.Account')
  })

  it('should see CartLoginScreen when not logged in', async () => {
    await expectToBeVisible('CartSignIn')
  })
})
