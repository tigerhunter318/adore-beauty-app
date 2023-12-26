import { deepFreeze, filterObjectByKeys, formatObjectStringNumbersToNumbers, pickKeys } from '../object'
import searchObject, { searchObjectByKey } from '../searchObject'

describe('deepFreeze', function() {
  it('does not let you mutate objects deep down', function() {
    const frozenObject = deepFreeze({
      someObject: { foo: 'bar' }
    })
    frozenObject.someObject.foo = 'xyz'

    expect(frozenObject.someObject.foo).toEqual('bar')
  })
})

describe('search Object tests', () => {
  const haystack = {
    items: [
      {
        name: 'object1',
        value: '001'
      },
      {
        name: 'object2',
        value: '002'
      },
      {
        name: 'object3',
        value: '003'
      }
    ],
    item: {
      key: 'object4',
      value: '004'
    }
  }

  it('can find an object in nested object', () => {
    const foundObject = searchObject(haystack, item => {
      if (item.key === 'object4') {
        return item
      }
    })
    expect(foundObject).toStrictEqual({ key: 'object4', value: '004' })
  })

  it('can find an object in nested object array', () => {
    const foundObject = searchObject(haystack, item => {
      if (item.name === 'object2') {
        return item
      }
    })
    expect(foundObject).toStrictEqual({ name: 'object2', value: '002' })
  })

  it('can convert number strings in an object to numbers', () => {
    const obj = {
      a: '1',
      b: '2.3',
      c: 'foo',
      d: {
        e: '4',
        f: 'bar'
      }
    }
    expect(formatObjectStringNumbersToNumbers(obj)).toStrictEqual({ a: 1, b: 2.3, c: 'foo', d: { e: 4, f: 'bar' } })

    const obj2 = {
      name: 'ProductStack',
      params: {
        screen: 'Product',
        params: {
          inStock: '0',
          index: '1m',
          id: '123'
        }
      }
    }
    const expect2 = {
      name: 'ProductStack',
      params: {
        screen: 'Product',
        params: {
          inStock: 0,
          index: '1m',
          id: 123
        }
      }
    }
    expect(formatObjectStringNumbersToNumbers(obj2)).toStrictEqual(expect2)
  })
})

describe('object pick ', function() {
  it('can create a new object from by key properties ', function() {
    const obj1 = {
      foo: 'bar',
      a: '1',
      b: '2'
    }
    const obj2 = {
      foo: 'bar',
      b: '2'
    }
    expect(pickKeys(obj1, ['b', 'foo'])).toStrictEqual(obj2)

    expect(pickKeys(obj1, ['b', 'foo', 'other'])).toStrictEqual(obj2)
  })
})

describe('searchObjectByKey ', function() {
  it('can create a new object from by key properties ', function() {
    const obj1 = {
      foo: 'bar',
      items: [
        {
          blogPost: {
            name: 'name001'
          }
        }
      ]
    }
    const obj2 = {
      blogPost: {
        name: 'name002'
      }
    }
    expect(searchObjectByKey(obj1, 'blogPost')?.name).toBe('name001')
    expect(searchObjectByKey(obj2, 'blogPost')?.name).toBe('name002')
  })
})

describe('filter object by key', () => {
  const cases = [
    {
      obj: {
        utm_medium: ['11052023%20Click%20Frenzy%20Launch%20-%20In%20App'],
        utm_campaign: ['other'],
        manufacturer: 'honey',
        p: 3,
        order: 'asc'
      },
      keys: ['utm', 'manufacturer', 'p', 'order'],
      shouldInclude: false,
      expected: {}
    },
    {
      obj: {
        utm_medium: ['11052023%20Click%20Frenzy%20Launch%20-%20In%20App'],
        utm_campaign: ['other'],
        manufacturer: 'honey',
        p: 3,
        order: 'asc'
      },
      keys: ['utm'],
      shouldInclude: true,
      expected: {
        utm_medium: ['11052023%20Click%20Frenzy%20Launch%20-%20In%20App'],
        utm_campaign: ['other']
      }
    },
    {
      obj: {},
      keys: ['ut'],
      shouldInclude: true,
      expected: {}
    },
    {
      obj: {
        test: 'url'
      },
      keys: ['test'],
      shouldInclude: false,
      expected: {}
    },
    {
      obj: {
        test: 'url'
      },
      keys: undefined,
      shouldInclude: true,
      expected: {
        test: 'url'
      }
    }
  ]

  cases.forEach(({ obj, keys, shouldInclude, expected }) => {
    it(`can filter object ${obj} to ${shouldInclude ? 'include' : 'exclude'} keys ${keys}`, () => {
      expect(filterObjectByKeys(obj, keys, shouldInclude)).toStrictEqual(expected)
    })
  })
})
