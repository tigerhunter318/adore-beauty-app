import React from 'react'
import { StyleSheet } from 'react-native'
import Container from './Container'
import SafeScreenView from './SafeScreenView'
import Icon from './Icon'
import { vh } from '../../utils/dimensions'

const styles = StyleSheet.create({
  container: {
    height: vh(100),
    paddingTop: 0
  },
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
    top: 0,
    zIndex: 9
  }
})

const ScreenViewModal = ({
  children,
  footerComponent,
  onClose = () => {},
  containerStyle = {},
  contentStyle = {},
  ...rest
}) => (
  <SafeScreenView flex={1} {...rest}>
    <Container
      align="center"
      justify="space-between"
      pv={2}
      background="white"
      flex={1}
      style={[styles.container, containerStyle]}
    >
      <Container style={styles.closeButtonPosition} onPress={onClose} testID="ScreenViewModal.CloseButton">
        <Container justify center style={styles.closeButton}>
          <Icon name="close" size={27} type="material" />
        </Container>
      </Container>
      <Container style={[styles.content, contentStyle]}>{children}</Container>
    </Container>
    {footerComponent}
  </SafeScreenView>
)

export default ScreenViewModal
