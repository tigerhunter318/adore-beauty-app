import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { vh, vw } from '../../utils/dimensions'
import { formatDate } from '../../utils/date'
import Type from '../ui/Type'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import ImageSize from '../../constants/ImageSize'
import Avatar from '../ui/Avatar'

const styleSheet = {
  container: {
    flex: 1,
    borderColor: theme.borderColor,
    borderWidth: 1,
    borderRadius: 0
  },
  image: {
    container: {
      backgroundColor: '#ccc'
    },
    image: {
      width: vw(100 * (164 / 375)),
      height: 126
    }
  },
  title: {
    lineHeight: 20,
    height: 70
  }
}

const ArticleCardSmall = ({
  title,
  image,
  author,
  authorImage,
  publishDate,
  containerStyle = {},
  imageProps = {},
  containerProps = {},
  sysId
}) => {
  const navigation = useNavigation()
  const { width, height } = ImageSize.article.thumbnail

  const handleItemPress = () => {
    navigation.push('PostScreen', { sysId })
  }

  return (
    <Container style={{ ...styleSheet.container, ...containerStyle }} {...containerProps}>
      <TouchableOpacity onPress={handleItemPress}>
        <Container>
          <ResponsiveImage
            imageProps={imageProps}
            src={image}
            width={width}
            height={height}
            styles={{ image: { aspectRatio: 40 / 34 } }}
          />
        </Container>
        <Container ph={1} pv={1}>
          <Type semiBold mb={1} style={styleSheet.title} numberOfLines={3}>
            {title}
          </Type>
          <Container style={{ width: '80%' }}>
            <Avatar name={author} url={authorImage} publishDate={formatDate(publishDate)} />
          </Container>
        </Container>
      </TouchableOpacity>
    </Container>
  )
}

export default ArticleCardSmall
