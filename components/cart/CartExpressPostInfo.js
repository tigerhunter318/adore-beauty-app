import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import { formatCurrency } from '../../utils/format'

const CartExpressPostInfo = ({ cartDetails, minAmount }) => {
  const total = parseFloat(cartDetails?.grand_total)
  const isExpressPostQualified = total >= minAmount

  return (
    <Container pl={2} pr={1.6}>
      <Container rows align justify="space-between">
        <Container rows center>
          <AdoreSvgIcon name="mail" height={30} width={30} />
          <Container ml={1}>
            <Type semiBold heading color={theme.lightBlack}>
              Express Post
            </Type>
          </Container>
        </Container>
        {isExpressPostQualified && (
          <Container backgroundColor={theme.orange} ph={0.8} pv={0.1}>
            <Type heading semiBold color={theme.white}>
              Free
            </Type>
          </Container>
        )}
      </Container>
      <Container mt={1} pl={0.7}>
        <Type size={11} heading color={theme.lighterBlack} letterSpacing={0.3} semiBold>
          {isExpressPostQualified
            ? 'YAY - You have qualified for Free Express Delivery!'
            : `Spend ${formatCurrency(minAmount - total)} more to get free express post`}
        </Type>
      </Container>
    </Container>
  )
}

export default CartExpressPostInfo
