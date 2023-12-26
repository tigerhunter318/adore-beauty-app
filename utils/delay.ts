/**
 * await delay Timeout
 * @usage
 *
 ```
 console.log('now')
 await delay(1000)
 console.log('1 sec later')
 ```
 * @usage with ref
 ```
 let timeout = null
 console.log('now')
 await delay(1000, timeout)
 clearTimeout(timeout)
 console.log('1 sec later')
 *
 *
 * @param ms
 * @param ref
 * @returns {Promise<unknown>}
 */
/* eslint-disable no-new */
/* eslint-disable no-param-reassign */

export const delay = (ms: number, ref?: any) =>
  new Promise(resolve => {
    if (ref) {
      clearTimeout(ref)
      ref = setTimeout(resolve, ms)
      return ref
    }
    return setTimeout(resolve, ms)
  })

/* eslint-enable no-new */
/* eslint-enable no-param-reassign */
