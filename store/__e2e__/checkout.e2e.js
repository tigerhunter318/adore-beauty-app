import store from '../store'
import customer from '../modules/customer'
import mockData from '../__mocks__/mockData'
import { expect, test } from '../../utils/tests'
import cart from '../modules/cart'

const { dispatch, getState } = store

const verifyEmail = async () => {
  await test('verifyEmail', async () => {
    const response = await dispatch(customer.actions.verifyEmail(mockData.account))
    expect(response.data.bigcommerce_exists).toBe(false)
    expect(getState().customer.account.email).toBe(mockData.account.email)
    expect(typeof getState().customer.account).toBe('object')
  })
}

const loginCustomer = async () => {
  await test('loginUser', async () => {
    const response = await dispatch(customer.actions.verifyEmail(mockData.login))
    expect(response.data.bigcommerce_exists).toBe(true)
    const data = await dispatch(customer.actions.login(mockData.login))
    expect(typeof data.token).toBe('string')
    expect(typeof getState().customer.account.token).toBe('string')
    expect(getState().customer.account.email).toBe(mockData.login.email)
    expect(getState().customer.account.first_name).toBe(mockData.login.first_name)
    expect(getState().customer.account.last_name).toBe(mockData.login.last_name)
    expect(typeof getState().customer.account.big_commerce_id).toBe('number')
  })
}

const loginHasValidToken = async () => {
  await test('loginUser token', async () => {
    const data = await dispatch(customer.actions.login(mockData.login))
    expect(typeof data.token).toBe('string')
    expect(typeof getState().customer.account.token).toBe('string')
    expect(getState().customer.account.email).toBe(mockData.login.email)
    expect(getState().customer.account.first_name).toBe(mockData.login.first_name)
    expect(getState().customer.account.last_name).toBe(mockData.login.last_name)
    expect(typeof getState().customer.account.big_commerce_id).toBe('number')
  })
}

const getCustomerOrders = async () => {
  await test('get customer orders', async () => {
    await dispatch(cart.actions.fetchCustomerOrders())
    expect(getState().cart.customerOrders[0].customer_id).toBe(getState().customer.account.big_commerce_id)
  })
}

const getCustomerAcount = async () => {
  await test('get customer', async () => {
    await dispatch(customer.actions.fetchAccount())
    expect(typeof getState().customer.account.token).toBe('string')
  })
}

const refreshCustomerToken = async () => {
  await test('customer token refresh', async () => {
    const oldToken = getState().customer.account.token
    const oldTime = getState().customer.account.token_valid_until
    await dispatch(customer.actions.loginRefresh())
    const newToken = getState().customer.account.token
    const newTime = getState().customer.account.token_valid_until
    expect(typeof oldTime).toBe('number')
    expect(typeof newTime).toBe('number')
    expect(typeof newToken).toBe('string')
    expect(oldToken !== newToken).toBe(true)
    expect(oldTime !== newTime).toBe(true)
  })
}

const signupCustomer = async () => {
  await test('signup customer', async () => {
    const email = `${new Date().getTime()}@test.com`
    const payload = { ...mockData.signup, email }
    const data = await dispatch(customer.actions.signup(payload))
    expect(typeof data.token).toBe('string')
    expect(typeof getState().customer.account.token).toBe('string')
    expect(getState().customer.account.email).toBe(email)
    expect(getState().customer.account.first_name).toBe(payload.first_name)
    expect(getState().customer.account.last_name).toBe(payload.last_name)
    expect(typeof getState().customer.account.big_commerce_id).toBe('number')
  })
}

