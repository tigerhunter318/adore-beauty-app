import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Type from '../ui/Type'

const STATUSES = [
  { name: 'PENDING' },
  { name: 'SHIPPED', background: theme.orange, text: theme.white },
  { name: 'PARTIALLY_SHIPPED', background: theme.orange, text: theme.white },
  { name: 'REFUNDED', background: theme.lightOrange, text: theme.black },
  { name: 'CANCELLED', background: theme.lightOrange, text: theme.black },
  { name: 'DECLINED_SELLER', background: theme.black, text: theme.white },
  { name: 'AWAITING_PAYMENT' },
  { name: 'AWAITING_PICKUP' },
  { name: 'AWAITING_SHIPMENT' },
  { name: 'AWAITING_SHIPMENT' },
  { name: 'COMPLETED', background: theme.black, text: theme.white },
  { name: 'AWAITING_FULFILLMENT' },
  { name: 'MANUAL_VERIFICATION_REQUIRED', background: theme.black, text: theme.white },
  { name: 'DISPUTED', background: theme.black, text: theme.white },
  { name: 'PARTIALLY_REFUNDED', background: theme.lightOrange, text: theme.black }
]

const OrderStatusLabel = ({ status, fontSize = 8, ...rest }) => {
  const statusType = STATUSES.find(item => item.name === status.toUpperCase().replace(/\s/gi, '_'))

  const color = {
    background: statusType?.background ?? theme.lightGrey,
    text: statusType?.text ?? theme.black
  }

  return (
    <Container ml={1} fontSize={8} bold pv={0.5} ph={0.5} borderRadius={2} background={color.background} {...rest}>
      <Type bold size={fontSize} center color={color.text}>
        {status.replace(/_/gi, ' ')}
      </Type>
    </Container>
  )
}

export default OrderStatusLabel
