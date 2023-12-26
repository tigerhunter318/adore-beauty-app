import React from 'react'
import { useNavigation } from '@react-navigation/core'
import { StyleSheet } from 'react-native'
import RichTextProductManagedCopyProduct from './RichTextProductManagedCopyProduct'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import theme from '../../constants/theme'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  textContainer: {
    marginTop: 15,
    flexDirection: 'row'
  },
  paragraphNumber: {
    lineHeight: 40,
    fontSize: 40,
    color: theme.lightBlack,
    paddingRight: 10
  },
  titleContainer: {
    paddingBottom: 10,
    marginBottom: 10
  },
  title: {
    lineHeight: 19,
    fontSize: 18,
    color: theme.lightBlack
  },
  separator: {
    width: '10%',
    position: 'absolute',
    bottom: 0,
    borderWidth: 1,
    borderColor: theme.titleBorderColor,
    minWidth: 20
  },
  productCopy: {
    lineHeight: 21,
    fontSize: 14,
    color: theme.lightBlack,
    paddingTop: 10
  }
})

const RichTextProductManagedCopy = ({ content = {} }) => {
  const navigation = useNavigation()
  const { productId, productImage, orderNumber, title, productCopy } = content

  const handleQuickView = () => {
    if (!productId) return undefined

    navigation.push('ProductQuickView', {
      product_id: productId
    })
  }

  return (
    <Container style={styles.container}>
      <Container style={styles.imageContainer} onPress={handleQuickView}>
        <ResponsiveImage src={productImage} displayHeight={330} displayWidth={330} />
      </Container>
      <Container style={styles.textContainer}>
        {orderNumber && <Type style={styles.paragraphNumber}>{orderNumber}</Type>}
        <Container pr={orderNumber ? 4 : 0}>
          <Container style={styles.titleContainer}>
            <Type style={styles.title}>{title}</Type>
            <Container style={styles.separator} />
          </Container>
          {content && <RichTextProductManagedCopyProduct onPress={handleQuickView} data={content} />}
          {productCopy && (
            <Type style={styles.productCopy} weight="light">
              {productCopy}
            </Type>
          )}
        </Container>
      </Container>
    </Container>
  )
}

export default RichTextProductManagedCopy