const changeItemQuantity = async () => {
  await test('change cart item quantity', async () => {
    const item = getState().cart.checkout.cart.line_items.physical_items[0]
    await dispatch(cart.actions.changeLineItemQuantity(item, 5))
    expect(getState().cart.checkout.grand_total).toBe(125)
    expect(getState().cart.checkout.cart.line_items.physical_items[0].quantity).toBe(5)
  })
}
const removeItemFromCart = async () => {
  await test('remove item from cart', async () => {
    const item = getState().cart.checkout.cart.line_items.physical_items[0]
    await dispatch(cart.actions.removeLineItem(item))
    // expect(getState().cart.checkout.grand_total).toBe(125)
  })
}
const addCartCoupon = async () => {
  await test('add coupon to cart', async () => {
    const couponCode = 'TESTING1234'
    await dispatch(cart.actions.addCouponToCart(couponCode))
    expect(getState().cart.checkout.cart.coupons[0].code).toBe(couponCode)
    expect(getState().cart.checkout.cart.coupons[0].discounted_amount).toBe(2.5)
    expect(getState().cart.checkout.grand_total).toBe(25 - 2.5)
  })
}

const addGiftCertificate = async () => {
  await test('add gift certificate to cart', async () => {
    const giftCertificateCode = 'YD6-C6F-UIA-998'
    await dispatch(cart.actions.addGiftCertificateToCart(giftCertificateCode))
    expect(getState().cart.checkout.cart.giftCertificates[0].code).toBe(giftCertificateCode)
    expect(getState().cart.checkout.cart.giftCertificates[0].amount).toBe(1)
    expect(getState().cart.checkout.grand_total).toBe(25 - 1)
  })
}

const addToCartThenAddCoupon = async () => {
  await beforeEach()
  await addToCart({ productSku: 'LG100' })
  await addCartCoupon()
}

const addToCartThenAddGiftCertificate = async () => {
  await beforeEach()
  await addToCart({ productSku: 'LG100' })
  await addGiftCertificate()
}

const addToCartThenChangeThenRemove = async () => {
  await beforeEach()
  await addToCart()
  await changeItemQuantity()
  await removeItemFromCart()
}
const addMultipleToCart = async () => {
  await beforeEach()
  await test('cart mutliple addToCart', async () => {
    await dispatch(cart.actions.addProductsBySku(mockData.addToCartMultiple))
    // expect(typeof getState().cart.checkout.cart.id).toBe('string')
    expect(getState().cart.checkout.cart.line_items.physical_items.length).toBe(4)
    expect(getState().cart.checkout.grand_total).toBe(126.3)
  })
}
const addToCart = async item => {
  await test('cart addToCart', async () => {
    await dispatch(cart.actions.addProductBySku(item || mockData.addToCart))
    expect(typeof getState().cart.checkout.cart.id).toBe('string')
    // expect(getState().cart.checkout.grand_total).toBe(25)
    expect(typeof getState().cart.checkout.grand_total).toBe('number')
  })
}

const isCustomerAddedToOrder = async () => {
  await test('isCustomerAddedToOrder', async () => {
    expect(typeof getState().cart.orderConfirmation.customer_id).toBe('number')
    expect(getState().cart.orderConfirmation.customer_id).toBe(getState().customer.account.big_commerce_id)
  })
}
const isCustomerAddedToCart = async () => {
  await test('customerAddedToCart', async () => {
    expect(getState().cart.checkout.cart.customer_id).toBe(getState().customer.account.big_commerce_id)
  })
}

