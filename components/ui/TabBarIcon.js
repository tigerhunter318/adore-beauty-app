import React from 'react'
import { View, StyleSheet } from 'react-native'
import theme from '../../constants/theme'
import AdoreSvgIcon from './AdoreSvgIcon'
import IconBadge from './IconBadge'

const styles = StyleSheet.create({ marginBottom: -3 })

const TabBarIcon = ({ name, style, badgeText, size = 25, focused = false, testID }) => (
  <View testID={testID} style={{ position: 'absolute', top: 5, height: 25, justifyContent: 'center' }}>
    <AdoreSvgIcon
      name={name}
      width={size}
      height={size}
      style={[styles, style]}
      color={focused ? theme.black : theme.textGrey}
    />
    {!!badgeText && <IconBadge text={badgeText} />}
  </View>
)
export default TabBarIcon
