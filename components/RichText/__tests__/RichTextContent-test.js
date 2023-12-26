import React from 'react'
import renderer from 'react-test-renderer'
import RichTextEmbed from '../RichTextEmbed'
import { getArticleContent } from './__mocks__/helper'
import RichTextContent from '../RichTextContent'

it(`RichTextContent renders for alterna-air-dry-balm-review block 0`, () => {
  const parsedContent = getArticleContent(0)
  const imageProps = {}
  const tree = renderer.create(<RichTextContent imageProps={imageProps} content={parsedContent.html} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextContent renders for alterna-air-dry-balm-review block 2`, () => {
  const parsedContent = getArticleContent(2)
  const imageProps = {}
  const tree = renderer.create(<RichTextContent imageProps={imageProps} content={parsedContent.html} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextContent renders for alterna-air-dry-balm-review block 4`, () => {
  const parsedContent = getArticleContent(4)
  const imageProps = {}
  const tree = renderer.create(<RichTextContent imageProps={imageProps} content={parsedContent.html} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextContent renders for alterna-air-dry-balm-review block 12 with bullet list`, () => {
  const parsedContent = getArticleContent(12)
  const imageProps = {}
  const tree = renderer.create(<RichTextContent imageProps={imageProps} content={parsedContent.html} />).toJSON()

  expect(tree).toMatchSnapshot()
})

it(`RichTextContent renders for what-is-a-serum block 10 with inline image`, () => {
  const parsedContent = getArticleContent(10, 'what-is-a-serum')
  const imageProps = {}
  const tree = renderer.create(<RichTextContent imageProps={imageProps} content={parsedContent.html} />).toJSON()

  expect(tree).toMatchSnapshot()
})
//
// it(`RichTextEmbed renders what-is-a-serum instagram embed`, () => {
//   const parsedContent = getArticleContent(7, 'what-is-a-serum')
//   const tree = renderer.create(<RichTextEmbed content={parsedContent} />).toJSON()
//
//   expect(tree).toMatchSnapshot()
// })
