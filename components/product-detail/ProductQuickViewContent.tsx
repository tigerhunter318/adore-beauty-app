import React from 'react'
import { StyleSheet } from 'react-native'
import ImageGallery from './ImageGallery'
import ReviewSummary from '../product-review/ReviewSummary'
import AfterPayInfo from './AfterPayInfo'
import StockMessage from './StockMessage'
import RichTextContentWithoutQuickView from '../RichText/RichTextContentWithoutQuickView'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import FavouriteButton from '../wishlist/FavouriteButton'
import CatalogProductProvider from '../product/CatalogProductProvider'
import ProductSize from './ProductSize'
import screenRouter from '../../navigation/router/screenRouter'

const styles = StyleSheet.create({
  container: {
    paddingBottom: 70
  },
  title: {
    color: theme.lightBlack,
    paddingLeft: 15,
    paddingRight: 40,
    fontSize: 22,
    marginTop: 23,
    lineHeight: 30
  },
  reviewsContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productSize: {
    marginTop: 8,
    paddingLeft: 15
  },
  stockMessage: {
    paddingBottom: 20,
    paddingHorizontal: 15
  },
  stockist: {
    borderWidth: 1,
    borderColor: theme.borderColor,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 9,
    color: theme.lightBlack,
    textTransform: 'uppercase',
    letterSpacing: 2.88,
    lineHeight: 18
  },
  description: {
    paddingTop: 10,
    paddingHorizontal: 15
  },
  afterPay: {
    paddingTop: 20,
    paddingHorizontal: 15
  }
})

type ProductQuickViewContentProps = {
  navigation: any
  productData: {} | any
  productId: number
  routeParams: {} | any
  toggleAfterPayModal: () => void
  selectedOption: {} | any
  productImages: []
}

const ProductQuickViewContent = ({
  navigation,
  productData,
  toggleAfterPayModal,
  selectedOption,
  productImages
}: ProductQuickViewContentProps) => {
  const { name, short_description: description, afterpayInstallments, size } = productData
  const { navigateScreen } = screenRouter({ navigation })
  const handleReviewsPress = () => {
    navigateScreen('ProductStack/ProductTab', {
      id: 'reviews',
      name: 'Reviews',
      product_url: productData.product_url
    })
  }

  return (
    <Container style={styles.container}>
      <Type bold style={styles.title}>
        {name || ''}
      </Type>
      <Container style={styles.reviewsContainer}>
        <ReviewSummary onPress={handleReviewsPress} {...productData} />
        <CatalogProductProvider product={productData} selectedOption={selectedOption}>
          {({ catalogProductId, loading }: any) => (
            <FavouriteButton
              catalogProductId={catalogProductId}
              productData={productData}
              navigation={navigation}
              loadingCatalogData={loading}
            />
          )}
        </CatalogProductProvider>
      </Container>
      <ProductSize size={size} style={styles.productSize} />
      {productImages && (
        <Container pt={3} pb={productImages?.length > 1 ? 0 : 3}>
          <ImageGallery productImages={productImages} />
        </Container>
      )}
      <Container style={styles.stockMessage}>
        <StockMessage productData={productData} productVariant={selectedOption?.option_id} />
      </Container>
      <Container center>
        <Type bold style={styles.stockist}>
          Official stockist
        </Type>
        {description && (
          <Container style={styles.description}>
            <RichTextContentWithoutQuickView content={description} />
          </Container>
        )}
      </Container>
      <AfterPayInfo
        style={styles.afterPay}
        installments={afterpayInstallments}
        toggleAfterPayModal={toggleAfterPayModal}
      />
    </Container>
  )
}

export default ProductQuickViewContent
