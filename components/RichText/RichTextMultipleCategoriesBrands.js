import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import RichTextCategory from './RichTextCategory'

import theme from '../../constants/theme'

const styles = {
  title: {
    lineHeight: 30,
    color: theme.lightBlack
  },
  name: {
    lineHeight: 25,
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

const RichTextMultipleCategoriesBrands = ({ content }) => (
  <Container>
    {content.title && (
      <Container mb={2}>
        <Type size={24} style={styles.title} center color={theme.lightBlack}>
          {content.title}
        </Type>
      </Container>
    )}
    {content.categories &&
      content.categories.map((category, index) => (
        <Container key={`RichTextMultipleCategoriesBrands-${index}`} mb={6}>
          <Container mb={2.25}>
            <Type size={20} style={styles.name} light center>
              {category.name}
            </Type>
          </Container>
          <RichTextCategory content={category} hasTitle={false} />
        </Container>
      ))}
  </Container>
)

export default RichTextMultipleCategoriesBrands
