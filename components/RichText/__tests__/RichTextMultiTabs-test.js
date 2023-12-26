import React from 'react'
import renderer from 'react-test-renderer'
import RichTextMultiTabs from '../RichTextMultiTabs'

const mockNode = require('./__mocks__/RichTextMultiTabs-node.json')

it(`RichTextMultiTabs renders multiple tabs with accordion`, () => {
  const tree = renderer.create(<RichTextMultiTabs content={mockNode} />).toJSON()

  expect(tree).toMatchSnapshot()
})
