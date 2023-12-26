import React from 'react'
import { StyleSheet } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { vh, vw } from '../../utils/dimensions'
import CustomModal from '../ui/CustomModal'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modal: {
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonPosition: {
    right: 2,
    top: 40
  }
})

const width = vw(100)
const height = vh(100)

type ImageZoomModalProps = {
  imageZoomComponent: JSX.Element | null
  onClose: () => void
  paddingTop?: number
}

const ImageZoomModal = ({ imageZoomComponent, onClose, paddingTop = vh(52), ...rest }: ImageZoomModalProps) => (
  <CustomModal
    style={styles.modal}
    backdropColor={theme.white}
    backdropOpacity={1}
    isVisible={!!imageZoomComponent}
    onClose={onClose}
    closeButtonPosition={styles.closeButtonPosition}
    closeButtonSize={27}
    animationInTiming={10}
    animationOutTiming={100}
    easing="ease-in"
  >
    <ImageZoom
      cropWidth={width}
      cropHeight={height}
      imageWidth={width}
      imageHeight={height}
      useNativeDriver
      style={{ paddingTop }}
      {...rest}
    >
      {imageZoomComponent}
    </ImageZoom>
  </CustomModal>
)

export default ImageZoomModal
