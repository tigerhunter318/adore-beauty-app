import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'

const BeautyIQTitle = ({ width = 30, height = 30, fontSize = 17 }) => (
  <Container center align="flex-end" rows mb={0.7}>
    <Type heading color={theme.white} size={fontSize} letterSpacing={10} pb={0.42} bold>
      BEAUTY
    </Type>
    <Container mt={0.6}>
      <AdoreSvgIcon name="iq" color={theme.white} width={width} height={height} />
    </Container>
  </Container>
)

export default BeautyIQTitle
