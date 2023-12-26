import React from 'react'
import { Svg, Circle, Line } from 'react-native-svg'
import LevelTitle from './AccountRewardsLevelTitle'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'

const priceRanges = ['$0 - $399', '$400 - $1499', '$1500+']
const AccountRewardsPieChart = ({ level }) => {
  const point1 = (1 / 3) * level * 100 * 3.14 * 2
  const point2 = (1 - 1 / 3) * level * 100 * 3.14 * 2
  const y1 = level === 3 ? 11 : 0
  const y2 = level === 3 ? 19 : 30

  return (
    <Svg width="230" height="230" viewBox="0 0 230 230">
      <Circle cx="115" cy="115" r="100" fill="transparent" stroke="#ffffff" strokeWidth="6" />
      <Circle
        cx="115"
        cy="115"
        r="100"
        fill="transparent"
        stroke={theme[`level${level}`]}
        strokeWidth="6"
        strokeDasharray={[point1, point2]}
        transform="rotate(-90 115 115)"
      />
      <Line x1="115" y1={y1} x2="115" y2={y2} stroke="white" strokeWidth="2" />
      <Line x1="115" y1={y1} x2="115" y2={y2} stroke="white" strokeWidth="2" transform="rotate(120 115 115)" />
      <Line x1="115" y1={y1} x2="115" y2={y2} stroke="white" strokeWidth="2" transform="rotate(240 115 115)" />
      <Container center mt={9} border="transparent">
        <LevelTitle level={level} color={theme.black} />
      </Container>
      <Container center mt={1}>
        <Type semiBold size={12} lineHeight={15} letterSpacing={0.44}>
          {priceRanges[level - 1]}
        </Type>
      </Container>
    </Svg>
  )
}

export default AccountRewardsPieChart
