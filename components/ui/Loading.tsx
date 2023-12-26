import React from 'react'
import { ActivityIndicator } from 'react-native'
import { vh } from '../../utils/dimensions'
import theme from '../../constants/theme'
import Container from './Container'
import Type from './Type'
import Lipstick from './Lipstick'

type LoadingProps = {
  animating?: boolean
  lipstick?: boolean
  size?: number | 'small' | 'large' | undefined
  screen?: boolean
  style?: {} | any
  color?: string
}

const Loading = ({
  animating = false,
  lipstick = false,
  size = 'small',
  screen = false,
  style = { height: '100%' },
  color = theme.borderColorDark,
  ...props
}: LoadingProps) => {
  const containerStyle = style || {}

  if (screen) {
    containerStyle.height = vh(65)
  }

  if (lipstick) {
    return (
      <Container justify style={containerStyle}>
        <Container align>
          <Lipstick />
          <Type semiBold style={{ position: 'absolute', bottom: 60, color: theme.black60 }}>
            Loading . . .
          </Type>
        </Container>
      </Container>
    )
  }

  return <ActivityIndicator size={size} color={color} animating={animating} {...props} />
}

export default Loading
