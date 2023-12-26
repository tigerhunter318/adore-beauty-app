import { useActionState } from '../../../store/utils/stateHook'

type useCheckoutProps = { shippingCost?: number; storeCredits?: number }

type CartTotalsResult = {
  discountTotal: number
  totalCost: number
  shippingTotal: number
  giftCertificatesDiscount: number
  storeCreditsDiscount: number
  orderSummary: number
  subTotal: number
  grandTotal: number
}

const getDiscountedTotal = (total: number, discount: number): number => {
  const result = Number((discount - total).toFixed(2))
  return result >= 0 ? 0 : -result
}
export const getCartTotals = (
  cartState: any = {},
  shippingCost: number = undefined,
  storeCredits: number = 0
): CartTotalsResult => {
  const cartDetails = cartState?.details
  const checkoutData = cartState?.checkout
  const checkoutCartData = cartState?.checkout?.cart
  const giftCertificates = cartState?.giftCertificates
  const totalGiftCertificatesDiscount = giftCertificates?.reduce((acc, { balance }) => acc + parseFloat(balance), 0)
  const grandTotal = checkoutData?.grand_total
  let giftCertificatesDiscount = 0
  let storeCreditsDiscount = 0
  let discountTotal = 0
  let totalCost = 0
  let shippingTotal = 0
  const subTotal = checkoutData?.subtotal_inc_tax || 0
  if (checkoutCartData?.discounts?.length > 0) {
    discountTotal = checkoutCartData.discounts.reduce((acc, item) => acc + parseFloat(item.discounted_amount || 0), 0.0)
  }
  if (cartDetails?.id) {
    totalCost = cartDetails.cart_amount
  }
  if (checkoutCartData?.id) {
    totalCost = checkoutData.cart_amount_inc_tax
  }
  if (checkoutData?.grand_total) {
    totalCost = checkoutData.grand_total
  }

  if (shippingCost !== undefined) {
    shippingTotal = shippingCost
    totalCost -= checkoutData?.shipping_cost_total_inc_tax || 0
    totalCost += shippingCost
  } else if (checkoutData?.shipping_cost_total_inc_tax) {
    shippingTotal = checkoutData.shipping_cost_total_inc_tax
  }

  if (totalGiftCertificatesDiscount) {
    giftCertificatesDiscount = totalGiftCertificatesDiscount >= totalCost ? totalCost : totalGiftCertificatesDiscount
    totalCost = getDiscountedTotal(totalCost, totalGiftCertificatesDiscount)
  }

  if (storeCredits) {
    storeCreditsDiscount = storeCredits >= totalCost ? totalCost : storeCredits
    totalCost = getDiscountedTotal(totalCost, storeCredits)
  }

  return {
    grandTotal,
    discountTotal,
    totalCost,
    shippingTotal,
    giftCertificatesDiscount,
    storeCreditsDiscount,
    orderSummary: subTotal,
    subTotal
  }
}
const useCartTotals = ({ storeCredits, shippingCost }: useCheckoutProps): CartTotalsResult => {
  const cartState: any = useActionState('cart')
  return getCartTotals(cartState, shippingCost, storeCredits)
}
export default useCartTotals
