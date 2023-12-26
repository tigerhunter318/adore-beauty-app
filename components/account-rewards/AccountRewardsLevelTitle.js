import React from 'react'
import Level1Svg from '../../assets/icons/level1.svg'
import Level2Svg from '../../assets/icons/level2.svg'
import Level3Svg from '../../assets/icons/level3.svg'

const AccountRewardsLevelTitle = ({ level, color }) => {
  const renderContent = () => {
    switch (level) {
      case 1:
        return <Level1Svg fill={color} />
      case 2:
        return <Level2Svg fill={color} />
      case 3:
        return <Level3Svg fill={color} />
      default:
    }
  }
  return renderContent()
}

export default AccountRewardsLevelTitle
