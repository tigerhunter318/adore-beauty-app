// @ts-nocheck
import React from 'react'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import Type from './Type'
import theme from '../../constants/theme'
import Icon from './Icon'

const styleSheet = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.borderColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedCircle: {
    backgroundColor: theme.black,
    borderColor: theme.black
  },
  icon: {},
  text: {
    marginLeft: 10
  }
}
type PressEventProps = { checked?: boolean; name?: string; id?: string }
export type RadioInputProps = {
  onPress?: (params: PressEventProps) => void
  children?: React.ReactNode
  name?: string
  id?: string
  label?: string | React.ReactNode
  style?: StyleProp<ViewStyle> | any
  checked?: boolean
  disabled?: boolean
}
const RadioInput = ({ onPress, children, name, id, label, style = {}, checked, disabled }: RadioInputProps) => {
  const handlePress = () => {
    if (onPress && !disabled) {
      onPress({ checked: !checked, name, id })
    }
  }

  const component = (
    <>
      <View style={[styleSheet.circle, checked && styleSheet.checkedCircle]}>
        {checked && <Icon type="material" name="check" color={theme.white} size={16} />}
      </View>
      {label && (
        <Type semiBold={checked} style={[styleSheet.text, style.text]}>
          {label}
        </Type>
      )}
      {children}
    </>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styleSheet.container, { opacity: disabled ? 0.2 : undefined }, style.container]}
        onPress={handlePress}
        disabled={disabled}
      >
        {component}
      </TouchableOpacity>
    )
  }
  return <View style={[styleSheet.container, style.container]}>{component}</View>
}

export default RadioInput
