import React from 'react'
import renderer from 'react-test-renderer'
import { fontStyles } from '../../../constants/fontStyles'
import RichTextPTag from '../RichTextPTag'

const mockNode = require('./__mocks__/RichTextPTag-node.json')

it(`RichTextPTag renders P tag`, () => {
  const styleProps = fontStyles.p
  const onRedirect = jest.fn()
  const onProductPress = jest.fn()
  const content = 'test'

  const tree = renderer
    .create(
      <RichTextPTag
        node={mockNode}
        content={content}
        styleProps={styleProps}
        onRedirect={onRedirect}
        onProductPress={onProductPress}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
