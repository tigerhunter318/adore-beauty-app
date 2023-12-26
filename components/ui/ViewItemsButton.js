import React from 'react'
import { View } from 'react-native'
import CustomButton from './CustomButton'
import theme from '../../constants/theme'
import { isIos } from '../../utils/device'

const styleSheet = {
  borderTopWidth: 1,
  borderColor: theme.borderColor,
  backgroundColor: theme.white,
  paddingBottom: 3
}
const shadowStyle = {
  shadowColor: 'black',
  shadowOpacity: 0.1,
  shadowRadius: 3
}

export const ViewItemsButton = ({ onPress, ml = 1.8, mr = 1.8 }) => (
  <View style={isIos() ? [styleSheet, shadowStyle] : styleSheet}>
    <CustomButton
      center
      color="white"
      ml={ml}
      mr={mr}
      mt={0.5}
      pv={1.5}
      size={16}
      lineHeight={24}
      textStyle={{ letterSpacing: 1 }}
      background={theme.black}
      onPress={onPress}
    >
      View Items
    </CustomButton>
  </View>
)
