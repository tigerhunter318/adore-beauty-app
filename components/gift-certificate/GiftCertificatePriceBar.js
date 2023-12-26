import React from 'react'
import { View, StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { isIos } from '../../utils/device'

const shadowStyle = {
  shadowOffset: { width: 0, height: 2 },
  shadowColor: theme.borderColorDark,
  shadowOpacity: 1,
  shadowRadius: 10
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: theme.borderColor
  },
  cover: {
    position: 'absolute',
    width: '100%',
    top: 0,
    height: 140,
    backgroundColor: 'white',
    paddingBottom: 100
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  priceContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'baseline'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 3,
    flexDirection: 'row'
  },
  button: {
    color: theme.white,
    paddingHorizontal: 10,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
})

const GiftCertificatePriceBar = ({ form, onAddToCartPress, disabled, buttonText, giftCertificateOnCart }) => {
  const giftAmount = form.getValue('giftAmount') || 0
  const containerStyle = [styles.container, { height: 56 }]

  if (isIos()) {
    containerStyle.push(shadowStyle)
  }

  return (
    <View style={containerStyle} testID="GiftCertificatePriceBar">
      <View style={styles.cover} />
      <Container rows style={styles.inner} gutter>
        <Container style={styles.priceContainer}>
          <Type size={15}>
            Gift Value{' '}
            <Type bold size={17}>
              ${giftAmount}
            </Type>
          </Type>
        </Container>

        <Container
          onPress={onAddToCartPress}
          style={styles.buttonContainer}
          background={disabled ? theme.orangeWithOpacity : theme.orange}
          disabled={disabled}
        >
          {giftCertificateOnCart ? (
            <Type bold style={styles.button}>
              Update
            </Type>
          ) : (
            <Type bold style={styles.button}>
              {buttonText}
            </Type>
          )}
        </Container>
      </Container>
    </View>
  )
}

export default GiftCertificatePriceBar
