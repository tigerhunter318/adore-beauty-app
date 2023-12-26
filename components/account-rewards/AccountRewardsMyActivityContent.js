import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { formatDate } from '../../utils/date'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 17
  }
})

const extractDescription = data => {
  let description
  if (data?.name === 'Purchase') {
    const activityData = data?.elements.find(activity => activity.type === 'purchase_points')
    description = `Order: ${data?.order_id} +$${activityData?.points}`
  } else {
    const activityData = data?.elements.find(activity => activity.text)
    description = activityData?.text
  }
  return description
}

const AccountRewardsMyActivityContent = ({ data }) => (
  <Container ph={2.2} pv={2.2}>
    {data?.map(activity => (
      <Container style={[styles.container]} border={theme.borderColor} mt={1.5}>
        <Container>
          <Type size={8} lineHeight={10} letterSpacing={1} color={theme.lighterBlack}>
            {formatDate(activity?.activity_time, 'DD/MM/YYYY')}
          </Type>
        </Container>
        <Container mt={0.7}>
          <Type size={11} bold lineHeight={14} letterSpacing={1.1} color={theme.black}>
            {activity?.name}
          </Type>
          <Container mt={1.6}>
            <Type heading size={10} lineHeight={10} letterSpacing={0.91}>
              {extractDescription(activity)}
            </Type>
          </Container>
        </Container>
      </Container>
    ))}
  </Container>
)

export default AccountRewardsMyActivityContent
