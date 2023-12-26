import { isNumberBetween, isValidArray, isValidNumber, isValidObject, isLuxuryBrandProduct } from '../validation'
import { isBeautyIQUrl } from '../../navigation/router/screenRouter'

describe('validation tests', () => {
  it('check arrays are valid', () => {
    expect(isValidArray([0])).toBe(true)
    expect(isValidArray([])).toBe(false)
    expect(isValidArray('')).toBe(false)
    expect(isValidArray([''])).toBe(true)
    expect(isValidArray([null])).toBe(true)
    expect(isValidArray(null)).toBe(false)
  })

  it('check objects are valid', () => {
    expect(isValidObject({})).toBe(false)
    expect(isValidObject(null)).toBe(false)
    expect(isValidObject('')).toBe(false)
    expect(isValidObject('string')).toBe(false)
    expect(isValidObject(0)).toBe(false)
    expect(isValidObject(1)).toBe(false)
    expect(isValidObject({ a: 'b' })).toBe(true)
    expect(isValidObject({ a: undefined })).toBe(true)
  })

  it('check numbers are valid', () => {
    expect(isValidNumber(1)).toBe(true)
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(0.1)).toBe(true)
    expect(isValidNumber('1')).toBe(true)
    expect(isValidNumber('0.1')).toBe(true)
    expect(isValidNumber('a')).toBe(false)
    expect(isValidNumber([])).toBe(false)
  })

  it('check if number is between a range', () => {
    expect(isNumberBetween(5, 1, 100)).toBe(true)
    expect(isNumberBetween(2, 30, 40)).toBe(false)
    expect(isNumberBetween(0, 1, 3)).toBe(false)
    expect(isNumberBetween(undefined, 0, 10)).toBe(false)
    expect(isNumberBetween(null, 500, 100)).toBe(false)
    expect(isNumberBetween(328, 200, 400)).toBe(true)
  })

  it('check if product brand is luxury', () => {
    expect(isLuxuryBrandProduct({ display_type: 'Luxury' })).toBe(true)
    expect(isLuxuryBrandProduct({ is_luxury: true })).toBe(true)
    expect(isLuxuryBrandProduct(null)).toBe(false)
    expect(isLuxuryBrandProduct({})).toBe(false)
    expect(isLuxuryBrandProduct({ dislay_type: 'other' })).toBe(false)
  })

  it('check beautyiq url', () => {
    expect(
      isBeautyIQUrl(
        'https://www.adorebeauty.com.au/beautyiq/skin-care/best-skin-care-products-for-40-year-olds-australia/'
      )
    ).toBe(true)
    expect(isBeautyIQUrl('https://www.adorebeauty.com.au/beautyiq/category/skin-care/')).toBe(false)
    expect(isBeautyIQUrl('https://www.adorebeauty.com.au/beautyiq/')).toBe(false)
    expect(
      isBeautyIQUrl('https://www.adorebeauty.com.au/skin-care/best-skin-care-products-for-40-year-olds-australia/')
    ).toBe(false)
  })
})
