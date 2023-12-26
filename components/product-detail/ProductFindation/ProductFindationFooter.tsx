import React from 'react'
import Container from '../../ui/Container'
import Type from '../../ui/Type'
import { px } from '../../../utils/dimensions'
import AdoreSvgIcon from '../../ui/AdoreSvgIcon'
import theme from '../../../constants/theme'
import openInAppBrowser from '../../../utils/openInAppBrowser'

const styles = {
  fontStyle: {
    lineHeight: 16,
    color: theme.textMediumGrey
  }
}

const ProductFindationFooter = () => {
  const handleFindationLogoPress = () => {
    openInAppBrowser('https://www.findation.com')
  }

  return (
    <Container rows align="flex-end" onPress={handleFindationLogoPress}>
      <Type style={styles.fontStyle}>Powered by</Type>
      <Container ml={0.5}>
        <AdoreSvgIcon name="findation" width={px(84)} />
      </Container>
    </Container>
  )
}

export default ProductFindationFooter
