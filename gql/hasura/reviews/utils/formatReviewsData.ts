import { getIn } from '../../../../utils/getIn'

const formatRecommendedPercentageText = (percentage: number, reviewAverage: number) => {
  switch (true) {
    case percentage >= 90 && reviewAverage >= 4:
      return 'SUPERIOR'
    case percentage >= 70 && percentage < 90:
      return 'GREAT'
    case percentage >= 50 && percentage < 70:
      return 'GOOD'
    case percentage >= 30 && percentage < 50:
      return 'OK'
    default:
      return ''
  }
}
export const formatReviewsData = (data: object) => {
  const reviews = getIn(data, 'reviews')
  const recommendationTotal = getIn(data, 'recommendation_total.aggregate.count') || 0
  const reviewTotal = getIn(data, 'review_total.aggregate.count') || 0
  const reviewAverage = getIn(data, 'review_total.aggregate.avg.rating_value')
    ? parseFloat(getIn(data, 'review_total.aggregate.avg.rating_value')).toFixed(1)
    : 0
  const recommendPercentage = Math.round((recommendationTotal / reviewTotal) * 100) || 0

  return {
    reviewAverage,
    reviewTotal,
    recommendPercentage,
    recommendPercentageText: formatRecommendedPercentageText(recommendPercentage, Number(reviewAverage)),
    reviews
  }
}
