import React from 'react'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'
import { smartlook } from '../../services/smartlook'
import CustomButton from '../ui/CustomButton'

// https://github.com/thebergamo/react-native-fbsdk-next

const SocialLoginFacebook = ({ onSuccess }) => {
  const handleFbLoginFinished = async () => {
    smartlook.setHideScreenOn()
    const result = await LoginManager.logInWithPermissions(['email'])

    if (!result?.isCancelled) {
      const { accessToken } = await AccessToken.getCurrentAccessToken()
      if (accessToken) {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,first_name,last_name`
        )
        const json = await response.json()
        onSuccess({ ...json, token: accessToken })
      }
    }

    smartlook.setHideScreenOff()
  }

  return (
    <CustomButton
      icon="FacebookLetter"
      iconType="adoresvg"
      iconSize={20}
      bold
      fontSize={15}
      background="#1877F2"
      pv={1.3}
      onPress={handleFbLoginFinished}
      uppercase={false}
      borderRadius
      color="white"
    >
      Sign in with Facebook
    </CustomButton>
  )
}

export default SocialLoginFacebook
