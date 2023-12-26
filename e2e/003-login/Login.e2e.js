/* eslint-disable no-undef */
import { expectToBeVisible, launchApp, tapElement } from '../helpers'
import envConfig from '../../config/envConfig'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/003-login/Login.e2e.js
 */
describe('Login', () => {
  beforeEach(async () => {
    await launchApp({ clearAsyncStorage: true })
  })

  it('can login to account screen', async () => {
    await tapElement('TabBar.Account')
    await expectToBeVisible('CartSignIn')

    await element(by.id('CartSignIn.email')).typeText(envConfig.e2e.email)
    await element(by.text('NEXT')).tap()
    await expectToBeVisible('CartLogin')
    await element(by.id('CartLogin.password')).typeText(envConfig.e2e.password)
    await tapElement('CartLogin.ButtonSignIn')

    await tapElement('TabBar.Account')
    await expectToBeVisible('AccountScreen')
    await expectToBeVisible('AccountSettings.email')
    // expect(element(by.id('AccountSettings.email'))).toHaveText(envConfig.e2e.email)
  })
})
