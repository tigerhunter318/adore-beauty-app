import React from 'react'
import { ScrollView } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { vw } from '../../utils/dimensions'
import { isPaymentMethodEnabled } from '../../services/paymentMethods'
import Container from '../ui/Container'
import CustomModal from '../ui/CustomModal'
import SafeScreenView from '../ui/SafeScreenView'
import openInAppBrowser from '../../utils/openInAppBrowser'

const AfterPayModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const handleClickAfterpayImage = () => openInAppBrowser('https://www.afterpay.com/en-AU/terms-of-service')

  const isAfterpayEnabled = isPaymentMethodEnabled('afterpay')

  if (!isAfterpayEnabled) return null

  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <SafeScreenView flex={1}>
        <Container>
          <ScrollView style={{ paddingTop: 20 }}>
            <Container onPress={handleClickAfterpayImage}>
              <AutoHeightImage
                width={vw() - 40}
                source={{
                  uri: 'https://www.adorebeauty.com.au/nuxtimages/Afterpay_AU_HowitWorks_Mobile_White%401x.png'
                }}
              />
            </Container>
          </ScrollView>
        </Container>
      </SafeScreenView>
    </CustomModal>
  )
}

export default AfterPayModal
