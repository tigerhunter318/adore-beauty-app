import qs from 'qs'
import envConfig from '../config/envConfig'
import { getIn } from './getIn'

const URL_QUERY_BLACKLIST = []

export const formatNumber = x => {
  if (x) {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export function formatPrice(value) {
  const val = (value / 1).toFixed(2)
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const formatCurrency = (value, prefix = '$') => {
  if (value || value === 0) {
    const val = value.toString().replace(/[^0-9.]+/g, '')
    return `${prefix}${parseFloat(val)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
  }
}

export const toSnakeCase = str => str && str.toLowerCase().replace(/\s/g, '_')
export const toDashCase = str => str && str.toLowerCase().replace(/\s/g, '-')
export const formatSlug = str =>
  str &&
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '-')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-') // remove duplicate -
    .replace(/^-/, '') // remove leading -
    .replace(/-+$/, '') // remove trailing -

/**
 * format a url to a path, remove domain name
 * e.g. https://www.adorebeauty.com.au/new-arrivals.html?dir=desc&order=news_from_date, new-arrivals.html?dir=desc&order=news_from_date
 * @param url
 */
export const formatPagePath = (url, stripQueryString = false) => {
  if (url && typeof url === 'string') {
    const path = url
      .trim()
      .replace(/^(http(s)?:\/\/).*?(\/)/, '', 'gi')
      .replace(/^(http(s)?:\/\/).*?(\.au)/, '', 'gi')
      .replace(/^\/+/, '')

    if (stripQueryString) {
      return path.split('?')[0]
    }
    return path
  }
  return url
}

/**
 * strip /b /p /c from start content path
 * @param urlPath
 * @returns {*}
 */
export const formatContentPath = urlPath => urlPath.replace(/^p\/|^b\/|^c\//i, '')

/*
 * format url or path to identifier for use with api variable
 * e.g. formatPageIdentifier('https://www.adorebeauty.com.au/the-ordinary/the-ordinary-natural-moisturizing-factors-ha-100ml.html', true) : the-ordinary-natural-moisturizing-factors-ha-100ml
 * e.g. formatPageIdentifier('https://www.adorebeauty.com.au/beautyiq/skin-care/dermalogica-smart-response-serum-review/') : beautyiq/skin-care/dermalogica-smart-response-serum-review/
 */
export const formatPageIdentifier = (url, pageNameOnly = false) => {
  if (url && typeof url === 'string') {
    const path = formatPagePath(url, true)
      .split('.html')[0]
      .replace(/^\/+/, '') // remove query params and .html and leading slash
    if (pageNameOnly) {
      const parts = path.replace(/\/$/, '').split('/') // remove trailing slash and split folder into array
      return parts[parts.length - 1]
    }
    return path
  }
  return url
}
/**
 * format a url to an adore url, if there is no http
 * @param url
 * @returns {string|*}
 */
export const formatExternalUrl = (url, stripQueryString = false) => {
  if (typeof url === 'string' && url.indexOf('://') === -1) {
    return `${envConfig.siteUrl}${formatPagePath(url, stripQueryString)}`
  }
  if (stripQueryString) {
    return stripQueryStringFromUrl(url)
  }
  return url
}

export const formatUrlPath = (url, stripQueryString = true) => `/${formatPagePath(url, stripQueryString)}`

export const formatProductUrlPath = url => {
  const path = envConfig.hasura.paths.product
  return `${path}${formatContentPath(formatPagePath(url, true))}`
}

export const hashObjectToArray = (items, keyName = 'id', singleValue = false) => {
  const values = Object.values(items)
  const keys = Object.keys(items)
  return values.map((value, i) =>
    // {singleValue ? value : ...values, [keyName]:keys[i]}
    singleValue ? { value, [keyName]: keys[i] } : { ...value, [keyName]: keys[i] }
  )
}

/**
 * format nuxt router to query object to query string
 *
 * @param queryObject
 * @returns {string}
 */
export const formatQueryToString = queryObject => {
  let str = ''
  Object.keys(queryObject).forEach(key => {
    str += `&${key}=${queryObject[key]}`
  })
  return str.slice(1)
}

/*
 * extract query string from a url and return as object
 */
export const parseQueryString = (url, options) => {
  if (url?.includes('?')) {
    return qs.parse(url.split('?')?.[1], options)
  }
  return {}
}

/**
 * remove gremlins from url
 * @param queryObject
 */
export const formatQueryObject = queryObject => {
  const clone = { ...queryObject }
  URL_QUERY_BLACKLIST.forEach(name => {
    delete clone[name]
  })
  return clone
}

export const filterQueryObject = (queryObject, filterWhiteList = []) => {
  const filterQuery = {}
  const allowedItems = Object.keys(queryObject).filter(item => filterWhiteList.find(item2 => item2 === item))
  allowedItems.forEach(key => {
    filterQuery[key] = queryObject[key]
  })
  return filterQuery
}

export const formatYoutubeVideoId = videoUrl => {
  if (videoUrl.includes('youtube.com')) {
    return videoUrl.substr(videoUrl.lastIndexOf('/') + 1) // the YT embed ID at end of a YT url
  }
}

export const padNumber = n => (n < 10 ? `0${n}` : n)

export const stripSpaces = value => value && value.replace(/\s/g, '')

/**
 * remove unwanted content from html content
 * convert html meta chars to text
 * remove instagram scripts
 * remove any tags with 'hide-for-app' attribute, e.g. <center hide-for-app>delete this</center>
 *
 * @param htmlString
 * @returns {*|void|string|never}
 */

export const sanitizeContent = htmlString => {
  if (htmlString && typeof htmlString === 'string') {
    const blacklistRegex = new RegExp(
      `<[^<]+?(?:(?:s+[w\\-_]+?s*=s*"[^"]*?")+)?\\s+([^<]*?)(hide-for-app)([^<]*?)>(.*?)</[^<]+?>`,
      'g'
    )
    const emptyTagsRegex = new RegExp('<(?!iframe)([^ >]+)[^>]*>s*</\\1>', 'g')

    const sanitizedContent = htmlString
      .replace(/<script(.)*(instagram).*script>/gi, '')
      .replace(/&rdquo;|&ldquo;|&quot;/g, '"')
      .replace(/&apos;|&#39;|&rsquo;|&lsquo;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&trade;/g, '®')
      .replace(/&copy;/g, '©')
      .replace(/&nbsp;/g, ' ')
      .replace(/(\r\n|\n|\r)/gm, '') // remove linebreak characters
      .replace(/<br.*?>/g, '\n') // convert br tags to linebreak
      .replace(/&(?:#[0-9]+|[a-zA-Z]+);/gi, '') // remove unpredicted entities
      .replace(blacklistRegex, '')
      .replace(emptyTagsRegex, '')
      .replace(/<center>/g, '')
      .replace(/<\/center>/g, '')
      .replace(/\s+/g, ' ') // remove duplicate whitespace

    return sanitizedContent
  }

  return htmlString
}

export const replaceHtmlTags = (htmlString, replacements = []) => {
  if (htmlString && typeof htmlString === 'string') {
    let result = htmlString
    replacements.forEach(item => {
      const [tag, replacement] = item
      const re1 = new RegExp(`<${tag}>`, 'gi')
      const re2 = new RegExp(`</${tag}>`, 'gi')
      result = result.replace(re1, `<${replacement}>`).replace(re2, `</${replacement}>`)
    })

    return result
  }
  return htmlString
}

export const trimHtmlSpaces = htmlString => htmlString && htmlString.replace(/\s\s+/g, ' ').trim()

/**
 * extract a nested field from an object
 *
 * usage :
 * dataToString(customer, 'email'),
 * dataToString(productData, 'brand_name|manufacturer'),
 * dataToString(productData, 'categories', 'title'),
 *
 * @param data the Object
 * @param name Name of field, a pipe for fallback name 'brand_name|manufacturer'
 * @param mapKey Is the field is an array get a child key
 * @returns {string|number|*}
 */
export const dataToString = (data, name, mapKey) => {
  const keys = name.split('|')
  let field = data?.[keys[0]]
  if (!field && keys.length > 1) {
    field = data?.[keys[1]]
  }
  if (typeof field === 'boolean') {
    return field ? 1 : 0
  }
  if (field) {
    if (Array.isArray(field)) {
      let arr = field
      if (mapKey) {
        arr = field.map(item => item[mapKey])
      }
      return arr.join(',')
    }
    return field
  }
  return ''
}

export const stripQueryStringFromUrl = url => url && url.replace(/#.*$/, '').replace(/\?.*$/, '')

export const formatFromJson = content => {
  try {
    JSON.parse(content)
  } catch (e) {
    return content
  }
  return JSON.parse(content)
}

export const formatToJson = content => {
  try {
    JSON.stringify(content)
  } catch (e) {
    return content
  }
  return JSON.stringify(content)
}

export const truncate = (str, max = 100, suffix = '…') => {
  if (!str) {
    return ''
  }

  return str.length <= max ? str : `${str.substr(0, max - suffix.length).trim()}${suffix}`
}

export const pluraliseResults = (count, name) => `${count} ${count === 1 ? name : `${name}s`}`

export const objectValuesToString = obj => {
  Object.keys(obj).forEach(key => {
    obj[key] = obj?.[key]?.toString() || ''
  })
  return obj
}

export const formatProductSkuValue = productSku =>
  typeof productSku === 'string' ? productSku : getIn(productSku, '0')

export const pluraliseString = (count, noun, suffix = 's', specialPlural = null) => {
  if (count === 1) {
    return `${count} ${noun}`
  }

  if (!count) {
    return specialPlural ? `no ${specialPlural}` : `no ${noun}${suffix}`
  }

  return specialPlural ? `${count} ${specialPlural}` : `${count} ${noun}${suffix}`
}

/*
 * title.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove non-english characters
 */
// const stripNonEnglishChars = text => unorm.nfd(text).replace(/[\u0300-\u036f]/g, '')
export const stripNonEnglishChars = text => text && text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * fix missing non-english characters in brand names
 *
 * @param brandName
 * @param title
 * @returns {string|*}
 */
export const formatBrandNameFromProductName = (brandName, productName) => {
  if (!!productName && !!brandName && typeof productName === 'string' && typeof brandName === 'string') {
    const normalizedTitle = stripNonEnglishChars(productName)
    const regex = new RegExp(brandName, '')
    const match = normalizedTitle.match(regex)
    if (match?.length > 0) {
      const start = normalizedTitle.search(regex)
      const end = match[0].length
      const text = productName.slice(start, end).trim()
      return text.trim()
    }
    return brandName
  }
  if (!!brandName && typeof brandName === 'string') {
    return brandName
  }
  return ''
}

export const stripBrandFromProductName = (brandName, productName) => {
  if (!!productName && !!brandName && typeof productName === 'string' && typeof brandName === 'string') {
    const words = brandName.split(' ')

    let title = productName
    words.forEach(word => {
      const regex = new RegExp(word, 'i')
      const normalizedTitle = stripNonEnglishChars(title) // remove non-english characters
      const match = normalizedTitle.match(regex)
      if (match?.length > 0) {
        const start = normalizedTitle.search(regex)
        const end = match[0].length
        title = (title.slice(0, start) + title.slice(end)).trim()
      }
    })
    return title.trim()
  }
  if (!!productName && typeof productName === 'string') {
    return productName
  }
  return ''
}

export const formatScreenPath = (screenPath = '') => {
  const path = screenPath.startsWith('/') ? screenPath : `/${screenPath}`
  return path.replace(/=true/gi, '=1').replace(/=false/gi, '=0')
}
