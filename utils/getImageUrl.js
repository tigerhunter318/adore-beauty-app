import { formatExternalUrl, formatPagePath, stripQueryStringFromUrl } from './format'
import envConfig from '../config/envConfig'
import { getRemoteConfigJson } from '../services/useRemoteConfig'

export const matchComestriImage = src =>
  getRemoteConfigJson('comestri_image_patterns').find(pattern => pattern && new RegExp(pattern, 'i').test(src))

/**
 * convert aws image urls to website domain
 * @param src
 * @returns {string}
 */
const formatComestriPath = src => {
  const pattern = matchComestriImage(src)
  if (pattern) {
    return `${pattern}${decodeURI(src.split(pattern)[1])}`
  }
}
/**
 *
 * website example
 * https://images.ctfassets.net/pi28xy1s107o/2c56EZx5lTlIIi7NfbluQw/e0b9a5719872914704ebf476b5581590/
 * BIQ_hero_image__1440x1200__-_2022-12-20T130011.031.jpg?fm=webp&w=255&h=255
 * https://www.adorebeauty.com.au/pim_media/000/424/754/
 * Adore_Beauty_Medium_Cosmetic_Bag_-_BlackSmoke.png?w=280&h=280&fmt=webp
 *
 * app
 * https://www.adorebeauty.com.au/pim_media/000/220/887/Medik8_Crystal_Retinal_1_.png?fmt=webp&w=280&h=280
 *
 * @param src
 * @param width
 * @param height
 * @param scale
 * @param strategy
 * @returns {string}
 */

const getImageUrl = ({ src, width, height, scale = 2.0, strategy = undefined }) => {
  let uri = ''
  const url = formatExternalUrl(src, true)

  if (matchComestriImage(src)) {
    const path = formatComestriPath(url)
    const w = width ? `w=${Math.round(width * scale)}&` : ''
    const h = height ? `h=${Math.round(height * scale)}&` : ''
    const websiteUrl = envConfig.siteUrl.replace(/\/+$/, '')
    uri = `${websiteUrl}${path}?${w}${h}fmt=webp` // match website format, ?w=280&h=280&fmt=webp
    if (envConfig.enableImageLogger) {
      console.info('adore', 'getImageUrl', width, height, uri)
    }
  } else if (`${src}`.includes('ctfassets')) {
    const w = width ? `&w=${Math.round(width * scale) + 0}` : ''
    const h = height ? `&h=${Math.round(height * scale) + 0}` : ''
    uri = `${url}?fm=webp${w}${h}` // match website format, ?fm=webp&w=280&h=280
    if (envConfig.enableImageLogger) {
      console.info('ctfassets', 'getImageUrl', width, height, uri)
    }
  } else if (
    `${src}`.includes('adorebeauty.com.au') ||
    `${src}`.includes('adorebeauty.co.nz') ||
    !`${src}`.includes('https')
  ) {
    const w = width ? `w=${Math.round(width * scale)}&` : ''
    const h = height ? `h=${Math.round(height * scale)}&` : ''
    uri = `${url}?${w}${h}fmt=webp` // match website format, ?w=280&h=280&fmt=webp
    if (envConfig.enableImageLogger) {
      console.info('adore', 'getImageUrl', width, height, uri)
    }
  } else if (strategy) {
    // for use with legacy strategy='auto'
    uri = `${url}?strategy=${strategy}`
    if (width) {
      uri += width ? `width=${Math.round(width * scale)}` : ''
    }
    if (height) {
      uri += height ? `&height=${Math.round(height * scale)}` : ''
    }
  } else {
    uri = url
    // prevents image stretching by only using width OR height, not both
    if (width) {
      uri += width ? `?width=${Math.round(width * scale)}` : ''
    } else if (height) {
      uri += height ? `?height=${Math.round(height * scale)}` : ''
    }
  }

  return uri
}

export default getImageUrl
