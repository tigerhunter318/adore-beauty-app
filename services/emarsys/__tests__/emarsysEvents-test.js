import { emarsysEvents } from '../emarsysEvents'
import purchaseInput from '../__mockdata__/purchaseInput.json'
import purchaseResult from '../__mockdata__/purchaseResult.json'
import customPurchaseResult from '../__mockdata__/customPurchaseResult.json'
import checkoutInput from '../__mockdata__/checkoutInput.json'
import checkoutProductsInput from '../__mockdata__/checkoutProductsInput.json'
import viewCartResult from '../__mockdata__/viewCartResult.json'
import recommendationClickInput from '../__mockdata__/recommendationClickInput.json'
import trackUpdatedCartResult from '../__mockdata__/trackUpdatedCartResult.json'
import trackProductViewResult from '../__mockdata__/trackProductViewResult.json'

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'iOS',
  select: jest.fn(() => 'iOS')
}))

jest.mock('react-native-emarsys-wrapper', () => {
  const mockedModule = {
    __esModule: true,
    default: {
      predict: {
        trackItemView: jest.fn(() => ({ success: true })),
        trackPurchase: jest.fn(() => ({ success: true })),
        trackCart: jest.fn(() => ({ success: true })),
        trackCategoryView: jest.fn(() => ({ success: true })),
        trackSearchTerm: jest.fn(() => ({ success: true })),
        trackRecommendationClick: jest.fn(() => ({ success: true })),
        trackJoinAdoreSociety: jest.fn(() => ({ success: true })),
        trackTag: jest.fn(() => ({ success: true }))
      },
      trackCustomEvent: jest.fn(() => ({ success: true }))
    }
  }
  return mockedModule
})

describe('emarsys events', () => {
  it('can trackItemView', async () => {
    const result = await emarsysEvents.trackItemView(1)
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackPurchase', async () => {
    const result = await emarsysEvents.trackPurchase(purchaseInput)
    expect(result).toMatchObject(purchaseResult)
  })

  it('can trackCart', async () => {
    const result = await emarsysEvents.trackCart(checkoutInput, checkoutProductsInput)
    expect(result).toMatchObject(viewCartResult)
  })

  it('can trackCategoryView', async () => {
    const result = await emarsysEvents.trackCategoryView(['home', 'category'])
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackSearchTerm', async () => {
    const result = await emarsysEvents.trackSearchTerm('kerastase')
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackRecommendationClick', async () => {
    const result = await emarsysEvents.trackRecommendationClick(recommendationClickInput)
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackTag', async () => {
    const eventData = {}
    const result = await emarsysEvents.trackTag('tag', eventData)
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackCustomEvent', async () => {
    const eventData = {}
    const result = await emarsysEvents.trackCustomEvent('addToWishlist', eventData)
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackScreen', async () => {
    const result = await emarsysEvents.trackScreen('Promotions screen')
    const expectResult = { name: 'Promotions screen' }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackJoinAdoreSociety', async () => {
    const result = await emarsysEvents.trackCustomEvent('joinedAdoreSociety', 'iOS')
    const expectResult = { success: true }
    expect(result).toMatchObject(expectResult)
  })

  it('can trackCustomPurchase', async () => {
    const result = await emarsysEvents.trackCustomPurchase(purchaseInput)
    expect(result).toMatchObject(customPurchaseResult)
  })

  it('can trackUpdatedCart', async () => {
    const result = await emarsysEvents.trackUpdatedCart(13.9, checkoutInput, checkoutProductsInput)
    expect(result).toMatchObject(trackUpdatedCartResult)
  })

  it('can trackProductView', async () => {
    const result = await emarsysEvents.trackProductView(checkoutProductsInput[0])
    expect(result).toMatchObject(trackProductViewResult)
  })
})
