import React from 'react'
import { Switch } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AnimatedColorView from '../ui/AnimatedColorView'
import useCartTotals from './utils/useCartTotals'
import { isValidNumber } from '../../utils/validation'
import useCustomerCredits from '../account/hooks/useCustomerCredits'

type CartPaymentStoreCreditsProps = {
  isEnabled: boolean
  onStoreCreditPress: (credit: number) => void
}

const CartStoreCreditsPayment = ({ isEnabled = true, onStoreCreditPress }: CartPaymentStoreCreditsProps) => {
  const { storeCredits } = useCustomerCredits()
  const { grandTotal } = useCartTotals({ storeCredits })
  const remainingStoreCredits =
    isValidNumber(storeCredits) && isValidNumber(grandTotal) && storeCredits > grandTotal
      ? (storeCredits - grandTotal).toFixed(2)
      : 0

  if (!storeCredits) return null

  return (
    <AnimatedColorView
      active={isEnabled}
      styles={{ paddingVertical: 10, paddingHorizontal: 11, borderBottomWidth: 1, borderColor: theme.borderColor }}
      inactiveColor={theme.backgroundLightGrey}
      activeColor={theme.white}
    >
      <Container rows align justify="flex-start">
        <Switch
          style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
          trackColor={{ false: theme.textGreyDark, true: theme.black }}
          thumbColor={theme.white}
          onValueChange={shouldUseCredit => onStoreCreditPress(shouldUseCredit ? storeCredits : 0)}
          value={isEnabled}
        />
        <Container rows justify="flex-start" ml={1} align>
          <Container style={{ width: 60 }}>
            <Type semiBold heading size={13} lineHeight={22} letterSpacing={1} center>
              ${storeCredits}
            </Type>
          </Container>
          <Container>
            <Type pl={2} heading semiBold={isEnabled} size={12} lineHeight={22} letterSpacing={1}>
              use store credit
            </Type>
            {!!remainingStoreCredits && (
              <Type pl={2} heading size={11} letterSpacing={1}>
                (+ ${remainingStoreCredits} remaining)
              </Type>
            )}
          </Container>
        </Container>
      </Container>
    </AnimatedColorView>
  )
}

export default CartStoreCreditsPayment
