import { isDev } from './dev'
import { getIn } from './getIn'

const toCamel = s =>
  s.replace(/([-_][a-z])/gi, $1 =>
    $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )

const isValidObject = data => isObject(data) && Object.entries(data).length > 0

const isArray = function(a) {
  return Array.isArray(a)
}

const isObject = function(o) {
  return o && o === Object(o) && !isArray(o) && typeof o !== 'function'
}

export const keysToCamel = function(o) {
  if (isObject(o)) {
    const n = {}

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k])
    })

    return n
  }
  if (isArray(o)) {
    return o.map(i => keysToCamel(i))
  }

  return o
}

export const isEmpty = obj => {
  if (!isObject(obj)) return false

  return JSON.stringify(obj) === JSON.stringify({})
}

export const deepClone = obj => JSON.parse(JSON.stringify(obj))

// Merge a `source` object to a `target` recursively
export const deepMerge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], deepMerge(target[key], source[key]))
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}
/*
 * make an object immutable and prevent any modifications on it
 */
export const deepFreeze = object => {
  // No freezing in production (for better performance).
  try {
    if (!isDev()) {
      return object
    }
  } catch (e) {
    //
  }

  // When already frozen, we assume its children are frozen (for better performance).
  // This should be true if you always use `simpleDeepFreeze` to freeze objects,
  // which is why you should have a linter rule that prevents you from using
  // `Object.freeze` standalone.
  //
  // Note that Object.isFrozen will also return `true` for primitives (numbers,
  // strings, booleans, undefined, null), so there is no need to check for
  // those explicitly.
  if (Object.isFrozen(object)) {
    return object
  }

  if (!Array.isArray(object) && Object.getPrototypeOf(object) !== Object.getPrototypeOf({})) {
    throw new Error('simpleDeepFreeze only supports plain objects, arrays, and primitives')
  }

  // At this point we know that we're dealing with either an array or plain object, so
  // just freeze it and recurse on its values.
  Object.freeze(object)
  Object.keys(object).forEach(function(key) {
    deepFreeze(object[key])
  })

  return object
}

export const objectCompareValues = (obj1, obj2, keys = []) =>
  keys.filter(key => getIn(obj1, key) !== getIn(obj2, key)).length === 0

export const formatObjectStringNumbersToNumbers = obj => {
  const keys = Object.keys(obj || {})
  keys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      // If the property is an object, recursively call the function on it
      if (typeof value === 'object') {
        formatObjectStringNumbersToNumbers(value)
      } else if (typeof value === 'string' && value) {
        const num = Number(value)
        if (!Number.isNaN(num)) {
          // Replace the string with the number
          obj[key] = num
        }
      }
    }
  })
  return obj
}

// * eslint safe
export const objectHasKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

export const pickKeys = (obj, keys) =>
  Object.keys(obj)
    .filter(i => keys.includes(i))
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})

export const filterObjectByKeys = (obj, keys, shouldInclude = false) => {
  if (!isValidObject(obj)) return {}
  if (Array.isArray(keys) && !!keys.length) {
    const targets = keys.map(key => `(${key})`).join('|')
    const keysRegex = RegExp(targets)

    return Object.keys(obj)
      .filter(objectKey => keysRegex.test(objectKey) === shouldInclude)
      .reduce((cur, objectKey) => Object.assign(cur, { [objectKey]: obj[objectKey] }), {})
  }

  return obj
}
