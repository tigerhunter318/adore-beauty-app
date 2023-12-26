import React from 'react'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import ReviewSummary from './ReviewSummary'
import { fromNow } from '../../utils/date'
import { sanitizeContent } from '../../utils/format'

const styles = {
  title: {
    position: 'absolute',
    width: '100%',
    top: -16
  },
  titleContent: {
    paddingHorizontal: 13,
    paddingVertical: 1
  }
}

const MostHelpfulReview = ({ title, data }: { title: string; data: {} | any }) => (
  <Container background={theme.lighterPink} style={{ position: 'relative' }}>
    <Container style={styles.title} pv={0.2} ph={1.3} center>
      <Type
        bold
        color={theme.black}
        lineHeight={25}
        letterSpacing={0.5}
        backgroundColor={theme.white}
        style={styles.titleContent}
      >
        {title}
      </Type>
    </Container>
    <Container ph={2.6} pt={3.3} pb={2}>
      <Type bold lineHeight={20}>
        {data.title}
      </Type>
      <Container mt={1.3}>
        <ReviewSummary
          reviewAverage={data.rating_value}
          reviewTotal={5}
          color={theme.orangeColor}
          textSize={15}
          iconSize={17}
          isRateBold
          hasText={false}
        />
      </Container>
      <Container rows align mt={0.7}>
        <Type size={11} lineHeight={18} letterSpacing={1}>
          {data.nickname}
        </Type>
        {data.verified_purchaser ? (
          <Type size={11} lineHeight={18} letterSpacing={1} style={{ marginLeft: 10 }}>
            verified purchaser
          </Type>
        ) : null}
        <Type size={11} color={theme.lightBlack} style={{ marginLeft: 10 }} letterSpacing={1}>
          {fromNow(data.created_at)}
        </Type>
      </Container>
      <Container mt={0.7}>
        <Type size={13} color={theme.black} letterSpacing={0.09} lineHeight={24}>
          {sanitizeContent(data.detail)}
        </Type>
      </Container>
    </Container>
  </Container>
)

export default MostHelpfulReview
