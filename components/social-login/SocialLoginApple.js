import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import useAsyncEffect from 'use-async-effect'
import theme from '../../constants/theme'
import CustomModal from '../ui/CustomModal'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { getAsyncStorageItem } from '../../utils/asyncStorage'
import { smartlook } from '../../services/smartlook'

const infoImage = require('../../assets/images/apple-signin-info.png')

const styleSheet = StyleSheet.create({
  modal: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  },
  angle: {
    top: '40%',
    left: '-50%',
    position: 'absolute',
    width: '200%',
    height: '100%',
    transform: [{ rotate: '-20deg' }]
  }
})

const appleSignIn = async onSuccess => {
  smartlook.setHideScreenOn()
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })

    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

    if (credentialState) {
      onSuccess({
        ...appleAuthRequestResponse,
        token: appleAuthRequestResponse.identityToken
      })
    }
    // signed in
  } catch (e) {
    if (e.code === 'ERR_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
  smartlook.setHideScreenOff()
}

const SocialLoginAppleButton = ({ onPress }) => (
  <AppleButton
    buttonStyle={AppleButton.Style.BLACK}
    buttonType={AppleButton.Type.CONTINUE}
    cornerRadius={3}
    style={{
      width: '100%', // You must specify a width
      height: 45 // You must specify a height
    }}
    onPress={onPress}
  />
)

const SocialLoginAppleInfoImage = ({ isVisible, onLoginPress, onClose }) => {
  const { height: viewportHeight } = Dimensions.get('window')
  const multiplier = viewportHeight / 812 // scale image down on smaller viewport heights
  const style = {
    width: 303 * multiplier,
    height: 401 * multiplier,
    right: -22 * multiplier
  }
  return <Image source={infoImage} style={style} />
}

const SocialLoginAppleInfoModal = ({ isVisible, onLoginPress, onClose }) => (
  <CustomModal
    isVisible={isVisible}
    style={styleSheet.modal}
    containerStyle={{ backgroundColor: theme.pink }}
    closeButtonStyle={{ top: 20, backgroundColor: 'transparent' }}
    coverScreen
    onClose={onClose}
  >
    <Container flex={1}>
      <Container opacity={0.25} background={theme.white} style={styleSheet.angle} />
      <ScrollView>
        <Container style={{ minHeight: '100%' }}>
          <Container center mb={-1}>
            <SocialLoginAppleInfoImage />
          </Container>
          <Container center ph={1} mb={2}>
            <Type size={14} bold mb={1}>
              REMEMBER TO
            </Type>
            <Type size={24} light mb={1.5}>
              SHARE YOUR EMAIL
            </Type>
          </Container>
          <Container center ph={1} mb={2} flexGrow justify>
            <Type size={14} center color={theme.lightBlack} lineHeight={24}>
              In the next step, you will be given the option to <Type bold>share or hide your Apple ID email.</Type>
              {'\n\n'}
              If you select "Hide My Email" it will create a new Adore Beauty account and any past transactions and/or
              loyalty status will not be linked.
            </Type>
            <Type />
          </Container>
          <Container ph={3} mb={10}>
            <SocialLoginAppleButton onPress={onLoginPress} />
          </Container>
        </Container>
      </ScrollView>
    </Container>
  </CustomModal>
)
const SocialLoginApple = ({ onSuccess }) => {
  const [isModalVisible, setModalVisible] = useState(false)
  const [isModalEnabled, setModalEnabled] = useState(true)
  const handleModalOpen = () => {
    setModalVisible(true)
  }
  const handleModalClose = () => {
    setModalVisible(false)
  }
  const handleLoginPress = () => {
    handleModalClose()
    appleSignIn(onSuccess)
  }
  const handleMount = async () => {
    const lastLoginMethod = await getAsyncStorageItem('lastLoginMethod')
    if (lastLoginMethod === 'apple') {
      setModalEnabled(false)
    } else {
      setModalEnabled(true)
    }
  }
  useAsyncEffect(handleMount, [])

  return (
    <Container style={{ width: '100%' }}>
      <SocialLoginAppleButton onPress={isModalEnabled ? handleModalOpen : handleLoginPress} />
      {isModalEnabled && (
        <SocialLoginAppleInfoModal
          isVisible={isModalVisible}
          onClose={handleModalClose}
          onLoginPress={handleLoginPress}
        />
      )}
    </Container>
  )
}

export default SocialLoginApple
