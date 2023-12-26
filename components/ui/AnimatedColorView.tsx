import React from 'react'
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import theme from '../../constants/theme'

type AnimatedColorViewProps = {
  active: boolean
  styles?: {}
  children?: React.ReactNode
  inactiveColor: string
  activeColor: string
  duration?: number
}

const AnimatedColorView = ({
  active,
  styles = {},
  children = null,
  inactiveColor = theme.white,
  activeColor = theme.darkRed,
  duration = 300
}: AnimatedColorViewProps) => {
  const progress = useDerivedValue(() => withTiming(active ? 1 : 0, { duration }))

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [inactiveColor, activeColor])

    return { backgroundColor }
  })

  return <Animated.View style={[backgroundStyle, styles]}>{children}</Animated.View>
}

export default AnimatedColorView
