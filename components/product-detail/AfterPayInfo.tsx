import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import { isPaymentMethodEnabled } from '../../services/paymentMethods'

type AfterPayInfoProps = {
  installments: string | any
  toggleAfterPayModal: () => void
  style: {} | any
}

const AfterPayInfo = ({ installments, toggleAfterPayModal, ...rest }: AfterPayInfoProps) => {
  const isAfterpayEnabled = isPaymentMethodEnabled('afterpay')

  if (!installments || !isAfterpayEnabled) return null

  return (
    <Container {...rest}>
      <Type size={13} color={theme.lightBlack}>
        {installments}
      </Type>
      <Container rows align>
        <Container>
          <AdoreSvgIcon name="Tick" width={12} height={12} color={theme.lightBlack} />
        </Container>
        <Container>
          <AdoreSvgIcon name="AfterpayLogo" width={88} height={40} color={theme.lightBlack} />
        </Container>
        <Container rows align onPress={toggleAfterPayModal}>
          <Type size={13} color={theme.lightBlack} bold heading>
            LEARN MORE
          </Type>
          <Container pl={0.3}>
            <AdoreSvgIcon name="ArrowRight" width={8} height={8} color={theme.lightBlack} />
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

export default AfterPayInfo
