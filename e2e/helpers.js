/* eslint-disable no-undef */
/* eslint-disable global-require */
export const jestExpect = require('expect')
/**
 * https://github.com/nubank/detox/blob/master/docs/APIRef.waitFor.md#tobevisible
 *
 * @param targetId
 * @param timeoutMs
 * @returns {Promise<void>}
 */
export const waitToBeVisible = async (targetId = 'TabBar.Home', timeoutMs = 20 * 1000) => {
  await waitFor(element(by.id(targetId)))
    .toBeVisible()
    .withTimeout(timeoutMs)
  return expect(element(by.id(targetId))).toBeVisible()
}

export const waitToExist = async (targetId = 'TabBar.Home', timeoutMs = 20 * 1000) => {
  await waitFor(element(by.id(targetId)))
    .toExist()
    .withTimeout(timeoutMs)
  return expect(element(by.id(targetId))).toExist()
}

export const launchApp = async (launchArgs = undefined) => {
  const { url } = launchArgs || {}
  await device.launchApp({ newInstance: true, url, permissions: { notifications: 'NO' }, launchArgs })
  const result = await waitToBeVisible('TabBar.Home')
  return result
}

export const openUrl = async url => {
  await device.openURL({ url, sourceApp: 'com.apple.mobilesafari' })
}

/**
 * https://github.com/wix/Detox/blob/master/docs/APIRef.ActionsOnElement.md#whileelementelement
 * @param scrollEl
 * @param targetEl
 * @returns {Promise<void>}
 */
export const expectToBeVisibleWhenScrolled = (
  targetId,
  scrollId,
  scrollAmount = 100,
  direction = 'down',
  startPositionX = NaN,
  startPositionY = NaN,
  threshold = 75
) =>
  waitFor(element(by.id(targetId)))
    .toBeVisible(threshold)
    .whileElement(by.id(scrollId))
    .scroll(scrollAmount, 'down', startPositionX, startPositionY)

export const elementWithAncestor = (targetId, ancestorId) => element(by.id(targetId).withAncestor(by.id(ancestorId)))

export const elementChild = (ancestorId, targetId) => elementWithAncestor(targetId, ancestorId)

export const expectToBeVisible = (targetId, threshold = 75) => expect(element(by.id(targetId))).toBeVisible(threshold)
export const expectToHaveAccessibilityValue = (targetId, accessibilityValue) =>
  expect(element(by.id(targetId))).toHaveValue(accessibilityValue)
export const expectToHaveAccessibilityLabel = (targetId, label) => expect(element(by.id(targetId))).toHaveLabel(label)
export const expectToExist = targetId => expect(element(by.id(targetId))).toExist()
export const expectToHaveText = (targetId, text) => expect(element(by.id(targetId))).toHaveText(text)

export const getElementAttributes = targetId => element(by.id(targetId)).getAttributes()

// export const expectToContainText = (targetId, value) => {
//   const {text} = element(by.id(targetId)).getAttributes()
//   expect(text).toHaveText(value)
// }

export const tapChild = async (ancestorId, targetId, index = 0) =>
  elementChild(ancestorId, targetId)
    .atIndex(index)
    .tap()

export const tapElement = targetId => element(by.id(targetId)).tap()

export const takeScreenshot = name => device.takeScreenshot(name)

export const doesChildExist = async (ancestorId, targetId, index = 0) => {
  try {
    await expect(elementChild(ancestorId, targetId).atIndex(index)).toExist()
    return true
  } catch (err) {
    return false
  }
}

export const typeText = (targetId, text) => element(by.id(targetId)).typeText(text)
