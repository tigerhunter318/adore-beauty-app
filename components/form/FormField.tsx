import React, { useEffect, useRef } from 'react'
import { Text, TextInputProps } from 'react-native'
import { MaskService } from 'react-native-masked-text'
import {
  isEmail,
  isPhoneNumber,
  isMatchingPassword,
  isValidPassword,
  isMinLength,
  isValidName
} from '../../utils/validation'
import Type, { DEFAULT_FONT_FAMILY } from '../ui/Type'
import { isIos } from '../../utils/device'
import FormInput from './FormInput'
import Container from '../ui/Container'
import Icon from '../ui/Icon'
import theme from '../../constants/theme'

const emailProps = {
  validate: [isEmail],
  textContentType: 'emailAddress',
  autoCompleteType: 'email',
  keyboardType: 'email-address',
  autoCapitalize: 'none'
}
const phoneMask = {
  type: 'custom',
  options: {
    getRawValue: (value: string) => value && value.replace(/\s/g, ''),
    mask: '9999 999 999'
  }
}
const phoneProps = {
  validate: [isPhoneNumber],
  returnKeyType: 'done',
  keyboardType: 'phone-pad',
  maskProps: phoneMask
}
const nameProps = {
  validate: [isValidName]
}
export const toMaskedPhoneNumber = (val: string) => {
  const options = {
    getRawValue: (value: string) => value && value.replace(/\s/g, ''),
    mask: '9999 999 999'
  }
  return MaskService.toMask(phoneMask.type, val, phoneMask.options).replace(/\s/g, '')
}

const passwordProps = (name: string, form: any) => ({
  validate: [(value: any) => isMatchingPassword(name, form, value), (value: any) => isValidPassword(value)],
  maxLength: 40,
  textContentType: 'password',
  autoCompleteType: 'password',
  autoCapitalize: 'none',
  secureTextEntry: true
})

const loginPasswordProps = (name: string, form: any) => ({
  validate: [(value: any) => isMatchingPassword(name, form, value), isMinLength(6)],
  maxLength: 40,
  textContentType: 'password',
  autoCompleteType: 'password',
  autoCapitalize: 'none',
  secureTextEntry: true
})

export const condensedInputStyle = {
  container: {
    borderWidth: 0,
    marginLeft: -5,
    marginRight: -5
  },
  input: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    letterSpacing: 0.1,
    fontFamily: DEFAULT_FONT_FAMILY
  }
}

const errorBackground = 'rgba(255,0,0,0.1)'

export const errorTextStyle = {
  color: theme.darkRed,
  fontSize: 10,
  paddingTop: 8
}

export const errorInputStyle = (isFocused: boolean) => ({
  backgroundColor: isFocused ? errorBackground : undefined,
  borderColor: isFocused ? theme.darkRed : 'rgba(255,0,0,0.2)'
})

export const Required = () => (
  <Text selectable={false} style={{ color: theme.darkRed }}>
    {' '}
    *
  </Text>
)

export type FormFieldProps = Omit<TextInputProps, 'onChange'> & {
  label?: any
  onChange?: (name: string, val: string) => void
  inputRef?: React.RefObject<any>
  required?: boolean
  disabled?: boolean
  value?: string
  name: string
  hasError?: boolean
  onRefChange?: () => void
  nextName?: string
  form: any
  fieldType?: string
  validate?: any
  maskProps?: any
  condensed?: any
  onSubmitEditing?: (evt: any) => void
  onFocus?: (evt: any) => void
  onBlur?: (evt: any) => void
  isLoginPassword?: boolean
  errorMessage?: (_name: string, _labelText: string) => string
  containerProps?: any
  containerStyle?: any
  labelProps?: any
  inputStyle?: any
  inputComponent?: JSX.Element
  returnKeyType?: any
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
  textAlignVertical?: string
  editable?: boolean
  secureTextEntry?: boolean
}

