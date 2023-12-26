import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { isIos } from '../../../utils/device'
import theme from '../../../constants/theme'

const styleSheet = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: theme.black,
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: theme.black,
    paddingRight: 30
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    height: 45,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const InputBox = ({ onPress, value }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={1}>
    <View pointerEvents="box-only">
      <TextInput style={isIos() ? styleSheet.inputIOS : styleSheet.inputAndroid} value={value} />
      <View style={styleSheet.iconContainer}>
        <Icon name="ios-arrow-down" size={15} color={theme.borderColorDark} />
      </View>
    </View>
  </TouchableOpacity>
)

export default InputBox
