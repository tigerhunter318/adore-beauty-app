import React from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { DEFAULT_FONT_FAMILY } from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'

const styleSheet = {
  container: {
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 2
  },
  input: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: theme.black
  }
}

type FormInputProps = TextInputProps & {
  placeholder: string
  styles?: {} | any
  inputRef?: React.RefObject<any>
  isFocused?: boolean
  maskProps?: {} | any
  onChangeText: (text: string) => void
  allowFontScaling?: boolean
}

// https://facebook.github.io/react-native/docs/textinput
const FormInput = ({
  placeholder,
  styles = {},
  inputRef,
  isFocused,
  maskProps,
  allowFontScaling = false,
  ...props
}: FormInputProps) => (
  <Container style={[styleSheet.container, styles.container]}>
    {maskProps && (
      <TextInputMask
        style={[styleSheet.input, styles.input]}
        includeRawValueInChangeText
        type={maskProps.type}
        options={maskProps.options}
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={theme.borderColorDark}
        {...props}
      />
    )}
    {!maskProps && (
      <TextInput
        ref={inputRef}
        style={[styleSheet.input, styles.input]}
        placeholder={placeholder}
        placeholderTextColor={theme.borderColorDark}
        allowFontScaling={allowFontScaling}
        {...props}
      />
    )}
  </Container>
)

export default FormInput
