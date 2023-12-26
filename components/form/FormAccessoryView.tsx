import React, { useRef } from 'react'
import { InputAccessoryView, Text, TextInput } from 'react-native'
import { isIos } from '../../utils/device'
import Container from '../ui/Container'
import FormField, { FormFieldProps } from './FormField'
import theme from '../../constants/theme'

type FormAccesoryViewProps = FormFieldProps & {
  inputAccessoryViewID: string
  inputAccessoryText: string
}

const FormAccessoryView = ({
  name = 'input',
  inputAccessoryViewID = 'input',
  inputAccessoryText = '',
  ...rest
}: FormAccesoryViewProps) => {
  const inputRef = useRef<TextInput>(null)

  const handleInputAccessoryTextPress = () => rest.form.setValue({ [name]: inputAccessoryText })

  return (
    <Container>
      <FormField
        name={name}
        inputRef={inputRef}
        inputAccessoryViewID={inputAccessoryViewID}
        autoCorrect={!isIos()}
        spellCheck={!isIos()}
        {...rest}
      />
      {isIos() && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          {!!inputAccessoryText && (
            <Container center style={{ backgroundColor: theme.iOSKeyboard }}>
              <Text style={{ paddingTop: 20, paddingBottom: 10, fontSize: 16 }} onPress={handleInputAccessoryTextPress}>
                {inputAccessoryText}
              </Text>
            </Container>
          )}
        </InputAccessoryView>
      )}
    </Container>
  )
}

export default FormAccessoryView
