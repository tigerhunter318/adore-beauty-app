import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import Stars from '../ui/Stars'

const styleSheet = {
  stars: {
    marginRight: 10
  },
  author: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden'
  }
}

const ReviewInfo = ({ reviewAverage = 0, authorImage = null, author = null }) => (
  <Container rows align>
    <Stars stars={reviewAverage} styles={styleSheet.stars} />
    <Container rows align>
      {authorImage ? (
        <Container style={styleSheet.author} mr={1}>
          <ResponsiveImage width={40} height={40} src={authorImage} useAspectRatio />
        </Container>
      ) : null}
      {author ? <Type size={12}>{author}</Type> : null}
    </Container>
  </Container>
)

export default ReviewInfo
