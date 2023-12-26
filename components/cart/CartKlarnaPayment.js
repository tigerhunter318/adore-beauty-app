/* eslint-disable */
import React, { useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import useAsyncEffect from 'use-async-effect'
// import KlarnaPaymentView from 'react-native-klarna-inapp-sdk'
import CustomModal from '../ui/CustomModal'
import Container from '../ui/Container'
import Loading from '../ui/Loading'
import remoteLog from '../../services/remoteLog'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import KlarnaSvg from '../../assets/images/klarna.svg'
import Type from '../ui/Type'
import { isIos } from '../../utils/device'
import { smartlook } from '../../services/smartlook'

const styles = StyleSheet.create({
  modal: {
    paddingTop: 0,
    paddingBottom: 0
  },
  containerStyle: {
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0
  },
  contentStyle: {
    padding: 0,
    paddingTop: 100
  },
  closeButtonPosition: {
    right: -17,
    top: isIos() ? 35 : -18
  },
  logoContainer: {
    position: 'absolute',
    top: isIos() ? 50 : 0,
    width: '100%'
  },
  logoTagLine: {
    fontSize: 11,
    letterSpacing: 0.3,
    paddingTop: 5,
    color: theme.black,
    textAlign: 'center'
  },
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 20,
    fontSize: 16
  },
  paymentView: {
    width: '100%',
    height: '100%'
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const CartKlarnaPayment = ({ isVisible, onClose, onKlarnaPaymentComplete, data }) => {
  const paymentRef = useRef(null)
  const [state, setLoading] = useState({ loading: false, step: null })

  const handleMount = async () => {
    if (paymentRef?.current?.initialize) {
      setLoading({ loading: true, step: 'initializing' })
      paymentRef.current.initialize(data.client_token, 'returnUrl://')
    }
  }
  const handleUnMount = () => {}

  const handleAuthorize = () => {
    smartlook.setHideScreenOn()
    if (paymentRef?.current?.authorize) {
      paymentRef.current.authorize()
    }
  }

  const handleFinalize = () => {
    if (paymentRef?.current?.finalize) {
      setLoading({ loading: true, step: 'finalizing' })
      paymentRef.current.finalize()
    }
  }

  const onInitialized = () => {
    if (paymentRef?.current?.load) {
      setLoading({ loading: true, step: 'loading' })
      paymentRef.current.load()
    } else {
      setLoading({ loading: false, step: 'initializing' })
    }
  }

  const onLoaded = () => {
    setLoading({ loading: false, step: 'authorization' })
  }

  const onAuthorized = event => {
    if (event?.nativeEvent?.approved) {
      setLoading({
        loading: false,
        step: 'finalize',
        authToken: event?.nativeEvent?.authToken
      })
    }
  }

  const onError = event => {
    remoteLog.logError('CartKlarnaPayment', event.nativeEvent)
    smartlook.setHideScreenOff()
  }

  const onFinalized = event => {
    if (event?.nativeEvent?.authToken) {
      setLoading({
        loading: true,
        step: 'finalized',
        authToken: event.nativeEvent.authToken
      })
      onKlarnaPaymentComplete({
        type: 'ready',
        result: {
          type: 'klarna payment',
          ...event.nativeEvent
        }
      })
    }
  }

  useAsyncEffect(handleMount, handleUnMount, [])

  //! Temporarily Disabled: https://adorebeautywiki.atlassian.net/browse/MOB-1005
  return null

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      closeButtonPosition={styles.closeButtonPosition}
      closeButtonSize={27}
      containerStyle={styles.containerStyle}
      contentStyle={styles.contentStyle}
      style={styles.modal}
      backdropColor={theme.white}
      backdropOpacity={1}
    >
      <Container style={styles.logoContainer}>
        <KlarnaSvg height={18} fill="black" />
        <Type style={styles.logoTagLine}>
          Proud partner of <Type semiBold>Adore Beauty</Type>
        </Type>
      </Container>
      <Container flex={1} pt={isIos() ? 1.5 : 0}>
        {data?.payment_method_categories?.[0] && (
          <Container flex={1}>
            <KlarnaPaymentView
              category={data?.payment_method_categories?.[0]?.identifier}
              ref={paymentRef}
              style={styles.paymentView}
              onInitialized={onInitialized}
              onLoaded={onLoaded}
              onAuthorized={onAuthorized}
              onFinalized={onFinalized}
              onError={onError}
            />
          </Container>
        )}
        {state.loading && (
          <Container style={styles.loadingContainer}>
            <Loading lipstick />
          </Container>
        )}
        {state.step === 'authorization' && (
          <CustomButton
            label="Authorize"
            onPress={handleAuthorize}
            style={styles.button}
            bold
            loading={state.loading}
          />
        )}
        {state.step === 'finalize' && (
          <CustomButton label="Finalize" onPress={handleFinalize} style={styles.button} bold loading={state.loading} />
        )}
      </Container>
    </CustomModal>
  )
}

export default CartKlarnaPayment
/* eslint-enable */
