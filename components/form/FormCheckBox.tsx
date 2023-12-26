import React from 'react'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../../constants/theme'
import Type from '../ui/Type'
import Container from '../ui/Container'

type FormCheckBoxProps = {
  form: any
  label?: string
  name: string
  onChange: (name: string, isChecked: boolean) => void
}

const FormCheckBox = ({ form, label, name, onChange = () => {} }: FormCheckBoxProps) => {
  const hasState = !!form?.formState
  const isChecked = !!form?.getValue(name) || false

  const handleClick = () => {
    onChange(name, !isChecked)
    if (hasState) {
      form.setValue({ [name]: !isChecked })
    }
  }

  return (
    <Container rows align onPress={handleClick} mt={0.5} mb={0.5}>
      <CheckBox
        onClick={handleClick}
        isChecked={isChecked}
        checkedImage={<Icon name="check-box" size={24} color={theme.black} />}
        unCheckedImage={<Icon name="check-box-outline-blank" size={24} color={theme.black} />}
      />
      <Type ml={0.5}>{label}</Type>
    </Container>
  )
}

export default FormCheckBox
