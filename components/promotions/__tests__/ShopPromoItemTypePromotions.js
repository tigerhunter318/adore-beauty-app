import React from 'react'
import renderer from 'react-test-renderer'
import ShopPromoItem from '../../shop/ShopPromoItem'

const mockData = require('./__mocks__/ShopPromoItemTypePromotions.json')

it(`ShopPromoItemTypePromotions renders content`, () => {
  const tree = renderer.create(<ShopPromoItem item={mockData} />).toJSON()

  expect(tree).toMatchSnapshot()
})
