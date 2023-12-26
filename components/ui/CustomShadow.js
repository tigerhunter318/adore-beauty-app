import React from 'react'
import { Shadow } from 'react-native-shadow-2'
import theme from '../../constants/theme'

/**
 * Shadow for iOS and Android based on SVG
 * https://github.com/SrBrahma/react-native-shadow-2
 *
 */

const CustomShadow = ({
  children,
  distance = 20,
  startColor = theme.black,
  finalColor = 'transparent',
  offset = [0, -2],
  radius,
  viewStyle = { alignSelf: 'stretch' },
  containerViewStyle = {}
}) => {
  if (!children) {
    return (
      <Shadow
        distance={distance}
        startColor={startColor}
        finalColor={finalColor}
        offset={offset}
        radius={radius}
        viewStyle={viewStyle}
        containerViewStyle={containerViewStyle}
      >
        <></>
      </Shadow>
    )
  }

  return (
    <Shadow
      distance={distance}
      startColor={startColor}
      finalColor={finalColor}
      offset={offset}
      radius={radius}
      viewStyle={viewStyle}
      containerViewStyle={containerViewStyle}
    >
      {children}
    </Shadow>
  )
}

export default CustomShadow
