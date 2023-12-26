/**
 * execute async function on array of items.
 * parallel execution
 * const result = await asyncEach(items, async(item) => item)
 *
 * @param items
 * @param callback
 * @returns {Promise<$TupleMap<*, typeof $await>>}
 */
export const asyncEach = async (items, callback) => Promise.all(items.map((item, index) => callback(item, index)))

/**
 * execute async function on array of items.
 * sequential execution
 * const result = await asyncReduce(items, async(item) => item)
 *
 * @param items
 * @param callback
 * @returns {Promise<$TupleMap<*, typeof $await>>}
 */
export const asyncReduce = (array, asyncFunc) =>
  array.reduce(
    (previous, current) => previous.then(accumulator => asyncFunc(current).then(result => accumulator.concat(result))),
    Promise.resolve([])
  )
