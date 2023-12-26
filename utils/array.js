import { isValidArray, isValidObject } from './validation'

/**
 * Group an array to multi-array
 * e.g. groupArray([1,2,3,4], 2) returns [ [1,2], [3,4] ]
 *
 * @param items
 * @param length
 * @returns {Array}
 */
export const groupArray = (items, length) => {
  const groups = []
  const max = items.length
  for (let i = 0; i < max; i += length) {
    groups.push(items.slice(i, i + length))
  }
  return groups
}

/**
 * recursively search array of object with child items
 * @param items
 * @param key
 * @param value
 * @returns {null}
 */
/* eslint-disable */
export const findDeep = function(items, key, value) {
  let found = null
  const search = (array, k, v) => {
    return array.some(e => {
      if (e[k] === v) {
        found = e
        return e
      }
      if (e.items) return search(e.items, k, v)
    })
  }
  search(items, key, value)

  return found
}
/* eslint-enable */

export const removeArrayDuplicates = (array, property = 'id') => {
  if (isValidArray(array) && array.every(item => isValidObject(item))) {
    return array.reduce((unique, item) => {
      if (!unique.some(uniqueItem => uniqueItem[property] === item[property])) {
        unique.push(item)
      }
      return unique
    }, [])
  }

  return [...new Set(array)]
}

export const toArray = val => (Array.isArray(val) ? val : [val])
