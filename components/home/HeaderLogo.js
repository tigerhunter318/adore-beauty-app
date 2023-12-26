import React from 'react'
import { Image } from 'react-native'

const stylesheet = {
  logo: {
    width: 312 / 2,
    height: 38 / 2,
    zIndex: 2,
    position: 'relative'
  }
}

const HeaderLogo = ({ source }) => {
  const imageSource = typeof source === 'string' && source.includes('http') ? { uri: source } : source
  return <Image source={imageSource} style={stylesheet.logo} />
}

export default HeaderLogo
