import React from 'react'
import renderer from 'react-test-renderer'
import PromoBannerItem from '../PromoBannerItem'

const mockData = require('./__mocks__/PromoBannerItem.json')

it(`PromoBannerItem renders content`, () => {
  const tree = renderer.create(<PromoBannerItem item={mockData} isLoading={false} />).toJSON()

  expect(tree).toMatchSnapshot()
})
