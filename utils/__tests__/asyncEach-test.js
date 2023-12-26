import { asyncEach, asyncReduce } from '../asyncEach'
import { delay } from '../delay'

describe('address tests', () => {
  // isAddressEqual

  const items = [
    { name: 'one', done: false },
    { name: 'two', done: false }
  ]
  const expectedResult = [
    { name: 'one', done: true },
    { name: 'two', done: true }
  ]
  const asyncFunction = async item => {
    await delay(200)
    return { ...item, done: true }
  }

  it('check async each function', async () => {
    const result = await asyncEach(items, asyncFunction)
    expect(result).toMatchObject(expectedResult)
  })
  it('check async each function', async () => {
    const result = await asyncReduce(items, asyncFunction)
    expect(result).toMatchObject(expectedResult)
  })
})
