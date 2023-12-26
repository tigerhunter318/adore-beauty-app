import React from 'react'
import renderer from 'react-test-renderer'
import ShopPromoItem from '../ShopPromoItem'

const mockData = require('./__mocks__/ShopPromoItem.json')

it(`ShopPromoItem renders content`, () => {
  const tree = renderer.create(<ShopPromoItem item={mockData} onPromoPress={jest.fn()} index={0} />).toJSON()

  expect(tree).toMatchSnapshot()
})
