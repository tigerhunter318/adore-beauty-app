import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useRoute } from '@react-navigation/native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Hr from '../ui/Hr'
import theme from '../../constants/theme'
import CartLineItemRemove from './CartLineItemRemove'
import cart from '../../store/modules/cart'
import { formatCurrency } from '../../utils/format'
import { useActionState } from '../../store/utils/stateHook'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import { isValidArray } from '../../utils/validation'

const styles = StyleSheet.create({
  hr: {
    backgroundColor: theme.borderColor,
    height: 1,
    marginTop: 5,
    marginBottom: 0
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    paddingHorizontal: 2
  }
})

export const CartPriceBarGiftCertificatesItem = ({ item, disabled, onRemovePress }) => {
  const { code, balance, expiry_date: expiryDate } = item || {}

  return (
    <Container>
      <Hr full style={styles.hr} />
      <Container rows align>
        <Container pv={1.5} pr={1} rows justify="space-between" align="center">
          <Container rows style={{ width: '90%' }}>
            <Type style={[styles.text, { width: '48%' }]} numberOfLines={1} ellipsizeMode="middle" semiBold>
              {code}
            </Type>
            <Type style={[styles.text, { width: '37%' }]} numberOfLines={1} semiBold>
              <Type color={theme.textGrey}>bal </Type> ${parseFloat(balance)}
            </Type>
            <Type style={styles.text} numberOfLines={1} semiBold>
              <Type color={theme.textGrey}>exp </Type> {expiryDate}
            </Type>
          </Container>
        </Container>
        <CartLineItemRemove
          disabled={disabled}
          onRemovePress={onRemovePress}
          iconStyle={{ right: 3, top: 15 }}
          message="Are you sure you want to remove this gift card?"
        />
      </Container>
    </Container>
  )
}

const CartPriceBarGiftCertificatesItems = ({ disabled }) => {
  const giftCertificates = useActionState('cart.giftCertificates')
  const dispatch = useDispatch()

  if (!isValidArray(giftCertificates)) return null

  const onRemovePress = async id => dispatch(cart.actions.removeGiftCertificateFromState(id))

  return (
    <Container>
      {giftCertificates.map(item => (
        <CartPriceBarGiftCertificatesItem
          item={item}
          key={item.id}
          onRemovePress={() => onRemovePress(item.id)}
          disabled={disabled}
        />
      ))}
    </Container>
  )
}

const CartPriceBarGiftCertificates = ({ giftCertificatesDiscount, loading }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const isCartScreen = route.name === 'Cart'

  const handlePress = () => {
    if (isCartScreen) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const onMount = () =>
    navigation.addListener('focus', () => {
      setIsDropdownOpen(false)
    })

  useEffect(onMount, [navigation])

  return (
    <Container testID="CartPriceBarGiftCertificates">
      <Container rows align justify="space-between" pt={1.5} pb={1} onPress={handlePress}>
        <Container rows>
          <Type size={13} color={isDropdownOpen ? theme.black : theme.lightBlack} pr={2} letterSpacing={0.5}>
            Gift card applied
          </Type>
          {isCartScreen && (
            <Container style={{ position: 'absolute', left: 150, bottom: 0 }}>
              <AdoreSvgIcon
                style={{
                  transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }]
                }}
                name="angle-down"
                width={12}
                height={16}
              />
            </Container>
          )}
        </Container>
        <Container>
          <Type semiBold letterSpacing={1} heading isLoading size={13} color={theme.orange}>
            {`- ${formatCurrency(giftCertificatesDiscount)}`}
          </Type>
        </Container>
      </Container>
      {isDropdownOpen && <CartPriceBarGiftCertificatesItems disabled={loading} />}
      <Hr full style={[styles.hr, { marginBottom: 5, marginTop: isDropdownOpen ? 0 : 5 }]} />
    </Container>
  )
}

export default CartPriceBarGiftCertificates
