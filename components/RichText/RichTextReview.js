import React from 'react'
import Container from '../ui/Container'
import ReviewInfo from '../product-review/ReviewInfo'
import Type from '../ui/Type'

import theme from '../../constants/theme'

const styles = {
  title: {
    lineHeight: 22
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
  }
}

const RichTextReview = ({ content }) => (
  <Container ph={2} mb={2} mt={2}>
    <Container pb={5.5} style={styles.container}>
      <Container>
        <Type size={16} style={styles.title}>
          {content.title}
        </Type>
      </Container>
      <Container mt={1.5}>
        <ReviewInfo reviewAverage={content.rating} author={content.author.name} authorImage={content.author.image} />
      </Container>
      <Container mt={2.5} style={styles.contentContainer}>
        <Type size={14} color={theme.lightBlack} style={styles.content}>
          {content.content}
        </Type>
      </Container>
    </Container>
  </Container>
)

export default RichTextReview
