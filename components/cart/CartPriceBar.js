import React from 'react'
import { View } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { formatCurrency } from '../../utils/format'
import { useActionState } from '../../store/utils/stateHook'
import Loading from '../ui/Loading'
import theme from '../../constants/theme'
import PaymentIcon from '../ui/PaymentIcon'
import CustomButton from '../ui/CustomButton'
import { isIos } from '../../utils/device'
import CartApplePayButton from './CartApplePayButton'
import CartPriceBarGiftCertificates from './CartPriceBarGiftCertificates'
import Hr from '../ui/Hr'
import { useSafeInsets } from '../../utils/dimensions'
import useCartTotals from './utils/useCartTotals'

const styleSheet = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 4,
    width: '100%',
    height: 10,
    borderTopWidth: 2,
    borderColor: theme.borderColor,
    position: 'absolute'
  },
  border: {
    width: '100%',
    height: 2,
    borderTopWidth: 2,
    borderColor: theme.borderColor
  },
  container: {
    height: 152,
    backgroundColor: 'white'
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginRight: 10
  },
  priceContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'baseline'
  },
  hr: {
    backgroundColor: theme.borderColor,
    height: 1,
    marginTop: 0,
    marginBottom: 0
  }
}

export const SummaryRow = ({ title, price, bold, heading, loading, size = 13 }) => {
  const isTotal = price >= 0 && title === 'Total'
  const isSum = isTotal || title === 'Order summary' || title === 'Shipping'

  return (
    <Container>
      <Container rows justify="space-between" pv={1.5}>
        <Container width="80%">
          <Type bold={isTotal} size={size} heading={heading} letterSpacing={0.5} color={theme.lightBlack}>
            {title}
          </Type>
        </Container>
        <Container>
          {!loading && (
            <Type
              semiBold={!isTotal}
              bold={bold}
              size={isTotal ? 18 : size}
              letterSpacing={1}
              heading={heading}
              isLoading
              color={isSum ? theme.lightBlack : theme.orange}
            >
              {isSum ? formatCurrency(price) : `- ${formatCurrency(price)}`}
            </Type>
          )}
          {loading && (
            <Container style={{ height: 22 }}>
              <Loading size="small" color={theme.lightBlack} animating />
            </Container>
          )}
        </Container>
      </Container>
      {title !== 'Total' && <Hr full style={styleSheet.hr} />}
    </Container>
  )
}

const CartPriceBar = ({
  hasLogos,
  shippingCost,
  onButtonPress,
  buttonLabel,
  buttonTestID,
  buttonDisabled,
  hasTotal = true,
  icon,
  lineItems,
  hasApplePay,
  buttonComponent,
  defaultShippingAddress,
  defaultShippingContact,
  storeCredits
}) => {
  const { bottom } = useSafeInsets()
  const isPending = useActionState('cart.request.pending')
  const cartState = useActionState('cart')

  let label = 'CHECK OUT SECURELY'
  if (isPending) {
    label = 'Updating bag...'
  }

  const disabled = isPending || buttonDisabled

  const {
    orderSummary,
    discountTotal,
    totalCost,
    shippingTotal,
    giftCertificatesDiscount,
    storeCreditsDiscount
  } = useCartTotals({ storeCredits, shippingCost })

  return (
    <View style={{ marginBottom: !isIos() ? 10 : 0 }}>
      <View style={isIos() ? styleSheet.shadow : styleSheet.border} />
      {hasTotal && (
        <Container pv={0.5} ph={2} backgroundColor="white">
          {(!!shippingTotal || !!discountTotal || !!giftCertificatesDiscount || !!storeCreditsDiscount) && (
            <SummaryRow title="Order summary" price={orderSummary} />
          )}
          {!!shippingTotal && <SummaryRow title="Shipping" price={shippingTotal} />}
          {!!discountTotal && <SummaryRow title="Discounts" price={-discountTotal} />}
          {!!giftCertificatesDiscount && (
            <CartPriceBarGiftCertificates giftCertificatesDiscount={-giftCertificatesDiscount} loading={isPending} />
          )}
          {!!storeCreditsDiscount && <SummaryRow title="Store credit" price={storeCreditsDiscount} />}
          <SummaryRow title="Total" price={totalCost} bold size={14} heading loading={isPending} />
        </Container>
      )}
      <Container backgroundColor={theme.white} ph={2}>
        <Container>
          {buttonComponent ?? (
            <CustomButton
              label={buttonLabel || label}
              onPress={onButtonPress}
              iconSize={20}
              semiBold
              pv={1.2}
              disabled={disabled}
              icon={icon}
              iconStyle={{ paddingBottom: 1 }}
              textStyle={{ letterSpacing: 1 }}
              testID={buttonTestID}
              background={hasApplePay ? 'white' : undefined}
              height={44}
            />
          )}
          {hasApplePay && (
            <Container pt={1}>
              <CartApplePayButton
                lineItems={lineItems}
                cartState={cartState}
                disabled={disabled}
                shippingAddress={defaultShippingAddress}
                shippingAccount={defaultShippingContact}
              />
            </Container>
          )}
        </Container>
      </Container>
      {hasLogos && (
        <Container rows justify="space-between" align pt={1} pb={bottom === 0 ? 1 : 0} ph={4}>
          <PaymentIcon name="visa" />
          <PaymentIcon name="mcard" />
          <PaymentIcon name="amex" />
          <PaymentIcon name="paypal" />
          <PaymentIcon name="applepay" />
          <PaymentIcon name="googlepay" />
        </Container>
      )}
    </View>
  )
}

export default CartPriceBar
