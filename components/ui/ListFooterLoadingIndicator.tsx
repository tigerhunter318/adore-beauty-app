import React from 'react'
import Animated from 'react-native-reanimated'
import theme from '../../constants/theme'
import Loading from './Loading'
import { useStylesAnimation } from '../../utils/animate'

const ListFooterLoadingIndicator = ({ active = true }: { active?: boolean }) => {
  const animatedStyle = useStylesAnimation({
    active,
    duration: 150,
    initialStyle: {
      height: 0,
      opacity: 0
    },
    activeStyle: {
      height: 60,
      opacity: 1
    }
  })

  return (
    <Animated.View
      style={[
        animatedStyle,
        { backgroundColor: theme.white, justifyContent: 'center', position: 'absolute', top: 0, width: '100%' }
      ]}
    >
      <Loading animating />
    </Animated.View>
  )
}

export default ListFooterLoadingIndicator
