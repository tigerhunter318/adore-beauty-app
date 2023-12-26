import React from 'react'
import { StyleSheet, View } from 'react-native'
import { vw } from '../../utils/dimensions'
import Container from './Container'
import Type from './Type'
import theme from '../../constants/theme'
import Icon from './Icon'

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  title: {
    width: vw(100),
    textAlign: 'center',
    color: theme.white,
    backgroundColor: theme.black
  },
  icon: {
    fontSize: 22,
    color: theme.white,
    position: 'absolute',
    right: 10,
    bottom: 13,
    zIndex: 9
  }
})

const FooterBarButtonContent = ({ title, titleStyle, hasClose, iconStyle, contentHeight = 'auto' }) => {
  const isTitlePlainText = typeof title === 'string'

  return (
    <>
      {isTitlePlainText ? (
        <Type
          semiBold
          heading
          size={14}
          lineHeight={48}
          letterSpacing={1.5}
          style={[styles.title, titleStyle, { height: contentHeight }]}
        >
          {title}
        </Type>
      ) : (
        <>{title}</>
      )}
      {hasClose && <Icon type="material" name="close" style={[styles.icon, iconStyle]} />}
    </>
  )
}

const FooterBarButton = ({
  containerStyle = {},
  titleStyle = {},
  iconStyle = {},
  title,
  hasClose = false,
  onPress,
  contentHeight
}) => (
  <Container onPress={onPress} style={[styles.container, containerStyle]}>
    <FooterBarButtonContent
      title={title}
      titleStyle={titleStyle}
      hasClose={hasClose}
      iconStyle={iconStyle}
      contentHeight={contentHeight}
    />
  </Container>
)

export default FooterBarButton
