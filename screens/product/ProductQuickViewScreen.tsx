import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { isValidArray } from '../../utils/validation'
import Container from '../../components/ui/Container'
import theme from '../../constants/theme'
import ScreenViewModal from '../../components/ui/ScreenViewModal'
import ProductQuickViewContent from '../../components/product-detail/ProductQuickViewContent'
import ProductQuickViewFooter from '../../components/product-detail/ProductQuickViewFooter'
import AfterPayModal from '../../components/product-detail/AfterPayModal'
import useProductDetailScreenEffect from '../../components/product-detail/hooks/useProductDetailScreenEffect'

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: 'transparent',
    marginVertical: 0
  },
  scrollViewContainer: {
    backgroundColor: theme.white
  },
  modalContainer: {
    marginLeft: 20,
    marginRight: 20
  }
})

const ProductQuickViewScreen = ({ route }: any) => {
  const [isAfterPayOpen, setIsAfterPayOpen] = useState<boolean>(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const navigation = useNavigation()

  const handleOnClose = () => navigation.goBack()

  const toggleAfterPayModal = () => setIsAfterPayOpen(!isAfterPayOpen)

  const {
    ViewComponent,
    productData,
    productImages,
    refreshing,
    handleRefresh,
    selectedOption
  } = useProductDetailScreenEffect('ProductQuickView')

  return (
    <ScreenViewModal
      onClose={handleOnClose}
      containerStyle={styles.modalContainer}
      footerComponent={
        productData ? (
          <ProductQuickViewFooter
            onClose={handleOnClose}
            productData={productData}
            selectedOption={selectedOption}
            scrollViewRef={scrollViewRef}
            routeParams={route.params}
          />
        ) : null
      }
      edges={['right', 'bottom', 'left', 'top']}
    >
      <Container ph={1} mb={isValidArray(productData?.attributeOptions) && 4}>
        <Container>
          <ScrollView
            ref={scrollViewRef}
            scrollToOverflowEnabled
            style={styles.scrollViewContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          >
            {ViewComponent !== undefined ? (
              ViewComponent
            ) : (
              <ProductQuickViewContent
                productImages={productImages}
                navigation={navigation}
                productId={Number(route.params.product_id)}
                routeParams={route.params}
                productData={productData}
                selectedOption={selectedOption}
                toggleAfterPayModal={toggleAfterPayModal}
              />
            )}
          </ScrollView>
        </Container>
        <AfterPayModal isVisible={isAfterPayOpen} onClose={toggleAfterPayModal} />
      </Container>
    </ScreenViewModal>
  )
}

export default ProductQuickViewScreen
