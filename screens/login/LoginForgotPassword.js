import React, { useState } from 'react'
import Container from '../../components/ui/Container'
import LoginForgotPasswordConfirmation from './LoginForgotPasswordConfimation'
import LoginForgotPasswordForm from './LoginForgotPasswordForm'

const LoginForgotPassword = ({ navigation, route }) => {
  const [completeMessage, setCompleteMessage] = useState(null)

  const handleResetSuccess = msg => setCompleteMessage(msg)

  return (
    <Container ph={2} pt={2}>
      {completeMessage ? (
        <LoginForgotPasswordConfirmation navigation={navigation} />
      ) : (
        <LoginForgotPasswordForm navigation={navigation} route={route} onResetSuccess={handleResetSuccess} />
      )}
    </Container>
  )
}

export default LoginForgotPassword
