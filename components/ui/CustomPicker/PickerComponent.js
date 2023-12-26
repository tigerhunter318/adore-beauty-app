import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { Modal, TouchableOpacity, View } from 'react-native'
import { isIos } from '../../../utils/device'
import InputBox from './InputBox'
import theme from '../../../constants/theme'

let WheelPicker = null

/* eslint-disable global-require */
if (!isIos()) {
  WheelPicker = require('react-native-wheel-picker-android').WheelPicker
}
/* eslint-enable global-require */

const styleSheet = {
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modalBottomIOS: {
    justifyContent: 'center',
    backgroundColor: theme.white,
    height: 250
  },
  modalBottomAndroid: {
    justifyContent: 'center',
    backgroundColor: theme.white,
    height: 215,
    paddingTop: 35
  }
}

const PickerComponent = ({
  data,
  selectedItem,
  inputValue,
  isModalVisible,
  onPress,
  onItemSelected,
  headerComponent
}) => (
  <View>
    <InputBox value={inputValue} onPress={onPress} />
    <Modal visible={isModalVisible} transparent animationType="slide">
      <View style={styleSheet.modalBackdrop}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} />
        {headerComponent}
        {isIos() ? (
          <View style={styleSheet.modalBottomIOS}>
            <Picker selectedValue={selectedItem} onValueChange={onItemSelected} data={data}>
              {data.map((item, index) => (
                <Picker.Item label={item?.label} value={index} key={`${index}-${item?.label}`} />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={styleSheet.modalBottomAndroid}>
            <WheelPicker
              itemTextSize={18}
              selectedItemTextSize={20}
              style={[{ width: 'auto', height: '100%' }]}
              data={data}
              selectedItem={selectedItem}
              onItemSelected={onItemSelected}
            />
          </View>
        )}
      </View>
    </Modal>
  </View>
)

export default PickerComponent
