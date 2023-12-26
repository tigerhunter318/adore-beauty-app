import React, { useEffect } from 'react'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import { smartlook } from '../../services/smartlook'

const textStyle = {
  color: theme.lightBlack
}

const SocialLoginGoogle = ({ onSuccess, webClientId, iosClientId }) => {
  const signIn = async () => {
    smartlook.setHideScreenOn()
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      onSuccess({
        ...userInfo,
        token: userInfo.idToken
      })
      // this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        alert(`Google Login error\n${error}`)
      }
    }
    smartlook.setHideScreenOff()
  }

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId,
      iosClientId,
      offlineAccess: false
    })
  }

  useEffect(configureGoogleSignIn, [webClientId])

  return (
    <CustomButton
      icon="GoogleBig"
      iconType="adoresvg"
      iconSize={18}
      bold
      fontSize={15}
      background="white"
      pv={1.3}
      onPress={signIn}
      uppercase={false}
      border={theme.darkGray}
      borderRadius
    >
      Sign in with Google
    </CustomButton>
  )
}

export default SocialLoginGoogle
