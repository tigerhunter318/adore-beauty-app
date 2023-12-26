import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Container from '../../../components/ui/Container'
import theme from '../../../constants/theme'
import Type from '../../../components/ui/Type'
import { formatCurrency } from '../../../utils/format'

const styleSheet = {
  container: {
    borderColor: theme.orange,
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
}

const CartMinSpend = ({ amount = 20, onPress }) => (
  <Container style={styleSheet.container} background={theme.backgroundLightGrey} pv={1.5} mt={-0.1} onPress={onPress}>
    <Type heading bold center size={14} color={theme.orange}>
      Our minimum spend is {formatCurrency(amount)}
    </Type>
    <Type size={14} center color={theme.orange} underline pt={0.5}>
      Keep Shopping
    </Type>
  </Container>
)

export default CartMinSpend
