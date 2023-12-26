import React from 'react'
import Animated, { useSharedValue } from 'react-native-reanimated'
import theme from '../../constants/theme'
import Container from './Container'
import Icon from './Icon'
import { isIos } from '../../utils/device'
import { useTranslateAnimation } from '../../utils/animate'
import Type from './Type'

const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const ShareButton = ({ onPress = () => {}, isVisible = true, ...props }) => {
  const animationRef = useSharedValue(100)
  const animatedStyle = useTranslateAnimation({
    animationType: 'translateX',
    animationRef,
    isVisible
  })

  return (
    <Animated.View style={[styles.container, props.style, animatedStyle]}>
      <Container center onPress={onPress}>
        {isIos() ? (
          <Icon name="share-apple" color={theme.backgroundGrey} type="evil" size={29} />
        ) : (
          <Icon name="share" color={theme.backgroundGrey} type="material" size={23} />
        )}
        <Type mt={0.2} size={9} semiBold letterSpacing={0.5} color={theme.backgroundGrey} heading>
          Share
        </Type>
      </Container>
    </Animated.View>
  )
}

export default ShareButton
