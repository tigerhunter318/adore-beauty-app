import React from 'react'
import Container from '../ui/Container'
import { px, vw } from '../../utils/dimensions'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import { getIn } from '../../utils/getIn'

const ConcernListItem = ({ onPress, item }) => {
  const image = getIn(item, 'images.0.image.url_relative')
  const width = vw(100 / 3) - 7
  const imageWidth = px(100)

  return (
    <Container style={{ width }} mb={2}>
      <Container align ph={0.5} onPress={onPress}>
        <Container style={{ width: imageWidth, height: imageWidth, borderRadius: imageWidth }} mb={1.5}>
          {image && (
            <ResponsiveImage
              width={imageWidth}
              height={imageWidth}
              src={image}
              useAspectRatio
              styles={{ container: { imageWidth, height: imageWidth } }}
            />
          )}
        </Container>
        <Type center numberOfLines={2} size={12} letterSpacing={1}>
          {item.name}
        </Type>
      </Container>
    </Container>
  )
}

const ConcernList = ({ data, onItemPress }) => (
  <Container align>
    <Container rows style={{ flexWrap: 'wrap', width: vw(100) - 20 }}>
      {data &&
        data.map((item, i) => (
          <ConcernListItem onPress={() => onItemPress(item)} item={item} key={`concern-item-${item.name}`} />
        ))}
    </Container>
  </Container>
)

export default ConcernList
