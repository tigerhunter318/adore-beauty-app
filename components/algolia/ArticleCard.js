import React from 'react'
import { StyleSheet } from 'react-native'
import { useActionState } from '../../store/utils/stateHook'
import { withNavigation } from '../../navigation/utils'
import { algoliaInsights } from '../../services/algolia'
import { isValidObject } from '../../utils/validation'
import ResponsiveImage from '../ui/ResponsiveImage'
import ProductTitle from '../product/ProductTitle'
import Container from '../ui/Container'
import { isTablet } from '../../utils/device'

const styleSheet = StyleSheet.create({
  articleContainer: {
    width: isTablet() ? '33%' : '50%',
    padding: 0.5
  },
  innerArticleContainer: {
    height: 255,
    padding: 15,
    backgroundColor: 'white'
  },
  titleContainer: {
    paddingTop: 10
  }
})

const ArticleCardContent = ({ onArticlePress, name, image, imageHeight, imageWidth, styles }) => (
  <Container onPress={onArticlePress}>
    <ResponsiveImage
      src={`https:${image}`}
      styles={{
        image: styles.image
      }}
      width={imageWidth}
      height={imageHeight || imageWidth}
      useAspectRatio
    />
    <Container style={styleSheet.titleContainer}>
      <ProductTitle name={name} style={styles.title} />
    </Container>
  </Container>
)

const ArticleCard = ({
  data,
  styles = {},
  navigation,
  imageWidth = 150,
  imageHeight,
  height = isTablet() ? 310 : 280
}) => {
  const account = useActionState('customer.account')
  const { name, feature_image: image } = data || {}

  const handleArticlePress = () => {
    algoliaInsights.clickArticle(account, data)
    navigation.push('PostScreen', { sysId: data.objectID })
  }

  return (
    <Container style={[styleSheet.articleContainer, styles.container]}>
      <Container activeOpacity={0.8} style={[styleSheet.innerArticleContainer, { height }, styles.inner]}>
        {isValidObject(data) && (
          <ArticleCardContent
            onArticlePress={handleArticlePress}
            name={name}
            image={image}
            imageWidth={imageWidth}
            styles={styles}
            imageHeight={imageHeight}
          />
        )}
      </Container>
    </Container>
  )
}

export default withNavigation(ArticleCard)
