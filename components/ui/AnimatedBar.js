import React from 'react'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useTranslateAnimation } from '../../utils/animate'
import FooterBarButton from './FooterBarButton'

const AnimatedBar = ({
  title,
  onPress = () => {},
  hasClose,
  isVisible = false,
  style = {},
  initialSharedValue = 0,
  contentHeight,
  containerStyle = { position: 'relative', bottom: 'auto' }
}) => {
  const animationRef = useSharedValue(initialSharedValue)
  const animatedStyle = useTranslateAnimation({ animationRef, isVisible })
  const opacity = hasClose ? 1 : 0.85

  return (
    <Animated.View style={[animatedStyle, { opacity }, style]}>
      <FooterBarButton
        title={title}
        onPress={onPress}
        hasClose={hasClose}
        containerStyle={containerStyle}
        contentHeight={contentHeight}
      />
    </Animated.View>
  )
}

export default AnimatedBar
