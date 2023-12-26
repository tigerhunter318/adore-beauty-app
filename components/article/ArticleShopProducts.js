import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core'
import ProductGrid from '../product/ProductGrid'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Avatar from '../ui/Avatar'
import theme from '../../constants/theme'
import { useSafeInsets, vw } from '../../utils/dimensions'
import { isIos } from '../../utils/device'
import Header from '../ui/Header'

const styles = StyleSheet.create({
  shopArticleContainer: {
    position: 'absolute',
    bottom: 0,
    width: vw(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.black
  },
  shopArticle: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: theme.white
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20
  },
  title: {
    color: theme.white,
    fontSize: 12,
    width: '85%',
    paddingLeft: 10
  }
})

const shadowStyle = {
  shadowOffset: { width: 0, height: 2 },
  shadowColor: theme.borderColorDark,
  shadowOpacity: 1,
  shadowRadius: 10,
  borderTopColor: theme.black,
  borderTopWidth: 1
}

const ArticleShopProductsFooter = ({ authorName, authorUrl, title, style }) => (
  <Container align style={[style, isIos() ? shadowStyle : {}]}>
    <Container style={styles.titleContainer}>
      <Avatar name={authorName} url={authorUrl} hasText={false} />
      <Type numberOfLines={3} style={styles.title}>
        {title}
      </Type>
    </Container>
  </Container>
)

const ArticleShopProducts = ({ data, authorName, authorUrl, title }) => {
  const { bottom } = useSafeInsets()
  const footerHeight = bottom + 56
  const navigation = useNavigation()
  const route = useRoute()

  const handleOnPress = () => navigation.goBack()

  return (
    <Container flex={1}>
      <Header title="SHOP THIS ARTICLE" hasBack navigation={navigation} />
      <Container flexGrow={1}>
        <Container flex={1}>
          <ProductGrid
            products={data}
            navigation={navigation}
            refreshing={false}
            containerStyle={{ paddingBottom: footerHeight }}
            cb={handleOnPress}
            quickViewParams={{ parentScreenPath: route?.params?.parentScreenPath }}
          />
        </Container>
        <ArticleShopProductsFooter
          authorName={authorName}
          authorUrl={authorUrl}
          title={title}
          style={{ ...styles.shopArticleContainer, paddingBottom: bottom, height: footerHeight }}
        />
      </Container>
    </Container>
  )
}

export default ArticleShopProducts
