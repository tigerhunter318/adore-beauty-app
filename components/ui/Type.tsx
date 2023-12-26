import React from 'react'
import { Text, TextStyle } from 'react-native'
import { capitalize } from '../../utils/case'
import { getIn } from '../../utils/getIn'
import { ContainerProps, spacingStyle } from './Container'

export const DEFAULT_FONT = 'Montserrat'
export const DEFAULT_FONT_FAMILY = `${DEFAULT_FONT}-Regular`

type TypeProps = ContainerProps & {
  font?: any
  weight?: any
  heading?: any
  center?: any
  bold?: any
  color?: any
  backgroundColor?: any
  size?: any
  uppercase?: any
  lowercase?: any
  italic?: any
  left?: any
  right?: any
  light?: any
  semiBold?: any
  numberOfLines?: any
  underline?: any
  lineHeight?: any
  letterSpacing?: any
  lineThrough?: any
  style?: any
  css?: any
  [p: string]: any
}

// @ts-ignore
const Type = ({
  font = DEFAULT_FONT,
  weight = 'Regular',
  heading = false,
  center,
  bold,
  color,
  backgroundColor,
  size,
  uppercase,
  lowercase,
  italic,
  left,
  right,
  light,
  semiBold,
  numberOfLines,
  underline,
  lineHeight,
  letterSpacing,
  lineThrough,
  style,
  css,
  ...props
}: TypeProps) => {
  const defaults: TextStyle = {
    // fontWeight: 'normal'
  }
  if (italic) {
    if (bold) {
      defaults.fontFamily = `${font}-BoldItalic`
    } else if (light) {
      defaults.fontFamily = `${font}-LightItalic`
    } else if (weight === 'medium') {
      defaults.fontFamily = `${font}-MediumItalic`
    } else {
      defaults.fontFamily = `${font}-Italic`
    }
  } else if (bold) {
    defaults.fontFamily = `${font}-Bold`
  } else if (light) {
    defaults.fontFamily = `${font}-Light`
  } else if (semiBold) {
    defaults.fontFamily = `${font}-SemiBold`
  } else if (getIn(props, 'style.1.fontWeight')) {
    defaults.fontFamily = `${font}-${capitalize(getIn(props, 'style.1.fontWeight'))}`
  } else if (getIn(props, 'style.0.fontWeight')) {
    defaults.fontFamily = `${font}-${capitalize(getIn(props, 'style.0.fontWeight'))}`
  } else {
    defaults.fontFamily = `${font}-${capitalize(weight)}`
  }

  // @ts-ignore
  defaults.fontFamily = defaults.fontFamily.replace('normal', 'Regular', 'gi')
  // @ts-ignore
  defaults.fontFamily = defaults.fontFamily.replace('Normal', 'Regular', 'gi')

  if (size) {
    defaults.fontSize = size
  }
  if (color) {
    defaults.color = color
  }
  if (backgroundColor) {
    defaults.backgroundColor = backgroundColor
  }
  if (heading) {
    defaults.textTransform = 'uppercase'
  }
  if (center) {
    defaults.textAlign = 'center'
  }
  if (left) {
    defaults.textAlign = 'left'
  }
  if (right) {
    defaults.textAlign = 'right'
  }
  if (underline) {
    defaults.textDecorationLine = 'underline'
  }
  if (lineThrough) {
    defaults.textDecorationLine = 'line-through'
  }
  if (lineHeight) {
    defaults.lineHeight = lineHeight
  }
  if (letterSpacing) {
    defaults.letterSpacing = letterSpacing
  }
  if (uppercase) {
    defaults.textTransform = 'uppercase'
  }
  if (lowercase) {
    defaults.textTransform = 'lowercase'
  }
  // @ts-ignore
  const mergedStyle = spacingStyle({ defaultStyle: defaults, ...props })

  return (
    <Text
      {...props}
      allowFontScaling={props.allowFontScaling || false}
      numberOfLines={numberOfLines}
      style={[mergedStyle, style]}
    />
  )
}

export default Type
