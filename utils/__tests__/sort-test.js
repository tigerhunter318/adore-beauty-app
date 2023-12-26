import { compareAlpha, compareDate, compareNumber } from '../sort'

describe('array sort tests', () => {
  it('sort array of objects with number key', () => {
    const input = [
      { key: 1, name: 'one' },
      { key: 0, name: 'zero' },
      { key: 3, name: 'three' },
      { key: 2, name: 'two' }
    ]

    const output = [
      { key: 0, name: 'zero' },
      { key: 1, name: 'one' },
      { key: 2, name: 'two' },
      { key: 3, name: 'three' }
    ]
    expect(input.sort(compareNumber('key'))).toStrictEqual(output)
  })

  it('sort array of object with number key using alpha sort', () => {
    const input = [
      { key: 1, name: 'one' },
      { key: 0, name: 'zero' },
      { key: 3, name: 'three' },
      { key: 2, name: 'two' }
    ]

    const output = [
      { key: 0, name: 'zero' },
      { key: 1, name: 'one' },
      { key: 2, name: 'two' },
      { key: 3, name: 'three' }
    ]
    expect(input.sort(compareAlpha('key'))).toStrictEqual(output)
  })

  it('sort array of objects with string key', () => {
    const input = [
      { key: 'b', name: 'one' },
      { key: 'a', name: 'zero' },
      { key: 'd', name: 'three' },
      { key: 'c', name: 'two' }
    ]

    const output = [
      { key: 'a', name: 'zero' },
      { key: 'b', name: 'one' },
      { key: 'c', name: 'two' },
      { key: 'd', name: 'three' }
    ]
    expect(input.sort(compareAlpha('key'))).toStrictEqual(output)
  })

  it('sort array of objects with date key', () => {
    const input = [
      { key: '2020-01-01 16:01', name: 'one' },
      { key: '2020-01-01 16:00', name: 'zero' },
      { key: '2020-01-02 16:00', name: 'three' },
      { key: '2020-01-01 17:00', name: 'two' }
    ]

    const output = [
      { key: '2020-01-02 16:00', name: 'three' },
      { key: '2020-01-01 17:00', name: 'two' },
      { key: '2020-01-01 16:01', name: 'one' },
      { key: '2020-01-01 16:00', name: 'zero' }
    ]
    expect(input.sort(compareDate('key'))).toStrictEqual(output)
  })
})
