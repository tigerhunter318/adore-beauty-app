import React from 'react'
import { StyleSheet } from 'react-native'
import { getIn } from '../../utils/getIn'
import { formatCurrency } from '../../utils/format'
import { bigcommerceUtils } from '../../services/bigcommerce'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import ResponsiveImage from '../ui/ResponsiveImage'
import GiftCertificateImage from '../gift-certificate/GiftCertificateImage'

const imageSize = 50

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15
  },
  image: {
    width: imageSize,
    height: imageSize,
    marginRight: 10
  },
  cartRow: {
    borderBottomWidth: 1,
    borderColor: theme.borderColor
  },
  quantity: {
    fontSize: 15,
    paddingTop: 10
  },
  title: {
    fontSize: 13,
    marginBottom: 10
  }
})

const CartConfirmLineItem = ({ item, product, onItemClick }) => {
  const quantity = getIn(item, 'quantity')
  const name = getIn(item, 'name')
  const productImage = product && product.productImage
  const totalPrice = getIn(item, 'price_inc_tax') || 0
  const isGiftCertificate = bigcommerceUtils.isGiftCertificate(item)

  let handleProductPress
  if (parseFloat(totalPrice) > 0 && onItemClick && product) {
    handleProductPress = () => {
      onItemClick(product)
    }
  }

  return (
    <Container style={styles.container}>
      <Container rows>
        <Container style={styles.image} onPress={handleProductPress}>
          {productImage && !isGiftCertificate && (
            <ResponsiveImage width={imageSize} height={imageSize} src={productImage} useAspectRatio />
          )}
          {isGiftCertificate && <GiftCertificateImage isConfirmation width={imageSize} height={imageSize} />}
        </Container>
        <Container flex={1} pr={1} onPress={handleProductPress}>
          <Container flex={1}>
            {isGiftCertificate ? (
              <Type bold numberOfLines={2} style={styles.title}>
                Adore Beauty <Type>{'\n'}Digital Gift Card</Type>
              </Type>
            ) : (
              <Type numberOfLines={2} style={styles.title}>
                {name}
              </Type>
            )}
          </Container>
        </Container>
        <Type style={styles.quantity}>
          {quantity} x <Type bold> {formatCurrency(totalPrice)}</Type>
        </Type>
      </Container>
    </Container>
  )
}

export default CartConfirmLineItem
