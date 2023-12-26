import React from 'react'
import { StyleSheet } from 'react-native'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 10
  },
  buttonLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  footNote: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.lightBlack,
    paddingTop: 10
  }
})

const GiftCertificateFooter = ({ onAddToCartPress, disabled, buttonText, giftCertificateOnCart }) => (
  <Container style={styles.container}>
    <Container
      style={styles.button}
      background={disabled ? theme.black70 : theme.black}
      onPress={onAddToCartPress}
      disabled={disabled}
    >
      {giftCertificateOnCart ? (
        <Type semiBold style={styles.buttonLabel} color={theme.white}>
          Update
        </Type>
      ) : (
        <Container rows>
          <AdoreSvgIcon name="bag-solid" width={16} height={18} color={theme.white} />
          <Type semiBold pl={1} style={styles.buttonLabel} color={theme.white}>
            {buttonText}
          </Type>
        </Container>
      )}
    </Container>
    <Type style={styles.footNote}>
      This is a digital Gift Card only. It will be emailed to the recipient when you complete your order.
    </Type>
  </Container>
)

export default GiftCertificateFooter
