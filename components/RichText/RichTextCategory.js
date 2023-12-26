import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ProductCarousel from '../product/ProductCarousel'
import theme from '../../constants/theme'
import { withNavigation } from '../../navigation/utils'

const styles = {
  name: {
    lineHeight: 30,
    color: theme.lightBlack
  },
  container: {
    borderBottomColor: theme.reviewBorderColor,
    borderBottomWidth: 0.5,
    borderRadius: 0.5
  },
  contentContainer: {
    borderLeftColor: theme.reviewBorderColor,
    borderLeftWidth: 0.5,
    borderRadius: 0.5
  },
  content: {
    lineHeight: 24,
    letterSpacing: 0.1,
    paddingLeft: 20
  },
  productContainer: {
    zIndex: 0
  }
}

const RichTextCategory = ({ content, navigation, hasTitle = true }) => (
  <Container center>
    {hasTitle && content?.name && (
      <Container pv={2}>
        <Type size={22} style={styles.name} semiBold center>
          {content.name}
        </Type>
      </Container>
    )}
    <Container style={styles.productContainer}>
      <ProductCarousel products={content.product} navigation={navigation} />
    </Container>
  </Container>
)

export default withNavigation(RichTextCategory)
