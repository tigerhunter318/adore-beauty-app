import React from 'react'
import renderer from 'react-test-renderer'
import { CartPriceBarGiftCertificatesItem } from '../CartPriceBarGiftCertificates'

it(`CartPriceBarGiftCertificatesItem renders content`, () => {
  const item = {
    code: '4P9-KO9-7B7-93A',
    balance: '1000000.0000',
    expiry_date: '14/09/27'
  }
  const tree = renderer.create(<CartPriceBarGiftCertificatesItem item={item} />).toJSON()

  expect(tree).toMatchSnapshot()
})
