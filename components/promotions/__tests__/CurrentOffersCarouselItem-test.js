import React from 'react'
import renderer from 'react-test-renderer'
import CurrentOffersCarouselItem from '../CurrentOffersCarouselItem'

const mockData = require('./__mocks__/CurrentOffersCarouselItem.json')

it(`CurrentOffersCarouselItem renders content`, () => {
  const tree = renderer.create(<CurrentOffersCarouselItem item={mockData} />).toJSON()

  expect(tree).toMatchSnapshot()
})
