import React, { useEffect } from 'react'
import Modal from 'react-native-modal'
import { Animated, View, StyleSheet } from 'react-native'
import Container from './Container'
import Icon from './Icon'
import { animate, useAnimationRef } from '../../utils/animate'
import theme from '../../constants/theme'
import { useSafeInsets } from '../../utils/dimensions'

const styleSheet = StyleSheet.create({
  container: {},
  content: {
    flex: 1,
    width: '100%'
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonPosition: {
    position: 'absolute',
    right: 0,
    top: 2,
    zIndex: 9
  }
})

const fullScreenStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0
}

type CustomModalCloseButtonProps = {
  onPress: () => void
  style: any
  closeButtonPosition: any
  closeButtonSize: any
  closeButtonColor: any
}

const CustomModalCloseButton = ({
  onPress,
  style,
  closeButtonPosition,
  closeButtonSize,
  closeButtonColor
}: CustomModalCloseButtonProps) => (
  <Container style={[styleSheet.closeButtonPosition, closeButtonPosition]} onPress={onPress}>
    <Container justify center style={[styleSheet.closeButton, style]}>
      <Icon name="close" size={closeButtonSize} type="material" color={closeButtonColor} />
    </Container>
  </Container>
)

type CustomModalProps = {
  children: JSX.IntrinsicAttributes
  isVisible: boolean
  footerComponent?: JSX.IntrinsicAttributes | null
  onClose: () => void
  onModalHide?: () => void
  containerStyle?: any
  contentStyle?: any
  closeButtonStyle?: any
  closeButtonPosition?: any
  closeButtonSize?: number
  closeButtonColor?: string
  isCloseButtonVisible?: boolean
  style?: any
  backdropColor?: string
  backdropOpacity?: number
  flex?: number
  animationType?: string
  useNativeDriver?: boolean
  hideModalContentWhileAnimating?: boolean
  useNativeDriverForBackdrop?: boolean
  offset?: number
  animationInTiming?: number
  animationOutTiming?: number
  slideAnimation?: any
  isFullScreen?: boolean
  easing?: string
}

const CustomModal = ({
  children,
  isVisible,
  footerComponent,
  onClose = () => {},
  onModalHide = () => {},
  containerStyle = {},
  contentStyle = {},
  closeButtonStyle = {},
  closeButtonPosition = {},
  closeButtonSize = 27,
  closeButtonColor = theme.black,
  isCloseButtonVisible = true,
  style = {},
  backdropColor,
  backdropOpacity = 0.6,
  flex = 1,
  animationType,
  useNativeDriver = true,
  hideModalContentWhileAnimating = true,
  useNativeDriverForBackdrop = true,
  offset = 0,
  animationInTiming = 300,
  animationOutTiming = 250,
  slideAnimation,
  isFullScreen = false,
  ...rest
}: CustomModalProps) => {
  const { top } = useSafeInsets()
  const translateY = useAnimationRef()

  useEffect(() => {
    if (offset) {
      animate(translateY, { toValue: -offset, duration: 200 })
    } else {
      animate(translateY, { toValue: 0, duration: 180 })
    }
  }, [offset])

  const content = (
    <>
      <Container
        align="center"
        justify="space-between"
        background="white"
        flex={flex}
        style={[styleSheet.container, containerStyle]}
      >
        {isCloseButtonVisible && (
          <CustomModalCloseButton
            onPress={onClose}
            style={closeButtonStyle}
            closeButtonPosition={closeButtonPosition}
            closeButtonSize={closeButtonSize}
            closeButtonColor={closeButtonColor}
          />
        )}
        <Container style={[styleSheet.content, contentStyle]}>{children}</Container>
      </Container>
      {footerComponent}
    </>
  )

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={backdropOpacity}
      backdropColor={backdropColor}
      onModalHide={onModalHide}
      style={[{ paddingTop: top || 40, paddingBottom: 40 }, style, isFullScreen && fullScreenStyle]}
      useNativeDriver={useNativeDriver}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      hideModalContentWhileAnimating={hideModalContentWhileAnimating}
      // @ts-ignore
      useNativeDriverForBackdrop={useNativeDriverForBackdrop}
      onBackdropPress={onClose}
      {...rest}
    >
      {slideAnimation ? (
        <Animated.View style={{ transform: [{ translateY }] }}>
          <View>{content}</View>
        </Animated.View>
      ) : (
        content
      )}
    </Modal>
  )
}

export default CustomModal
