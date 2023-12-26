import React from 'react'
import { View } from 'react-native'

import { toPascalCase } from '../../utils/case'
/* eslint-disable global-require */
const icons = {
  visa: {
    Svg: require('../../assets/payments/visa.svg').default,
    width: 45,
    height: 14
  },
  amex: {
    Svg: require('../../assets/payments/amex.svg').default,
    width: 29,
    height: 24
  },
  afterpay: {
    Svg: require('../../assets/payments/afterpay.svg').default,
    width: 32,
    height: 18
  },
  applepay: {
    Svg: require('../../assets/payments/applepay.svg').default,
    width: 52,
    height: 24
  },
  googlepay: {
    Svg: require('../../assets/payments/googlepay.svg').default,
    width: 40,
    height: 24
  },
  mcard: {
    Svg: require('../../assets/payments/mcard.svg').default,
    width: 36,
    height: 21
  },
  ccard: {
    Svg: require('../../assets/payments/ccard.svg').default,
    width: 31,
    height: 24
  },
  ccpaypal: {
    Svg: require('../../assets/payments/ccpaypal.svg').default,
    width: 31,
    height: 24
  },
  paypal: {
    Svg: require('../../assets/payments/paypal.svg').default,
    width: 52,
    height: 23
  },
  klarna: {
    Svg: require('../../assets/payments/klarna.svg').default,
    width: 45,
    height: 25
  }
}

const PaymentIcon = ({ name = 'Visa', ...rest }) => {
  const { Svg, width, height } = icons[name.toLowerCase()]
  if (Svg) {
    return <Svg {...rest} width={width} height={height} />
  }
  console.warn('PaymentIcon', 'not found', name)
  return <View />
}

export default PaymentIcon
