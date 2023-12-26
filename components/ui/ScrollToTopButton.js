import React, { useEffect } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { animate, useAnimationRef } from '../../utils/animate'
import Container from './Container'
import theme from '../../constants/theme'
import Icon from './Icon'

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    zIndex: 9
  },
  innerContainer: {
    backgroundColor: theme.black80,
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ScrollToTopButton = ({ isVisible, onPress, style, containerStyle = {} }) => {
  const translateX = useAnimationRef(100)

  useEffect(() => {
    if (isVisible) {
      animate(translateX, { toValue: 0 })
    } else {
      animate(translateX, { toValue: 100, duration: 150 })
    }
  }, [isVisible])

  return (
    <Animated.View style={[{ transform: [{ translateX }] }, styles.outerContainer, containerStyle]}>
      <Container style={[styles.innerContainer, style]} onPress={onPress}>
        <Icon name="chevron-up" type="materialcommunityicons" color={theme.white} size={36} />
      </Container>
    </Animated.View>
  )
}
export default ScrollToTopButton
