import branchEvents from '../branch/branchEvents'
import addToCartInput from '../__mockdata__/addToCartInput.json'
import addToCartResult from '../__mockdata__/addToCartResult.json'
import viewCartInput from '../__mockdata__/viewCartInput.json'
import viewCartResult from '../__mockdata__/viewCartResult.json'
import checkoutInput from '../__mockdata__/checkoutInput.json'
import checkoutResult from '../__mockdata__/checkoutResult.json'
import purchaseInput from '../__mockdata__/purchaseInput.json'
import purchaseResult from '../__mockdata__/purchaseResult.json'
import viewProductInput from '../__mockdata__/viewProductInput.json'
import viewProductResult from '../__mockdata__/viewProductResult.json'
import viewPostInput from '../__mockdata__/viewPostInput.json'
import viewPostResult from '../__mockdata__/viewPostResult.json'
import loginInput from '../__mockdata__/loginInput.json'
import loginResult from '../__mockdata__/loginResult.json'
import signupInput from '../__mockdata__/signupInput.json'
import signupResult from '../__mockdata__/signupResult.json'
import viewProductsInput from '../__mockdata__/viewProductsInput.json'
import viewProductsResult from '../__mockdata__/viewProductsResult.json'

describe('branch events', () => {
  it('can trackAddToCart', async () => {
    const result = await branchEvents.trackAddToCart(addToCartInput)
    expect(result).toMatchObject(addToCartResult)
  })
  it('can trackViewCart', async () => {
    const result = await branchEvents.trackViewCart(viewCartInput)
    expect(result).toMatchObject(viewCartResult)
  })
  it('can trackCheckout', async () => {
    const result = await branchEvents.trackCheckout(checkoutInput)
    expect(result).toMatchObject(checkoutResult)
  })
  it('can trackPurchase', async () => {
    const result = await branchEvents.trackPurchase(purchaseInput)
    expect(result).toMatchObject(purchaseResult)
  })
  it('can trackViewProduct', async () => {
    const result = await branchEvents.trackViewProduct(viewProductInput, { description: 'quick-view' })
    expect(result).toMatchObject(viewProductResult)
  })
  it('can trackViewPost', async () => {
    const result = await branchEvents.trackViewPost(viewPostInput)
    expect(result).toMatchObject(viewPostResult)
  })
  it('can trackLogin', async () => {
    const result = await branchEvents.trackLogin(loginInput, { loginMethod: 'facebook' })
    expect(result).toMatchObject(loginResult)
  })
  it('can trackSignup', async () => {
    const result = await branchEvents.trackSignup(signupInput, { loginMethod: 'facebook' })
    expect(result).toMatchObject(signupResult)
  })

  it('can trackViewProducts', async () => {
    const result = await branchEvents.trackViewProducts(viewProductsInput)
    expect(result).toMatchObject(viewProductsResult)
  })
})
