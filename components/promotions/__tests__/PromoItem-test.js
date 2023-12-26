import React from 'react'
import renderer from 'react-test-renderer'
import PromoItem from '../PromoItem'

const mockData = require('./__mocks__/PromoItem.json')

it(`PromoItem renders content`, () => {
  const tree = renderer.create(<PromoItem item={mockData} />).toJSON()

  expect(tree).toMatchSnapshot()
})