const FormField = ({
  label,
  onChange,
  inputRef,
  required,
  disabled,
  value,
  name,
  hasError,
  onRefChange,
  nextName,
  form,
  fieldType,
  validate,
  maskProps,
  condensed,
  onSubmitEditing,
  isLoginPassword = false,
  errorMessage = (_name: string, _labelText: string) => `Enter a valid ${_labelText || _name}`,
  containerProps = {},
  containerStyle = {},
  labelProps = {},
  inputStyle,
  inputComponent,
  ...rest
}: FormFieldProps) => {
  const ref = useRef(null)
  const hasState = !!(form && form.formState)
  const formInputRef = inputRef || ref
  let returnKeyType
  let inputError = hasError
  let fieldProps: any = {}
  const isFocused = hasState && form.getFocused() === name
  const formInputValue = hasState ? form.getValue(name) : value

  if (nextName) {
    returnKeyType = 'next'
  }
  if (fieldType === 'phone') {
    fieldProps = phoneProps
  }
  if (fieldType === 'email') {
    fieldProps = emailProps
  }
  if (fieldType === 'name') {
    fieldProps = nameProps
  }
  if (fieldType === 'password') {
    fieldProps = passwordProps(name, form)

    if (name === 'currentPassword') {
      fieldProps.validate = [isMinLength(6)]
    }
  }

  if (isLoginPassword) {
    fieldProps = loginPasswordProps(name, form)
  }

  const handleChangeFocusedName = () => {
    if (hasState && isFocused) {
      if (formInputRef && formInputRef.current) {
        if (formInputRef.current.getElement) {
          formInputRef.current.getElement().focus()
        } else formInputRef.current.focus()
      }
    }
  }

  const handleChangeText = (text: any, unMaskedText: any) => {
    const val = unMaskedText || text

    if (onChange) {
      onChange(name, val)
    }

    if (hasState) {
      form.setValue({ [name]: val })
    }
  }
  const handleSubmitEditing = (evt: any) => {
    if (nextName && hasState) {
      form.setFocused(nextName)
    }
    if (onSubmitEditing) {
      onSubmitEditing(evt)
    }
  }

  const handleFocus = (evt: any) => {
    if (rest.onFocus) {
      rest.onFocus(evt)
    }
    if (hasState) {
      form.setFocused(name)
    }
  }
  const handleBlur = (evt: any) => {
    if (rest.onBlur) {
      rest.onBlur(evt)
    }

    if (hasState) {
      form.setFocused({ [name]: false })
      form.setBlurred({ [name]: true })
    }
  }

  const onMount = () => {
    if (hasState) {
      form.setRequired({ [name]: required })
      form.setValidations({ [name]: fieldProps.validate || validate })
    }
  }

  const hasInteracted = hasState && (form.hasBlurred(name) || form.submitted)

  if (hasState && hasInteracted) {
    if (required) {
      inputError = form.hasError(name, validate || fieldProps.validate) || !form.getValue(name)
    } else {
      inputError = form.hasError(name, validate || fieldProps.validate)
    }
  }

  useEffect(handleChangeFocusedName, [hasState && form.getFocused()])
  useEffect(onMount, [])

  let defaultInputStyle: any = {}
  // console.log("152","","FormField", border, inputStyle, border === false && inputStyle === {})
  if (condensed && inputStyle === undefined) {
    defaultInputStyle = { ...condensedInputStyle }
  } else if (inputStyle === undefined) {
    defaultInputStyle = { container: {}, input: {} }
  } else {
    defaultInputStyle = { ...inputStyle }
  }
  if (isFocused) {
    defaultInputStyle = {
      ...defaultInputStyle,
      container: {
        ...defaultInputStyle.container,
        borderColor: 'black'
      }
    }
    if (fieldType === 'code') {
      defaultInputStyle = {
        ...defaultInputStyle,
        container: {
          ...defaultInputStyle.container,
          backgroundColor: theme.white
        }
      }
    }
  }
  if (inputError) {
    defaultInputStyle = {
      ...defaultInputStyle,
      container: {
        ...defaultInputStyle.container,
        ...errorInputStyle(isFocused)
      }
    }
  }

  let isValidField = false

  if (hasState && hasInteracted && !inputError && (required || form.submitted)) {
    isValidField = true
  }

  if (fieldType === 'password') {
    defaultInputStyle = {
      ...defaultInputStyle,
      input: { paddingLeft: 40 }
    }
  }

  const labelText = typeof label === 'string' ? label : ''

  return (
    <Container style={containerStyle} {...containerProps}>
      {!!labelText && (
        <Type mb={0.8} heading semiBold selectable={false} {...labelProps} size={13} uppercase color={theme.black}>
          {label}
          {required && <Required />}
        </Type>
      )}
      {!!label && !labelText && label}
      {inputComponent}
      {!inputComponent && (
        <FormInput
          styles={defaultInputStyle}
          // @ts-ignore
          onChangeText={handleChangeText}
          value={formInputValue}
          disabled={disabled}
          inputRef={formInputRef}
          returnKeyType={rest.returnKeyType || returnKeyType}
          onSubmitEditing={handleSubmitEditing}
          onBlur={handleBlur}
          onFocus={handleFocus}
          maskProps={maskProps}
          isFocused={isFocused}
          {...fieldProps}
          {...rest}
        />
      )}
      {isValidField && (
        <Container style={[{ position: 'absolute', bottom: isIos() ? 12 : 16, right: 10 }, inputStyle?.checkIcon]}>
          <Icon name="check" type="materialcommunityicons" size={18} color={theme.green} />
        </Container>
      )}
      {inputError && <Text style={errorTextStyle}>{errorMessage(name.replace(/_/g, ' '), labelText)}</Text>}
    </Container>
  )
}

export default FormField
