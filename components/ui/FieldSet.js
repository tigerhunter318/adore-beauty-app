import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import theme from '../../constants/theme'
import Container from './Container'

const fieldSetStyles = {
  borderBottomWidth: 1,
  borderColor: theme.borderColor
}
const FieldSet = ({ children, style, ...rest }) => (
  <Container ph={1.5} pv={1} style={style || fieldSetStyles} {...rest}>
    {children}
  </Container>
)

export default FieldSet
