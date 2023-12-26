import React from 'react'
import { useDispatch } from 'react-redux'
import { Keyboard, StyleSheet } from 'react-native'
import { useClipboard } from '@react-native-clipboard/clipboard'
import { useActionState } from '../../store/utils/stateHook'
import cart from '../../store/modules/cart'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import Loading from '../ui/Loading'
import useForm from '../form/useForm'
import FormAccessoryView from '../form/FormAccessoryView'
import theme from '../../constants/theme'
import Hr from '../ui/Hr'

const height = 35

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingBottom: 0,
    paddingTop: 0,
    borderRadius: 0,
    height
  },
  input: {
    fontSize: 11,
    letterSpacing: 0.5
  },
  hr: {
    backgroundColor: theme.borderColor,
    height: 1,
    marginTop: 0,
    marginBottom: 0
  }
})

const CartCode = ({ type, inputAccessoryText, placeholder, onCouponAddedToCart }) => {
  const form = useForm()
  const dispatch = useDispatch()
  const code = form.getValue(type)
  const isPending = useActionState('cart.request.pending')
  const loading = isPending && code
  const isFocused = form?.formState?.[0]?.focused === type

  const handleSubmit = async () => {
    form.setSubmitted(true)
    Keyboard.dismiss()
    if (code) {
      form.reset()
      if (type === 'coupon') {
        const { couponCode } = await dispatch(cart.actions.addCouponToCart(code.toUpperCase()))

        if (couponCode) {
          onCouponAddedToCart()
        }
      }
      if (type === 'gift') {
        await dispatch(cart.actions.addGiftCertificateToCart(code))
      }
    }
    form.setSubmitted(false)
  }

  return (
    <Container rows align pb={1} ph={2} testID={`CartTabs.CartCode.${type}`}>
      <Container flex={1} justify="center">
        <FormAccessoryView
          name={type}
          placeholder={placeholder}
          inputAccessoryText={inputAccessoryText}
          onSubmitEditing={handleSubmit}
          condensed
          required={false}
          fieldType="code"
          autoCapitalize="characters"
          containerProps={{ ml: -0.5, mr: isFocused ? 0 : -0.5 }}
          inputStyle={styles}
          form={form}
          inputAccessoryViewID={type}
          testID={`CartTabs.CartCode.${type}.form`}
        />
      </Container>
      {isFocused && (
        <CustomButton
          ml={0.5}
          background="black"
          style={{ visibility: 'hidden', justifyContent: 'center' }}
          textStyle={{ letterSpacing: 1 }}
          fontSize={11}
          semiBold
          disabled={loading || !code}
          onPress={handleSubmit}
          width={80}
          height={height}
          testID={`CartTabs.CartCode.${type}.apply`}
        >
          {loading ? (
            <Container>
              <Loading />
            </Container>
          ) : (
            'Apply'
          )}
        </CustomButton>
      )}
    </Container>
  )
}

const CartCodes = ({ onCouponAddedToCart, maxGiftCardCodes, giftPlaceholder }) => {
  const [inputAccessoryText] = useClipboard()

  return (
    <Container pv={1}>
      <CartCode
        type="coupon"
        placeholder="ADD PROMO CODE"
        onCouponAddedToCart={onCouponAddedToCart}
        inputAccessoryText={inputAccessoryText}
      />
      {maxGiftCardCodes > 0 && (
        <>
          <Hr full style={[styles.hr, { marginBottom: 10 }]} />
          <CartCode
            type="gift"
            placeholder={giftPlaceholder}
            onCouponAddedToCart={onCouponAddedToCart}
            inputAccessoryText={inputAccessoryText}
          />
        </>
      )}
      <Hr full style={styles.hr} />
    </Container>
  )
}

export default CartCodes
