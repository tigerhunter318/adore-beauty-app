import React, { useEffect, useRef } from 'react'
import { Image } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import theme from '../../constants/theme'
import CustomButton from '../../components/ui/CustomButton'
import useAppVisibilityState from '../../hooks/useAppVisibilityState'
import { useScreenFocusEffect } from '../../hooks/useScreen'

const iw = 200
const ih = 150

const styleSheet = {
  container: {},
  heading: {
    backgroundColor: theme.backgroundGrey
  },
  image: {
    aspectRatio: iw / ih,
    width: '100%',
    height: 'auto'
  }
}

const gif = require('../../assets/images/source.gif')

const NoInternetConnection = ({ navigation }) => {
  const handleRetryNow = () => {
    NetInfo.fetch().then(state => {
      if (state.isInternetReachable) {
        navigation.goBack()
      }
    })
  }

  useAppVisibilityState({
    onActive: () => {
      handleRetryNow() // check when app returns to foreground
    }
  })

  useScreenFocusEffect(handleRetryNow)

  return (
    <Container flex={1}>
      <Container pv={3} style={styleSheet.heading}>
        <Type bold center size={30} color={theme.lightPeach} letterSpacing={0.5} lineHeight={38}>
          Still waiting...
        </Type>
      </Container>
      <Container>
        <Image source={gif} width={iw} height={ih} style={styleSheet.image} />
      </Container>
      <Container style={styleSheet.heading} flex={1} pt={4} ph={2.5}>
        <CustomButton
          fontSize={30}
          icon="retry"
          background="white"
          style={{ visibility: 'hidden' }}
          onPress={handleRetryNow}
          pv={1.4}
          textProps={{ size: 16, heading: true, bold: true }}
          borderRadius={2}
        >
          RETRY NOW
        </CustomButton>
      </Container>
    </Container>
  )
}

export default NoInternetConnection
