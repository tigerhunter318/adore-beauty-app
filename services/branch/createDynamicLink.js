import branch from 'react-native-branch'
import { formatExternalUrl, formatPageIdentifier } from '../../utils/format'
import branchEvents from './branchEvents'

export const createDynamicLink = async (url, options = {}) => {
  let branchUniversalObject
  if (options?.pageType === 'product' && options?.productData) {
    branchUniversalObject = await branchEvents.createUniversalObjectFromProduct(options.productData)
  } else {
    branchUniversalObject = await branch.createBranchUniversalObject(formatPageIdentifier(url, true), {})
  }

  const linkProperties = {
    feature: 'share'
    // channel: 'facebook'
  }

  const controlParams = {
    $desktop_url: formatExternalUrl(url)
  }

  const response = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  return response?.url
}
