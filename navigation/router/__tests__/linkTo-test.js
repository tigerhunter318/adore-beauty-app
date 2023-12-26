import linkTo from '../linkTo'

const mockState = require('../__mocks__/mockState-ShopCategoryProducts.json')

const navigation = {
  dispatch: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: () => mockState
}

describe('Test cases linkTo', () => {
  it('can create a navigation action to a screenPath and reset existing route params', async () => {
    const screenPath = 'MainTab/Shop/ShopCategoryProducts?url=make-up&foo=bar'
    const expectedResult = {
      type: 'NAVIGATE',
      payload: {
        name: 'MainTab',
        params: {
          initial: true,
          screen: 'Shop',
          state: undefined,
          params: {
            initial: true,
            screen: 'ShopCategoryProducts',
            state: undefined,
            params: {
              comestri_id: '',
              fromScreen: '',
              fromScreenPath: '',
              id: '',
              items: '',
              name: '',
              parentScreen: '',
              sort_order: '',
              foo: 'bar',
              url: 'make-up'
            }
          }
        }
      }
    }

    const action = linkTo({ screenPath, navigation })
    expect(action).toEqual(expectedResult)
  })

  it('can create a navigation action to a screenPath and reset existing route params', async () => {
    const screenPath = 'MainTab/Shop/ShopCategoryProducts'
    const params = {
      url: '/skin-care.html'
    }
    const expectedResult = {
      type: 'NAVIGATE',
      payload: {
        name: 'MainTab',
        params: {
          initial: true,
          screen: 'Shop',
          state: undefined,
          params: {
            initial: true,
            screen: 'ShopCategoryProducts',
            state: undefined,
            params: {
              comestri_id: '',
              fromScreen: '',
              fromScreenPath: '',
              id: '',
              items: '',
              name: '',
              parentScreen: '',
              sort_order: '',
              url: '/skin-care.html'
            }
          }
        }
      }
    }

    const action = linkTo({ screenPath, navigation, params })
    expect(action).toEqual(expectedResult)
  })
})
