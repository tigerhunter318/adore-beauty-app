/**
 * Safe deep select from object. Returns null if key not found.
 *
 * e.g. get value from dataArray[0].playerDetail.name
 * @usage getIn(dataArray, [0, 'playerDetail', 'name'])
 *
 * e.g. get value from dataObj.items[0].name
 * @usage getIn(dataObj, ['items', 0, 'name'])
 *
 * @param object
 * @param accessorArray
 */
export const getInArray = (object, accessorArray) =>
  accessorArray.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), object)
/**
 * Same as getIn but used a string path instead of array
 *
 * @usage getIn(dataObj, 'items.0.name')
 *
 * @param object
 * @param pathString
 * @returns {*}
 */
export const getIn = (object, pathString) => (pathString ? getInArray(object, pathString.split('.')) : object)
