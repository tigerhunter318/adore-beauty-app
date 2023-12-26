import React from 'react'
import Animated from 'react-native-reanimated'
import { StyleProp, ViewProps, ViewStyle } from 'react-native'
import { useStylesAnimation } from '../../../utils/animate'

type FadeViewProps = {
  style?: StyleProp<ViewStyle>
  active: boolean
  duration?: number
  children?: React.ReactNode
} & ViewProps

const FadeView = ({ active, duration = 200, children, style, ...props }: FadeViewProps) => {
  const animatedStyle = useStylesAnimation({
    active,
    duration,
    initialStyle: {
      opacity: 0
    },
    activeStyle: {
      opacity: 1
    }
  })

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  )
}

export default FadeView
