/* eslint-disable no-undef */
import { expectToBeVisible, expectToExist, launchApp, tapElement } from '../helpers'

/**
 * detox test --configuration ios.sim.debug --loglevel verbose e2e/000-screens/BeautyIQScreen.e2e.js
 */
describe('BeautyIQScreen', () => {
  beforeEach(async () => {
    await launchApp()
    await expectToExist('TabBar.BeautyIQ')
    await tapElement('TabBar.BeautyIQ')
    await expectToBeVisible('BeautyIQScreen')
  })

  it('can see BeautyIQScreen', async () => {
    await expectToBeVisible('BeautyIQScreen')
  })
})
