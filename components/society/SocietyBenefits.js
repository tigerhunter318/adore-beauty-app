import React from 'react'
import SocietyFeatureCard from './SocietyFeatureCard'
import Container from '../ui/Container'
import { px } from '../../utils/dimensions'
import { BeRewarded } from './SocietyAssets'

const benefits = [
  {
    text: 'Birthday or Anniversary reward',
    icon: {
      name: 'Gift',
      width: px(30),
      height: px(30)
    }
  },
  {
    text: 'Free express delivery $50+',
    icon: {
      name: 'Shipping',
      width: px(40),
      height: px(30)
    }
  },
  {
    text: 'Money can’t buy experiences',
    icon: {
      name: 'Ticket',
      width: px(30),
      height: px(30)
    }
  },
  {
    text: 'Member-only promos',
    icon: {
      name: 'Star',
      width: px(40),
      height: px(30)
    }
  },
  {
    text: 'Refer a friend rewards',
    icon: {
      name: 'ShareGift',
      width: px(60),
      height: px(30)
    }
  }
]

const SocietyBenefits = ({ icons = ['Gift', 'Ticket', 'Star', 'ShareGift'], containerStyle = {} }) => {
  const benefitsData = benefits.filter(benefit => icons.includes(benefit.icon.name))

  const renderItem = item => <SocietyFeatureCard {...item} key={item.icon.name} />

  return (
    <Container style={containerStyle}>
      <Container center pv={1}>
        <BeRewarded width={px(230)} />
      </Container>
      {benefitsData?.length >= 2 && <Container rows>{benefitsData.slice(0, 2).map(renderItem)}</Container>}
      {benefitsData?.length >= 4 && <Container rows>{benefitsData.slice(2, 4).map(renderItem)}</Container>}
    </Container>
  )
}

export default SocietyBenefits
