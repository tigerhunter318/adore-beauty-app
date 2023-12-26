/**
 * example
 * return searchObject(rootState, (item, key, value) => {
 *     if (item.name === screenName) {
 *       return item
 *     }
 *   })
 *
 * @param haystack
 * @param matchCallback
 * @returns {*}
 */
const searchObject = (haystack, matchCallback) => {
  let match
  const findIn = (obj, cb) => {
    for (const k in obj) { // eslint-disable-line
      if (typeof obj[k] === 'object') {
        findIn(obj[k], cb)
      } else {
        const result = cb(obj, k, obj[k])
        if (result !== undefined) {
          match = result
        }
      }
    }
  }
  findIn(haystack, matchCallback)
  return match
}

/*
 * recursively search object by key name
 * searchObjectByKey({ items : [{blogPost : {name:'foo}}]}, 'blogPost')
 */
export const searchObjectByKey = (obj, key) => {
  for (const k in obj) { // eslint-disable-line
    if (k === key) {
      return obj[k]
    }
    if (typeof obj[k] === 'object') {
      const result = searchObjectByKey(obj[k], key)
      if (result) {
        return result
      }
    }
  }
  return undefined
}

export default searchObject
