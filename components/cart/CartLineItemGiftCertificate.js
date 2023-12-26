import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { formatCurrency } from '../../utils/format'
import Container from '../ui/Container'
import Type from '../ui/Type'
import cart from '../../store/modules/cart'
import CartLineItemRemove from './CartLineItemRemove'
import GiftCertificateImage from '../gift-certificate/GiftCertificateImage'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  innerContainer: {
    flexDirection: 'row',
    height: 110
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  details: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    zIndex: 1
  },
  title: {
    fontSize: 13,
    marginBottom: 10
  },
  price: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    fontSize: 15,
    letterSpacing: 1
  }
})

const CartLineItemGiftCertificate = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handleLineItemRemove = () => {
    setIsLoading(true)
    dispatch(cart.actions.removeLineItem(item))
    setIsLoading(false)
  }

  const handleLineItemPress = () => navigation.push('GiftCertificate', { item })

  return (
    <Container style={styles.container} testID="CartLineItem">
      <Container style={styles.innerContainer}>
        <Container style={styles.imageContainer} onPress={handleLineItemPress}>
          <GiftCertificateImage isCartLineItem isConfirmation width={90} height={90} />
        </Container>
        <Container style={styles.details}>
          <Container flex={1}>
            <Type bold numberOfLines={2} style={styles.title} onPress={handleLineItemPress}>
              Adore Beauty <Type>{'\n'}Digital Gift Card</Type>
            </Type>
          </Container>
          <CartLineItemRemove disabled={isLoading} onRemovePress={handleLineItemRemove} />
        </Container>
        <Type bold style={styles.price}>
          {formatCurrency(item.amount)}
        </Type>
      </Container>
    </Container>
  )
}

export default CartLineItemGiftCertificate
