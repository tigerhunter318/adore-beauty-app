import React from 'react'
import { View } from 'react-native'
import Type from './Type'
import Colors from '../../constants/Colors'

const styleSheet = {
  badgeContainer: {
    position: 'absolute',
    right: -10,
    top: -3,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const IconBadge = ({ text, fontSize = 11, width = 20, style = {} }) => (
  <View style={[styleSheet.badgeContainer, { width, height: width, borderRadius: width * 0.5, ...style }]}>
    <Type size={fontSize} bold center color="white">
      {text}
    </Type>
  </View>
)

export default IconBadge
