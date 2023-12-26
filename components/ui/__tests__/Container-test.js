import React from 'react'
import renderer from 'react-test-renderer'

import Container from '../Container'

it(`renders correctly`, () => {
  const tree = renderer
    .create(<Container m={1} p={1} mt={1} pt={1} border="red" rows center borderRadius={5} onPress={() => {}} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
