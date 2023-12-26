import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { isIos } from '../../utils/device'
import Container from '../ui/Container'
import FormField from './FormField'
import Icon from '../ui/Icon'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'

const styles = StyleSheet.create({
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: isIos() ? 6 : 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  eyeText: {
    marginLeft: 5,
    marginBottom: 1,
    color: theme.lighterBlack,
    fontSize: 11
  },
  lockIcon: {
    position: 'absolute',
    top: isIos() ? 10 : 14,
    left: 15
  }
})

export const formInputPasswordErrorText = () =>
  'The password must be at least 8 characters. The password must include a number, a symbol, a lower and upper case letter.'

const FormInputPassword = ({
  errorMessage = formInputPasswordErrorText,
  eyeIconStyles = {},
  lockIconStyles = {},
  fullWidth = false,
  width = '80%',
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleEyePress = () => setIsPasswordVisible(!isPasswordVisible)

  return (
    <Container>
      <Container rows>
        <Container style={{ width }}>
          <FormField
            required
            fieldType="password"
            name="password"
            errorMessage={errorMessage}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            form={rest.form}
            {...rest}
          />
        </Container>
        <Container style={[styles.lockIcon, lockIconStyles]}>
          <AdoreSvgIcon name="password-lock" width={13} height={20} />
        </Container>
        {!fullWidth && (
          <Container style={[styles.eyeIcon, eyeIconStyles]} onPress={handleEyePress}>
            <Icon name={isPasswordVisible ? 'ios-eye-off' : 'ios-eye'} type="ion" color={theme.lightBlack} />
            <Type semiBold style={styles.eyeText}>
              {isPasswordVisible ? 'hide' : 'show'}
            </Type>
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default FormInputPassword
