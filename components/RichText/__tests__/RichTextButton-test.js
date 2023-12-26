import React from 'react'
import renderer from 'react-test-renderer'
import { getArticleContent } from './__mocks__/helper'
import RichTextButton from '../RichTextButton'

it(`RichTextButton renders for alterna-air-dry-balm-review`, () => {
  const parsedContent = getArticleContent('button', 'alterna-air-dry-balm-review')
  const tree = renderer.create(<RichTextButton content={parsedContent} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextButton renders for what-is-a-serum`, () => {
  const parsedContent = getArticleContent('button', 'what-is-a-serum')
  const tree = renderer.create(<RichTextButton content={parsedContent} />).toJSON()
  expect(tree).toMatchSnapshot()
})
