import React from 'react'
import Container from '../ui/Container'
import AccountRewardsRedeemContentItem from './AccountRewardsRedeemContentItem'

const AccountRewardsRedeemContent = ({ data }) => (
  <Container ph={2.2} pv={2.2}>
    {data?.map((voucher, index) => (
      <AccountRewardsRedeemContentItem data={voucher} key={`voucher_${index}`} />
    ))}
  </Container>
)

export default AccountRewardsRedeemContent
