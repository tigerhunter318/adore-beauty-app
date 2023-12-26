import React from 'react'
import { StyleSheet } from 'react-native'
import { SvgCssUri } from 'react-native-svg'
import Container from '../ui/Container'
import GiftCertificateImageAsset from '../../assets/images/AB-D-gift-card.svg'
import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import ResponsiveImage from '../ui/ResponsiveImage'
import { px } from '../../utils/dimensions'

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    zIndex: 2,
    position: 'relative',
    resizeMode: 'contain'
  }
})

const GiftCertificateImage = ({ isCartLineItem, isConfirmation, width, height }) => {
  const { image_url: remoteGiftCertificateImageUrl } = getRemoteConfigJson('gift_certificate') || {}
  const isSVG = remoteGiftCertificateImageUrl?.endsWith('.svg')

  const assetImageProps = {
    width: width || 310,
    height: height || 160
  }

  const remoteImageProps = {
    displayWidth: width || 320,
    displayHeight: height || 320
  }

  return (
    <Container
      style={[
        styles.imageContainer,
        {
          padding: remoteGiftCertificateImageUrl || isCartLineItem || isConfirmation ? 0 : 42
        }
      ]}
    >
      {isSVG && !!remoteGiftCertificateImageUrl && (
        <Container center justify>
          <SvgCssUri
            fill="currentColor"
            uri={remoteGiftCertificateImageUrl}
            width={px(remoteImageProps.displayWidth)}
            height={px(remoteImageProps.displayHeight)}
          />
        </Container>
      )}
      {!isSVG && !!remoteGiftCertificateImageUrl && (
        <ResponsiveImage url={remoteGiftCertificateImageUrl} {...remoteImageProps} />
      )}
      {!remoteGiftCertificateImageUrl && <GiftCertificateImageAsset {...assetImageProps} />}
    </Container>
  )
}

export default GiftCertificateImage
