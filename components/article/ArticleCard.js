import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Type from '../ui/Type'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'
import { truncate } from '../../utils/format'
import ImageSize from '../../constants/ImageSize'

const styleSheet = {
  container: {},
  imageFrame: {
    borderColor: theme.borderColor,
    overflow: 'hidden',
    backgroundColor: 'white',
    resizeMode: 'cover',
    aspectRatio: 380 / 200
  },
  image: {
    resizeMode: 'cover',
    aspectRatio: 380 / 200
  },
  autoHeightImage: {
    resizeMode: 'cover',
    width: '100%',
    top: '-25%'
  }
}

const ArticleCard = ({
  title,
  name,
  footer,
  // category_name,
  content,
  image,
  containerStyle = {},
  imageProps = {},
  containerProps = {},
  imageWidth = ImageSize.article.card.width,
  imageHeight = ImageSize.article.card.height,
  onItemPress,
  sysId
}) => {
  const navigation = useNavigation()
  const handleItemPress = () => {
    if (onItemPress) {
      onItemPress({ sysId })
    } else {
      navigation.push('PostScreen', { sysId })
    }
  }

  return (
    <Container style={{ ...styleSheet.container, ...containerStyle }} {...containerProps}>
      <TouchableOpacity onPress={() => handleItemPress()}>
        <Container style={styleSheet.imageFrame}>
          <ResponsiveImage
            src={image}
            width={imageWidth}
            height={imageHeight}
            styles={{ image: imageHeight === 'auto' ? styleSheet.autoHeightImage : styleSheet.image }}
            imageProps={imageProps}
          />
        </Container>
        <Container pv={1.5}>
          <Type bold size={16} mb={1} lineHeight={22}>
            {truncate(title || name)}
          </Type>
          {!!content && (
            <Type size={14} color={theme.lightBlack} letterSpacing={0.1} lineHeight={24}>
              {truncate(content)}
            </Type>
          )}
          {footer}
        </Container>
      </TouchableOpacity>
    </Container>
  )
}

export default ArticleCard
