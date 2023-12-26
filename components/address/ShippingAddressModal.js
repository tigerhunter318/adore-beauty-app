import React from 'react'
import CustomModal from '../ui/CustomModal'
import Container from '../ui/Container'
import WebpageView from '../ui/WebpageView'
import envConfig from '../../config/envConfig'
import { isSmallDevice } from '../../utils/device'

const ShippingAddressModal = ({ isVisible, onClose, onAddressChange }) => {
  const uri = `${envConfig.siteUrl}nativestatic/addressfinder/index.html`
  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <Container flex={1}>
        <Container pt={2} flex={1} style={{ width: '100%' }}>
          <WebpageView uri={uri} onWebViewMessage={onAddressChange} />
        </Container>
      </Container>
    </CustomModal>
  )
}

export default ShippingAddressModal
