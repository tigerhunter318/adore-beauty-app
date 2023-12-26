import { Dimensions } from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import { isAndroid } from './device'
import { isValidObject } from './validation'

const { width, height } = Dimensions.get('window')
/**
 * viewport width, equivalent of 100vh in css
 * @param amt
 * @returns {number}
 */
export const vw = (amt = 100) => width * (amt / 100)
/**
 * viewport height, equivalent of 100vh in css
 * @param amt
 * @returns {number}
 */
export const vh = (amt = 100) => height * (amt / 100)

/**
 * convert pixel design width to a viewport width
 *
 * @param value
 * @param designWidth
 * @returns {number}
 */
export const px = (value, designWidth = 375) => vw((value / designWidth) * 100)

export const useSafeScreenHeight = (headerHeight = 40) => {
  const insets = useSafeInsets()
  return vh(100) - (insets.top + insets.bottom + headerHeight)
}

export const useSafeInsets = () => {
  let insets = { top: 0, bottom: 0, left: 0, right: 0 }

  if (isValidObject(initialWindowMetrics?.insets)) {
    insets = initialWindowMetrics.insets
  }

  if (isAndroid()) {
    insets.bottom = 0
  }

  return insets
}
