import React, { useState } from 'react'
import { isDev } from '../../utils/dev'
import Container from '../ui/Container'
import Type from '../ui/Type'
import CustomButton from '../ui/CustomButton'
import { checkoutTests } from '../../store/__e2e__/checkout.e2e'
import CustomModal from '../ui/CustomModal'
import Hr from '../ui/Hr'

const buttonStyleProps = {
  mb: 1,
  ml: 0.5,
  mr: 0.5,
  borderRadius: 3,
  fontSize: 10,
  bold: true
}
const CartTestsContent = () => (
  <Container ph={3} mb={3}>
    <Type center mb={0.5}>
      Checkout tests
    </Type>
    <Container rows style={{ flexWrap: 'wrap' }} justify="center">
      <CustomButton background="white" onPress={checkoutTests.reset} {...buttonStyleProps}>
        Clear Cart
      </CustomButton>
      <CustomButton onPress={checkoutTests.loginCustomerAccount} {...buttonStyleProps}>
        login get account
      </CustomButton>
      <Hr mb={1} />
      <CustomButton onPress={checkoutTests.guestCheckout} {...buttonStyleProps}>
        Guest Checkout
      </CustomButton>
      <CustomButton onPress={checkoutTests.loginAndCheckout} {...buttonStyleProps}>
        Login, Add To Cart, Checkout
      </CustomButton>
      <CustomButton onPress={checkoutTests.addToCartThenLoginThenCheckout} {...buttonStyleProps}>
        Add To Cart, Login & Checkout
      </CustomButton>
      <Hr mb={1} />
      <CustomButton onPress={checkoutTests.guestCheckoutTests} {...buttonStyleProps}>
        Auth Token
      </CustomButton>
      <CustomButton onPress={checkoutTests.refreshCustomerToken} {...buttonStyleProps}>
        refresh token
      </CustomButton>
      <CustomButton onPress={checkoutTests.signupCustomerAccount} {...buttonStyleProps}>
        signup get account
      </CustomButton>
      <CustomButton onPress={checkoutTests.signupCustomerRefresh} {...buttonStyleProps}>
        signup, refresh token
      </CustomButton>

      <CustomButton onPress={checkoutTests.signupAndCheckout} {...buttonStyleProps}>
        Signup, Add To Cart, Checkout
      </CustomButton>
      <CustomButton onPress={checkoutTests.addToCartThenSignupThenCheckout} {...buttonStyleProps}>
        Add To Cart, Then Signup & Checkout
      </CustomButton>
      <CustomButton onPress={checkoutTests.addMultipleToCart} {...buttonStyleProps}>
        Add Multiple To Cart
      </CustomButton>
      <CustomButton onPress={checkoutTests.addToCartThenChangeThenRemove} {...buttonStyleProps}>
        Add, Change, Remove Cart item
      </CustomButton>
      <CustomButton onPress={checkoutTests.addToCartThenAddCoupon} {...buttonStyleProps}>
        Cart coupon
      </CustomButton>
    </Container>
  </Container>
)
const CartDebugTests = ({ buttonStyle }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  return (
    isDev() && (
      <Container>
        <CustomButton {...buttonStyle} onPress={() => setIsModalVisible(true)}>
          Cart
        </CustomButton>
        <CustomModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <CartTestsContent />
        </CustomModal>
      </Container>
    )
  )
}
export default CartDebugTests
