import React from 'react'
import CustomPicker from '../ui/CustomPicker/CustomPicker'

const createPickerOptions = (quantity: number) => {
  const options = []
  for (let i = 1; i <= quantity; i += 1) {
    options.push({ label: `${i}`, value: i })
  }
  return options
}

type QuantityPickerProps = {
  numOfOptions: number
  onChange: (value: any) => void
  defaultValue?: any
  title?: any
  width?: any
}

const QuantityPicker = ({ numOfOptions = 10, onChange, defaultValue, title, width }: QuantityPickerProps) => {
  const options = createPickerOptions(numOfOptions)
  return <CustomPicker options={options} title={title} width={width} defaultValue={defaultValue} onChange={onChange} />
}

export default QuantityPicker
