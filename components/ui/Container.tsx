import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'
import theme from '../../constants/theme'

const styleSheet = {}

const centerStyle = {
  alignItems: 'center'
}
const guttersStyle = {
  paddingLeft: 20,
  paddingRight: 20
}
const rowStyle = {
  flexDirection: 'row'
}

// @ts-ignore
const hasValue = val => val !== undefined && val !== null

// @ts-ignore
export const spacingStyle = ({ defaultStyle, mt, mb, ml, mr, p, pv, ph, pt, pb, pl, pr, zIndex, opacity, height }) => {
  let style = { ...defaultStyle }
  if (hasValue(mt)) {
    style = { ...style, marginTop: mt * 10 }
  }
  if (hasValue(mb)) {
    style = { ...style, marginBottom: mb * 10 }
  }
  if (hasValue(ml)) {
    style = { ...style, marginLeft: ml * 10 }
  }
  if (hasValue(mr)) {
    style = { ...style, marginRight: mr * 10 }
  }
  if (hasValue(p)) {
    style = { ...style, padding: p * 10 }
  }
  if (hasValue(pv)) {
    style = { ...style, paddingTop: pv * 10, paddingBottom: pv * 10 }
  }
  if (hasValue(ph)) {
    style = { ...style, paddingLeft: ph * 10, paddingRight: ph * 10 }
  }
  if (hasValue(pt)) {
    style = { ...style, paddingTop: pt * 10 }
  }
  if (hasValue(pb)) {
    style = { ...style, paddingBottom: pb * 10 }
  }
  if (hasValue(pl)) {
    style = { ...style, paddingLeft: pl * 10 }
  }
  if (hasValue(pr)) {
    style = { ...style, paddingRight: pr * 10 }
  }
  if (hasValue(zIndex)) {
    style = { ...style, zIndex }
  }
  if (hasValue(opacity)) {
    style = { ...style, opacity }
  }
  if (hasValue(height)) {
    style = { ...style, height }
  }
  return style
}

export type ContainerProps = {
  style?: {}
  center?: any
  pv?: any
  p?: any
  ph?: any
  pt?: any
  pb?: any
  pl?: any
  pr?: any
  gutter?: any
  rows?: any
  mt?: any
  mb?: any
  mr?: any
  border?: any
  flex?: any
  flexGrow?: any
  align?: any
  justify?: any
  fill?: any
  background?: any
  borderRadius?: any
  borderWidth?: any
  children?: any
  animation?: any
  transition?: any
  animationProps?: any
  zIndex?: any
  opacity?: any
  inset?: any
  [p: string]: any
}

/**
 *
 * @param styles
 * @param center
 * @param pv padding vertical
 * @param p padding
 * @param ph padding horizontal
 * @param gutter
 * @param rows
 * @param mb
 * @param children
 * @param props
 * @returns {*}
 * @constructor
 */
const Container = ({
  style = {},
  center = false,
  pv = null,
  p = null,
  ph = null,
  pt = null,
  pb = null,
  pl = null,
  pr = null,
  gutter = false,
  rows = false,
  mt = null,
  mb = null,
  mr = null,
  border = null,
  flex = null,
  flexGrow = null,
  align = null,
  justify = null,
  fill = null,
  background = null,
  borderRadius = null,
  borderWidth = null,
  children,
  animation,
  transition,
  animationProps = {},
  zIndex,
  opacity,
  inset,
  ...rest
}: ContainerProps): JSX.Element => {
  let defaultStyle = { ...styleSheet }
  if (center) {
    defaultStyle = { ...defaultStyle, ...centerStyle }
  }
  if (gutter) {
    defaultStyle = { ...defaultStyle, ...guttersStyle }
  }
  if (rows) {
    defaultStyle = { ...defaultStyle, ...rowStyle }
  }

  if (flex !== null) {
    defaultStyle = { ...defaultStyle, flex }
  }
  if (flexGrow !== null) {
    defaultStyle = { ...defaultStyle, flexGrow: typeof flexGrow === 'number' ? flexGrow : 1 }
  }
  if (border !== null) {
    defaultStyle = { ...defaultStyle, borderWidth: 1, borderColor: typeof border === 'string' ? border : 'black' }
  }
  if (borderRadius !== null) {
    defaultStyle = { ...defaultStyle, borderRadius: typeof borderRadius === 'number' ? borderRadius : 1 }
  }
  if (borderWidth !== null) {
    defaultStyle = { ...defaultStyle, borderWidth: typeof borderWidth === 'number' ? borderWidth : 1 }
  }
  if (align !== null) {
    defaultStyle = { ...defaultStyle, alignItems: typeof align === 'string' ? align : 'center' }
  }
  if (justify !== null) {
    defaultStyle = { ...defaultStyle, justifyContent: typeof justify === 'string' ? justify : 'center' }
  }
  if (fill !== null) {
    defaultStyle = { ...defaultStyle, ...StyleSheet.absoluteFillObject }
  }
  if (background !== null) {
    defaultStyle = {
      ...defaultStyle,
      backgroundColor: typeof background === 'string' ? background : theme.borderColor
    }
  }
  if (inset !== undefined) {
    const val = parseInt(inset) || 0
    defaultStyle = {
      ...defaultStyle,
      position: 'absolute',
      top: val,
      bottom: val,
      left: val,
      right: val
    }
  }

  defaultStyle = spacingStyle({
    defaultStyle,
    // @ts-ignore
    style,
    // @ts-ignore
    center,
    // @ts-ignore
    pv,
    p,
    ph,
    pt,
    pb,
    pl,
    pr,
    gutter,
    rows,
    mt,
    mb,
    mr,
    border,
    flex,
    align,
    justify,
    zIndex,
    opacity,
    ...rest
  })
  // style={{alignItems:'center'}}

  let component = (
    <View style={[defaultStyle, style]} {...rest}>
      {children}
    </View>
  )

  if (rest.onPress || rest.onPressIn || rest.onPressOut) {
    component = (
      <TouchableOpacity style={[defaultStyle, style]} {...rest}>
        {children}
      </TouchableOpacity>
    )
  }

  if (animation || transition) {
    return (
      // @ts-ignore
      <Animatable.View animation={animation} transition={transition} {...animationProps}>
        {component}
      </Animatable.View>
    )
  }

  return component
}

export default Container
