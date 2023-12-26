import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ReviewSummary from './ReviewSummary'
import theme from '../../constants/theme'
import { fromNow } from '../../utils/date'
import { sanitizeContent } from '../../utils/format'
import Avatar from '../ui/Avatar'

const styles = StyleSheet.create({
  title: {
    lineHeight: 20,
    letterSpacing: 1
  },
  borderContainer: {
    overflow: 'hidden',
    marginTop: 15,
    paddingHorizontal: 20
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  verifiedPurchaser: {
    fontSize: 10,
    letterSpacing: 1,
    color: theme.orange
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  nickname: {
    fontSize: 12,
    letterSpacing: 1,
    paddingLeft: 10,
    color: theme.lighterBlack
  },
  createdAt: {
    fontSize: 9,
    letterSpacing: 1,
    marginLeft: 10,
    color: theme.textGreyDark,
    textTransform: 'uppercase'
  },
  descriptionContainer: {
    overflow: 'hidden',
    marginTop: 14
  },
  descriptionBorderStyle: {
    marginTop: -1,
    marginBottom: -1,
    marginRight: -1,
    borderWidth: 0.5,
    borderColor: theme.darkGray,
    borderStyle: 'dashed',
    borderRadius: 0.5,
    paddingLeft: 20,
    paddingBottom: 10
  },
  description: {
    fontSize: 13,
    letterSpacing: 1,
    marginLeft: 10,
    lineHeight: 24,
    color: theme.lightBlack
  },
  helpfulContainer: {
    flexDirection: 'row',
    marginTop: 14
  },
  helpfulSection: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  helpful: {
    marginLeft: 10,
    fontSize: 11,
    textTransform: 'uppercase',
    color: theme.lighterBlack
  }
})

const ReviewListItem = ({ item }: any) => {
  const {
    title,
    rating_value: rating,
    nickname,
    verified_purchaser: isVerifiedPurchaser,
    created_at: createdAt,
    detail: description
  } = item

  return (
    <Container style={styles.borderContainer}>
      <Type bold style={styles.title}>
        {title}
      </Type>
      <Container style={styles.reviewSummary}>
        <ReviewSummary hasText={false} reviewAverage={rating || 0} color={theme.orangeColor} />
        <Type semiBold style={styles.verifiedPurchaser}>
          {!!isVerifiedPurchaser && 'Verified Purchaser'}
        </Type>
      </Container>
      <Container style={styles.reviewContainer}>
        <Avatar hasText={false} size={20} />
        <Type semiBold style={styles.nickname}>
          {nickname}
        </Type>
        <Type style={styles.createdAt}>{fromNow(createdAt)}</Type>
      </Container>
      <Container style={styles.descriptionContainer}>
        <Container style={styles.descriptionBorderStyle}>
          <Type style={styles.description}>{sanitizeContent(description)}</Type>
        </Container>
      </Container>
    </Container>
  )
}

export default memo(ReviewListItem)
