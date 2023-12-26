import React from 'react'
import theme from '../../constants/theme'
import Type from '../ui/Type'
import Container from '../ui/Container'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import { px } from '../../utils/dimensions'

const styles = {
  containerWidth: {
    width: px(128)
  }
}
const SocietyFeatureCard = ({ text, icon }) => (
  <Container center flex={1} mt={2.4}>
    <Container center>
      <AdoreSvgIcon {...icon} />
    </Container>
    <Container mt={1} style={styles.containerWidth}>
      <Type uppercase center weight="medium" size={12} lineHeight={16} letterSpacing={0.9} color={theme.lighterBlack}>
        {text}
      </Type>
    </Container>
  </Container>
)

export default SocietyFeatureCard
