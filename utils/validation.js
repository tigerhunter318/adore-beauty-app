import { formatExternalUrl, formatPagePath } from './format'

const emailRegex = new RegExp(
  // eslint-disable-next-line
  '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])',
  'i'
)
const phoneRegex = new RegExp(
  // eslit-disable-next-line
  /^\D*0\D*\d{9}\D*$/
)

const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*(_|[^\w])).{8,}/)

export const urlRegex = new RegExp(/(http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/)

export const isValidPassword = value => {
  if (value) {
    return passwordRegex.test(value)
  }
  return true
}

export const isEmail = value => !!value && emailRegex.test(value)

export const isMinLength = min => value => !(value && value.length < min)

export const isAlphaNumeric = value => value && /[^a-zA-Z0-9 ]/i.test(value)
export const isNumber = value => value && !/[^0-9]/i.test(value)
export const isPhoneNumber = value => !!value && isNumber(value) && value.length === 10 && phoneRegex.test(value)

export const isMatchingPassword = (name, form, value) => {
  switch (name) {
    case 'newPassword':
      if (form.hasBlurred('confirmPassword') && form.getValue('confirmPassword') !== value) {
        return false
      }
      return true
    case 'confirmPassword':
      if (form.hasBlurred('newPassword') && form.getValue('newPassword') !== value) {
        return false
      }
      return true
    default:
      return true
  }
}

export const isValidName = name => name && !name.toLowerCase().includes('withheld')

export const isValidRichText = data => {
  const result = data?.filter(item => {
    const tags = Object.values(item?.content).filter(value => /<script/gi.test(value) || /placement v2/gi.test(value))
    if (tags?.length) {
      return item
    }
    return null
  })?.length

  return result === 0
}

/**
 * is a url an adorebeauty website url
 *
 * @param str
 * @returns {boolean}
 */
export const isWebsiteUrl = str => {
  const url = formatExternalUrl(str)
  return url.includes('://www.adorebeauty') || url.includes('://adorebeauty') || url.includes('://staging.adorebeauty')
}

export const isAppScreenUrl = url =>
  isWebsiteUrl(url) && !url.includes('browser=external') && !url.includes('browser=inapp')

export const isAppBrowserUrl = url => (isWebsiteUrl(url) && url.includes('browser=inapp')) || !isWebsiteUrl(url)
export const isExternalBrowserUrl = url => isWebsiteUrl(url) && url.includes('browser=external')

export const isValidArray = data => !!data && !!Array.isArray(data) && data.length > 0

export const isValidObject = data => !!data && typeof data === 'object' && Object.entries(data).length > 0

export const isValidNumber = value => !Number.isNaN(parseFloat(value))

export const isNumberBetween = (amount, start, end) => isValidNumber(amount) && amount >= start && amount <= end

/**
 * check the url is an adore website and matches with a path
 * * before ? path === formatPath(url)
 * * after ? url.indexOf(path) === 0
 * @param url
 * @param path
 * @returns {boolean}
 */
export const isWebsitePath = (url, path = '') => {
  const formatPath = str =>
    formatPagePath(str)
      .split('.html')[0]
      .split('.php')[0]
      .split('?')[0]

  const formatQuery = str => {
    const parts = str.split('?')
    if (parts.length > 1) {
      return parts[1]
    }
    return ''
  }

  return (
    isWebsiteUrl(url) &&
    path &&
    formatPath(url) === formatPath(path) &&
    formatQuery(url).indexOf(formatQuery(path)) === 0
  )
}

export const isBrandCategory = data => !!data?.category_info?.is_brand_i && !!data?.category_info?.name_t

export const isLuxuryBrandProduct = data =>
  `${data?.display_type || ''}`.toLowerCase() === 'luxury' ||
  `${data?.display_type_s || ''}`.toLowerCase() === 'luxury' ||
  data?.is_luxury ||
  false

export const isBrandUrl = url => /b\//.test(url)

export const isCategoryUrl = url => /c\//.test(url)
