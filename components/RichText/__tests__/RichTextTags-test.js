import React from 'react'
import renderer from 'react-test-renderer'
import HTMLView from 'react-native-htmlview'
import { fontStyles } from '../../../constants/fontStyles'
import RichTextHTag from '../RichTextHTag'

const renderHtmlView = ({ html, isNested = true, styleProps }) => {
  const onLinkPress = jest.fn()
  return (
    <HTMLView
      value={html}
      addLineBreaks={false}
      renderNode={(node, index) => (
        <RichTextHTag
          node={node}
          key={`htag-${index}`}
          isNested={isNested}
          styleProps={styleProps}
          onLinkPress={onLinkPress}
        />
      )}
    />
  )
}

it(`RichTextHTag renders H1 tag`, () => {
  const html = '<h1>lorem ipsum h1</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h1 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H2 tag`, () => {
  const html = '<h1>lorem ipsum h2</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h2 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H3 tag`, () => {
  const html = '<h1>lorem ipsum h3</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h3 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H4 tag`, () => {
  const html = '<h1>lorem ipsum h4</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h4 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H5 tag`, () => {
  const html = '<h1>lorem ipsum h5</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h5 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H6 tag`, () => {
  const html = '<h1>lorem ipsum h6</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h6 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H tag with nested strong tag`, () => {
  const html = '<h1><strong>h1</strong> tag with nested strong tag</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h6 })).toJSON()
  expect(tree).toMatchSnapshot()
})

it(`RichTextHTag renders H tag with nested strong and span tag`, () => {
  const html = '<h1><strong>h2</strong> tag with nested strong and <span>span</span> tag</h1>'
  const tree = renderer.create(renderHtmlView({ html, styleProps: fontStyles.h5 })).toJSON()
  expect(tree).toMatchSnapshot()
})
