import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ReviewSummary from './ReviewSummary'
import MostHelpfulReview from './MostHelpfulReview'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    letterSpacing: 1
  },
  borderContainer: {
    marginTop: 10,
    overflow: 'hidden'
  },
  borderStyle: {
    marginTop: -1,
    marginLeft: -1,
    marginRight: -1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: theme.darkGray,
    borderRadius: 0.5,
    paddingBottom: 12,
    flexDirection: 'row'
  },
  recommendPercentage: {
    fontSize: 26,
    lineHeight: 26
  },
  recommendedText: {
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  itemSeparator: {
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: theme.darkGray,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  }
})

type ReviewListViewItemHeaderProps = {
  reviewAverage: string | number
  reviewTotal?: number
  mostRecentPositive?: any
  mostRecentCriticism?: any
  recommendPercentage: number
}

const ReviewListViewItemHeader = ({
  reviewAverage,
  reviewTotal,
  mostRecentPositive,
  mostRecentCriticism,
  recommendPercentage
}: ReviewListViewItemHeaderProps) => (
  <Container pt={2}>
    <Container gutter>
      <Type bold style={styles.title}>
        Customer Reviews
      </Type>
      <ReviewSummary
        reviewAverage={Number(reviewAverage)}
        reviewTotal={reviewTotal}
        color={theme.orangeColor}
        textSize={15}
        iconSize={24}
        isRateBold
        containerStyle={{ paddingVertical: 10 }}
      />
      <Container style={styles.borderContainer}>
        <Container style={styles.borderStyle}>
          <Type bold style={styles.recommendPercentage}>
            {recommendPercentage}
          </Type>
          <Type bold style={styles.recommendedText}>
            % recommend this product
          </Type>
        </Container>
      </Container>
      {mostRecentPositive && (
        <Container mt={3}>
          <MostHelpfulReview title="Most Recent positive" data={mostRecentPositive} />
        </Container>
      )}
      {mostRecentCriticism && (
        <Container mt={3}>
          <MostHelpfulReview title="Most Recent criticism" data={mostRecentCriticism} />
        </Container>
      )}
    </Container>
    {(mostRecentCriticism || mostRecentPositive) && <Container style={styles.itemSeparator} />}
  </Container>
)

export default ReviewListViewItemHeader
