// @ts-nocheck
import React from 'react'
import { View } from 'react-native'
import Container from './Container'
import Type from './Type'
import theme from '../../constants/theme'
import Loading from './Loading'
import Icon from './Icon'

const styleSheet = {
  container: {}
}

const Loader = ({ color = theme.lightBlack, size = 'large' }) => (
  <Container fill style={styleSheet.loader} justify>
    <Container animation="zoomIn" animationProps={{ duration: 300 }}>
      <Loading color={color} size={size} animating />
    </Container>
  </Container>
)
type CustomButtonProps = {
  disabled?: any
  inactive?: any
  textStyle?: any
  bold?: any
  fontSize?: any
  iconSize?: any
  width?: any
  maxWidth?: any
  alignSelf?: any
  pv?: any
  ph?: any
  style?: any
  color?: any
  borderRadius?: any
  textProps?: any
  children?: any
  onPress?: any
  loading?: any
  semiBold?: any
  background?: any
  label?: any
  icon?: any
  iconRight?: any
  iconType?: any
  iconStyle?: any
  loaderProps?: any
  uppercase?: any
  height?: any
  [p: string]: any
}
const CustomButton = ({
  disabled,
  inactive,
  textStyle = {},
  bold,
  fontSize = 14,
  iconSize = undefined,
  width,
  maxWidth,
  alignSelf,
  pv = 1,
  ph = 1.5,
  style = {},
  color = undefined,
  borderRadius,
  textProps,
  children,
  onPress,
  loading,
  semiBold,
  background = 'black',
  label = undefined,
  icon = undefined,
  iconRight = undefined,
  iconType = 'adoresvg',
  iconStyle = {},
  loaderProps = {},
  uppercase = true,
  height = undefined,
  ...rest
}: CustomButtonProps) => {
  const parentContainerStyle = { opacity: 1 }

  if (disabled || inactive) {
    parentContainerStyle.opacity = 0.7
  }
  if (loading) {
    parentContainerStyle.opacity = 0.2
  }
  if (background === theme.orange || background === 'black') {
    textStyle.color = textStyle.color || 'white'
  }
  if (background === 'white') {
    rest.border = rest.border || 'black'
    textStyle.color = textStyle.color || 'black'
  }
  if (color) {
    textStyle.color = color
    rest.border = color
  }
  const containerStyle = { ...style }

  if (width !== undefined) {
    containerStyle.width = width
  }
  if (maxWidth !== undefined) {
    containerStyle.maxWidth = maxWidth
  }
  if (alignSelf !== undefined) {
    containerStyle.alignSelf = alignSelf
  }
  if (borderRadius !== undefined) {
    containerStyle.borderRadius = typeof borderRadius === 'boolean' ? 2 : borderRadius
  }
  if (height !== undefined) {
    containerStyle.height = height
  }
  if (loading) {
    textStyle.opacity = 0
  }
  let iconContainerProps = {}
  let iconComponent = null
  if (icon) {
    iconContainerProps = { justify: 'center', align: 'center', rows: true }
    iconComponent = (
      <Container ml={iconRight ? 1 : -1} mr={iconRight ? -1 : 1} style={iconStyle}>
        <Icon name={icon} type={iconType} color={textStyle.color} size={iconSize || fontSize} />
      </Container>
    )
  }
  const component = (
    <Container
      onPress={disabled ? undefined : onPress}
      background={background}
      pv={pv}
      ph={ph}
      style={containerStyle}
      {...iconContainerProps}
      {...rest}
    >
      {!iconRight && iconComponent}
      {(label || typeof children === 'string') && (
        <Type
          center
          heading={uppercase}
          semiBold={semiBold}
          bold={bold}
          size={fontSize}
          style={textStyle}
          {...textProps}
        >
          {label || children}
        </Type>
      )}
      {typeof children !== 'string' && children}
      {iconRight && iconComponent}
    </Container>
  )

  return (
    <View style={{ width: containerStyle.width }}>
      <Container style={parentContainerStyle}>{component}</Container>
      {loading && <Loader size="small" {...loaderProps} />}
    </View>
  )
}

// CustomButton.propTypes = {
//   color: PropTypes.oneOf(['black', 'white', 'red']),
//   textStyle: PropTypes.object,
//   textProps: PropTypes.object,
//   onPress: PropTypes.func,
//   background: PropTypes.string,
//   children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
// }

export default CustomButton
