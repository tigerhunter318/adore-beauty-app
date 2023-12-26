import React, { useEffect } from 'react'
import { Animated } from 'react-native'
import { SocietyLogoReverse } from './SocietyAssets'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Container from '../ui/Container'
import { animate, useAnimationRef } from '../../utils/animate'

const SocietyFooterBarTitle = ({ isOpen }) => {
  const rotateRef = useAnimationRef(0)
  useEffect(() => {
    animate(rotateRef, { toValue: isOpen ? 1 : 0, duration: 200 })
  }, [isOpen])

  const rotate = rotateRef.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg']
  })

  return (
    <Container background="black" style={{ height: 44 }}>
      <Container center flex={1} style={{ paddingTop: 1 }}>
        <SocietyLogoReverse width={140} height={44} />
      </Container>
      <Animated.View
        style={{
          transform: [{ rotate }],
          position: 'absolute',
          right: 26,
          top: 12
        }}
      >
        <AdoreSvgIcon name="angle-down" color={theme.white} width={12} height={16} />
      </Animated.View>
    </Container>
  )
}

export default SocietyFooterBarTitle
