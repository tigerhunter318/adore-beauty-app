/* eslint-disable no-undef */
import { launchApp } from '../helpers'

describe('Auth', () => {
  beforeEach(async () => {
    await launchApp()
  })
  it('should be able to login existing customer in', async () => {
    await expect(element(by.id('HomeScreen'))).toBeVisible()
    await expect(element(by.id('TabBar.Shop'))).toExist()
    // click shop tab
    await element(by.id('TabBar.CartTab')).tap()
    // await expect(element(by.id('Screen.CartEmail'))).toBeVisible()
    await element(by.id('CartEmail.email')).typeText('detox-login@test.com')
    await element(by.text('NEXT')).tap()
    await element(by.id('CartLogin.password')).typeText('Password1?')
    await element(by.text('LOGIN')).tap()
    await expect(element(by.id('CartScreen'))).toBeVisible()
  })
})