const addCheckoutAddress = async address => {
  await test('cart addAddress', async () => {
    await dispatch(cart.actions.addAddress(address))
    expect(getState().cart.checkout.billing_address.first_name).toBe(address.firstName)
    expect(typeof getState().cart.checkout.billing_address.email).toBe('string')
    expect(getState().cart.checkout.billing_address.email).toBe(getState().customer.account.email)
    expect(getState().cart.billingAddress).toEqual(address)
    expect(typeof getState().cart.checkout.consignments[0].id).toBe('string')
    expect(getState().cart.checkout.consignments[0].available_shipping_options.length >= 2).toBe(true)
    expect(typeof getState().cart.checkout.consignments[0].available_shipping_options[1].id).toBe('string')
  })
}
const addCheckoutShipping = async () => {
  await test('cart addShippingOption, create order, get payment types', async () => {
    const consignmentId = getState().cart.checkout.consignments[0].id
    const shippingId = getState().cart.checkout.consignments[0].available_shipping_options[0].id
    await dispatch(cart.actions.addShippingOption({ consignmentId, shippingId }))
    expect(typeof getState().cart.checkout.order_id).toBe('number')
    if (getState().cart.checkout.cart.customer_id) {
      expect(getState().cart.checkout.cart.customer_id).toBe(getState().customer.account.big_commerce_id)
    } else {
      expect(typeof getState().cart.checkout['X-Order-Token']).toBe('string')
    }
  })
}
const addCheckoutPayment = async () => {
  await test('cart processPayment, get order', async () => {
    const fakeNonce = 'fake-valid-nonce'
    const paymentReponse = await dispatch(cart.actions.processPayment(fakeNonce))
    expect(paymentReponse.success).toBe(true)
    expect(typeof getState().cart.orderConfirmation.id).toBe('number')
    expect(typeof getState().cart.orderConfirmation.transaction.id).toBe('string')
    expect(getState().cart.orderConfirmation.products[0].product_id).toBe(parseInt(mockData.addToCart.cartProductId))
    expect(getState().cart.orderConfirmation.products[0].order_id).toBe(getState().cart.orderConfirmation.id)
    expect(getState().cart.orderConfirmation.shippingAddress[0].email).toBe(getState().customer.account.email)
  })
}
const checkout = async address => {
  await addCheckoutAddress(address)
  await addCheckoutShipping()
  await addCheckoutPayment()
}

const logout = async () => {
  await test('logoutUser', async () => {
    await dispatch(customer.actions.logout())
    expect(getState().customer.account).toBe(null)
  })
}

const deleteCheckout = async () => {
  await test('deleteCheckout', async () => {
    await dispatch(cart.actions.deleteCheckout())
    expect(getState().cart.checkout).toBe(null)
  })
}

const beforeEach = async () => {
  await deleteCheckout()
  await logout()
}
export const guestCheckout = async () => {
  await beforeEach()
  await verifyEmail()
  await addToCart()
  await checkout(mockData.addAddress)
}

export const loginAndCheckout = async () => {
  await beforeEach()
  await loginCustomer()
  await getCustomerAcount()
  await addToCart()
  await isCustomerAddedToCart()
  await checkout(mockData.addAddress)
  await isCustomerAddedToOrder()
}

export const signupAndCheckout = async () => {
  await beforeEach()
  await signupCustomer()
  await addToCart()
  await isCustomerAddedToCart()
  await checkout(mockData.addAddress)
  await isCustomerAddedToOrder()
}

export const addToCartThenLoginThenCheckout = async () => {
  await beforeEach()
  await addToCart()
  await loginCustomer()
  await isCustomerAddedToCart()
  await checkout(mockData.addAddress)
  await isCustomerAddedToOrder()
}

export const addToCartThenSignupThenCheckout = async () => {
  await beforeEach()
  await addToCart()
  await signupCustomer()
  await checkout(mockData.addAddress)
  await isCustomerAddedToCart()
  await isCustomerAddedToOrder()
}

export const loginCustomerAccount = async () => {
  await beforeEach()
  await loginCustomer()
  await getCustomerAcount()
  await getCustomerOrders()
}
export const signupCustomerRefresh = async () => {
  await beforeEach()
  await signupCustomer()
  await getCustomerAcount()
  await refreshCustomerToken()
}
export const signupCustomerAccount = async () => {
  await beforeEach()
  await signupCustomer()
  await getCustomerAcount()
}

const guestCheckoutTests = async () => {
  await beforeEach()
  await loginHasValidToken()
}

export const checkoutTests = {
  reset: beforeEach,
  loginAndCheckout,
  guestCheckoutTests,
  guestCheckout,
  signupAndCheckout,
  addToCartThenSignupThenCheckout,
  addToCartThenLoginThenCheckout,
  loginCustomerAccount,
  signupCustomerAccount,
  addMultipleToCart,
  addToCartThenChangeThenRemove,
  addToCartThenAddCoupon,
  addToCartThenAddGiftCertificate,
  refreshCustomerToken,
  signupCustomerRefresh
}
