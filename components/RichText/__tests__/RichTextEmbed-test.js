import React from 'react'
import renderer from 'react-test-renderer'
import RichTextEmbed from '../RichTextEmbed'
import { getArticleContent } from './__mocks__/helper'

it(`RichTextEmbed renders alterna-air-dry-balm-review instagram embed`, () => {
  const parsedContent = getArticleContent(3, 'alterna-air-dry-balm-review')
  const tree = renderer.create(<RichTextEmbed content={parsedContent} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextEmbed renders what-is-a-serum instagram embed`, () => {
  const parsedContent = getArticleContent(7, 'what-is-a-serum')
  const tree = renderer.create(<RichTextEmbed content={parsedContent} />).toJSON()

  expect(tree).toMatchSnapshot()
})
