import React, { useState, useEffect } from 'react'
import { Keyboard, View } from 'react-native'
import Header from './Header'
import theme from '../../../constants/theme'
import Container from '../Container'
import PickerComponent from './PickerComponent'
import { isIos } from '../../../utils/device'
import { isValidArray } from '../../../utils/validation'

const styleSheet = {
  container: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: theme.borderColor
  }
}

type CustomPickerProps = {
  onChange: (value: any) => void
  options: { label: string; value: number }[]
  defaultValue?: any
  title: any
  width?: any
  closeLabel?: any
}

const CustomPicker = ({
  onChange = () => {},
  options = [],
  defaultValue,
  title,
  width = '100%',
  closeLabel
}: CustomPickerProps) => {
  const [value, setValue] = useState<any>(defaultValue)
  const [selectedOption, setSelectedOption] = useState<{} | any>({})
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const data = isIos() ? options : options?.map((opt: { label: any }) => opt?.label)

  const handleItemSelected = (selected: any) => {
    const selectedValue = options?.[selected]?.value
    if (selectedValue !== value) {
      setValue(selectedValue)
    }
  }

  const handleModal = () => {
    if (!isModalVisible) {
      Keyboard.dismiss()
    }
    setIsModalVisible(!isModalVisible)
  }

  const handleOption = () => {
    const selectedOptionIndex = options?.findIndex((opt: { value: any }) => opt?.value === value)
    if (selectedOptionIndex !== -1) {
      setSelectedOption({
        ...options[selectedOptionIndex],
        index: selectedOptionIndex
      })
    }
  }

  const handleDefaultValue = () => setValue(defaultValue)

  const updateValue = () => {
    if (!isModalVisible && value !== defaultValue) {
      onChange(value)
    }
  }

  // reset the value if defaultValue change externally
  useEffect(handleDefaultValue, [defaultValue])
  useEffect(handleOption, [value, options])
  useEffect(updateValue, [isModalVisible])

  if (!isValidArray(data)) return null

  return (
    <View style={{ width }}>
      <Container style={styleSheet.container}>
        <PickerComponent
          data={data}
          selectedItem={selectedOption?.index}
          inputValue={selectedOption?.label}
          isModalVisible={isModalVisible}
          onPress={handleModal}
          onItemSelected={handleItemSelected}
          headerComponent={<Header title={title} onPress={handleModal} closeLabel={closeLabel} />}
        />
      </Container>
    </View>
  )
}

export default CustomPicker
