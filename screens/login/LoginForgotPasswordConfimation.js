import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import CustomButton from '../../components/ui/CustomButton'
import theme from '../../constants/theme'
import Icon from '../../components/ui/Icon'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: theme.lightBlack,
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    textAlign: 'center',
    paddingVertical: 30,
    color: theme.lightBlack
  }
})

const LoginForgotPasswordConfirmation = ({ navigation }) => (
  <Container>
    <Container style={styles.container}>
      <Container style={styles.iconContainer}>
        <Icon name="check" type="materialcommunityicons" size={35} color={theme.white} />
      </Container>
      <Type style={styles.message}>
        The link to reset your password has been sent to your email. Please check your junk or spam folder if you cannot
        see it in your inbox.
      </Type>
    </Container>
    <CustomButton bold fontSize={16} pv={1.5} width="100%" onPress={navigation.goBack}>
      Sign in
    </CustomButton>
  </Container>
)

export default LoginForgotPasswordConfirmation
