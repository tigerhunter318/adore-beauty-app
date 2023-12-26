import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Stars from '../ui/Stars'
import theme from '../../constants/theme'

type ReviewSummaryProps = {
  reviewAverage: number
  reviewTotal?: number
  hasText?: boolean
  color?: any
  textSize?: number
  iconSize?: number
  isRateBold?: boolean
  optimized?: boolean
  onPress?: () => void
  containerStyle?: {} | any
}

const ReviewSummary = ({
  reviewAverage = 0,
  reviewTotal = 0,
  hasText = true,
  color = theme.stars,
  textSize = 12,
  iconSize = 15,
  isRateBold = false,
  optimized = false,
  onPress,
  containerStyle = {}
}: ReviewSummaryProps) => {
  const averageRating = reviewAverage
  const hasReviewData = averageRating > 0

  return (
    <Container onPress={hasReviewData && onPress} style={containerStyle}>
      <Container rows align>
        <Stars stars={averageRating} styles={{ marginRight: 10 }} color={color} size={iconSize} />
        {!optimized && hasText && (
          <Container>
            {reviewTotal > 0 ? (
              <Type size={textSize} letterSpacing={0.5}>
                {isRateBold ? <Type semiBold>{averageRating}</Type> : averageRating} of {reviewTotal} reviews
              </Type>
            ) : (
              <Type size={textSize} color={theme.lightBlack}>
                no reviews yet
              </Type>
            )}
          </Container>
        )}
        {optimized && hasText && reviewTotal > 0 && (
          <Type size={textSize} semiBold letterSpacing={0.5}>
            {reviewTotal}
          </Type>
        )}
      </Container>
    </Container>
  )
}

export default ReviewSummary
