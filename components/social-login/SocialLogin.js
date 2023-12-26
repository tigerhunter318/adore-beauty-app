import React from 'react'
import { useDispatch } from 'react-redux'
import { isIos } from '../../utils/device'
import { onLoginSuccess } from '../../navigation/utils/loginNavigationHelpers'
import Container from '../ui/Container'
import Type from '../ui/Type'
import SocialLoginFacebook from './SocialLoginFacebook'
import SocialLoginGoogle from './SocialLoginGoogle'
import SocialLoginApple from './SocialLoginApple'
import customer from '../../store/modules/customer'
import Hr from '../ui/Hr'
import theme from '../../constants/theme'
import envConfig from '../../config/envConfig'

const SocialLogin = ({ navigation, route, title = 'OR' }) => {
  const dispatch = useDispatch()

  const handleSuccess = async (type, payload) => {
    if (payload && payload.token) {
      const response = await dispatch(customer.actions.loginSocial(type, { token: payload.token }))

      if (response?.token) {
        onLoginSuccess({ navigation, route })
      }
    }
  }

  return (
    <Container>
      {/* <Type center semiBold size={16} color={theme.lighterBlack}>
        {title}
      </Type>
      <Hr mb={1} /> */}
      <Container>
        <Container ph={2}>
          <SocialLoginFacebook
            facebookAppId={envConfig.facebookAppId}
            onSuccess={response => handleSuccess('facebook', response)}
          />
        </Container>
        <Container pt={1} ph={2}>
          <SocialLoginGoogle
            webClientId={envConfig.googleWebClientId}
            iosClientId={envConfig.googleIosClientId}
            onSuccess={response => handleSuccess('google', response)}
          />
        </Container>

        {isIos() && (
          <Container pt={1} ph={2} align>
            <SocialLoginApple onSuccess={response => handleSuccess('apple', response)} />
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default SocialLogin
