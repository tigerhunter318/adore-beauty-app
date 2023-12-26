import React from 'react'
import { StyleSheet } from 'react-native'
import CustomModal from '../ui/CustomModal'
import Container from '../ui/Container'
import WebpageView from '../ui/WebpageView'
import envConfig from '../../config/envConfig'
import theme from '../../constants/theme'
import { isIos } from '../../utils/device'

const styles = StyleSheet.create({
  modal: {
    paddingTop: 0,
    paddingBottom: 0
  },
  closeButtonPosition: {
    right: isIos() ? 4 : 0,
    top: isIos() ? -13 : -15
  },
  closeButton: {
    backgroundColor: theme.white,
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const CartAfterpayPayment = ({ isVisible, onClose, onAfterpayComplete, data }) => {
  const uri = `${envConfig.siteUrl}nativestatic/afterpay/index.html?token=${data.token}`

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      containerStyle={{
        marginTop: 30,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0
      }}
      contentStyle={{ marginTop: -20, padding: 0 }}
      style={styles.modal}
      backdropColor={theme.white}
      backdropOpacity={1}
      closeButtonPosition={styles.closeButtonPosition}
      closeButtonStyle={styles.closeButton}
    >
      <Container style={{ flex: 1, width: '100%' }}>
        <WebpageView uri={uri} onWebViewMessage={onAfterpayComplete} />
      </Container>
    </CustomModal>
  )
}

export default CartAfterpayPayment
