import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { share } from '../../utils/share'
import { formatPagePath } from '../../utils/format'
import { useIsLoggedIn } from '../../store/utils/stateHook'
import { useHasFocusedScreen, useScreenFocusEffect } from '../../hooks/useScreen'
import { useScreenBack } from '../../navigation/utils'
import { ViewportProvider } from '../../components/viewport/ViewportContext'
import { isSmallDevice } from '../../utils/device'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { createDynamicLink } from '../../services/branch/createDynamicLink'
import { isValidArray } from '../../utils/validation'
import { useEmpiProductId } from '../../components/product-detail/hooks/useEmpiProductId'
import ProductMain from '../../components/product-detail/ProductMain'
import ProductTLDR from '../../components/product-detail/ProductTLDR'
import ProductTabs from '../../components/product-detail/ProductTabs'
import Container from '../../components/ui/Container'
import ProductPriceBar from '../../components/product-detail/ProductPriceBar'
import ProductRecent from '../../components/product-detail/ProductRecent'
import ShareButton from '../../components/ui/ShareButton'
import CustomButton from '../../components/ui/CustomButton'
import SafeScreenView from '../../components/ui/SafeScreenView'
import useScrollDirection from '../../hooks/useScrollDirection'
import settings from '../../constants/settings'
import ProductRecommendedTabs from '../../components/product-detail/ProductRecommendedTabs'
import ViewportAware from '../../components/viewport/ViewportAware'
import theme from '../../constants/theme'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import useProductDetailScreenEffect from '../../components/product-detail/hooks/useProductDetailScreenEffect'
import ProductRelatedArticles from '../../components/product-detail/ProductRelatedArticles'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    paddingBottom: 52,
    flex: 1
  },
  shareButton: {
    position: 'absolute',
    top: isSmallDevice() ? 102 : 75,
    zIndex: 10,
    right: 20.5
  },
  hr: {
    backgroundColor: theme.splitorColor,
    height: 1,
    marginBottom: 30,
    marginTop: 0
  }
})

const ProductScreen = ({ navigation, route }: any) => {
  const urlNavigation = useUrlNavigation()
  const { productSku } = route?.params || {}
  const scrollViewRef = useRef<ScrollView>(null)
  const [navigateTo, setNavigateTo] = useState<string | any>('')
  const [shareButtonStyle, setShareButtonStyle] = useState({ top: 0 })
  const isLoggedIn = useIsLoggedIn()
  const { handleScroll, direction } = useScrollDirection()
  const isShareButtonVisible = direction !== 'down'
  const isFocused = useHasFocusedScreen()

  const {
    loading,
    ViewComponent,
    productData,
    isLuxuryProduct,
    productImages,
    nameParam,
    isTGARestricted,
    refreshing,
    handleRefresh,
    selectedOption,
    brandIdentifier
  } = useProductDetailScreenEffect()

  const handleBrandLogoPress = () => {
    if (!brandIdentifier) return

    urlNavigation.navigate(`/b/${brandIdentifier}.html`)
  }

  const scrollToDropdown = () => {
    if (scrollViewRef?.current?.scrollTo) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: 300,
        animated: true
      })
    }
  }

  const handleShareClick = async (shareData: { product_url: string; product_id: any }) => {
    if (shareData?.product_url) {
      const url = formatPagePath(shareData.product_url)
      const productDynamicLink = await createDynamicLink(url, {
        productData: shareData,
        pageType: 'product',
        id: shareData.product_id
      })
      share('product', shareData.product_id, productDynamicLink)
    }
  }

  const handleAddReview = () => {
    if (isLoggedIn) {
      navigation.push('ProductSubmitReview', { data: productData })
    } else {
      setNavigateTo('ProductSubmitReview')
      navigation.navigate('Login', { goBack: true })
    }
  }

  const checkHasLogged = () => {
    setNavigateTo('')
    if (isLoggedIn && navigateTo) {
      navigation.push(navigateTo, { data: productData })
    }
  }

  const handleScreenFocus = () => {
    checkHasLogged()
  }

  const handleEmarsysLogging = () => {
    if (!loading && productData) {
      emarsysEvents.trackProductView(productData, selectedOption?.option_id)
    }
  }

  useScreenFocusEffect(handleEmarsysLogging, [productData, loading, selectedOption])
  useScreenFocusEffect(handleScreenFocus, [isLoggedIn, navigateTo, loading])
  useEmpiProductId()
  useScreenBack([navigation])

  const handleReviewContainerLayout = (event: { nativeEvent: { layout: { y: string | number } } }) =>
    setShareButtonStyle({ top: Number(event.nativeEvent.layout.y || 0 + (isLuxuryProduct ? 60 : -10)) })

  const handleTabItemPress = item => {
    navigation.push('ProductTab', {
      id: item.id,
      name: item.name,
      product_url: productData.product_url,
      productSku
    })
  }
  const handleReviewsPress = () => {
    handleTabItemPress({ id: 'reviews', name: 'Reviews' })
  }

  if (ViewComponent !== undefined) {
    return ViewComponent
  }

  return (
    <SafeScreenView flex={1} testID="ProductScreen">
      <ViewportProvider lazyLoadImage>
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={settings.defaultScrollEventThrottle}
          scrollToOverflowEnabled
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <View style={styles.screen}>
            <Container pb={isValidArray(productData.attributeOptions) ? 8 : 2}>
              <Container gutter>
                {!!isLuxuryProduct && (
                  <Container pt={1}>
                    <Container onPress={handleBrandLogoPress}>
                      <ResponsiveImage
                        src={productData.brand_logo_url}
                        width={184}
                        height="29"
                        styles={{ image: { resizeMode: 'contain' } }}
                        useAspectRatio
                      />
                    </Container>
                  </Container>
                )}
                <ProductMain
                  data={productData}
                  productImages={productImages}
                  productVariant={selectedOption?.option_id}
                  productName={nameParam || ''}
                  onReviewContainerLayout={handleReviewContainerLayout}
                  onReviewPress={handleReviewsPress}
                />
                <ProductTLDR data={productData} onReviewPress={handleReviewsPress} />
              </Container>
              <ViewportAware>
                {({ hasEnteredViewport }) => (
                  <ProductTabs
                    productData={productData}
                    onItemPress={handleTabItemPress}
                    hasEnteredViewport={hasEnteredViewport}
                  />
                )}
              </ViewportAware>
              <Container p={2}>
                <CustomButton
                  semiBold
                  pv={1.5}
                  onPress={handleAddReview}
                  icon="write"
                  textStyle={{ letterSpacing: 1 }}
                  iconSize={18}
                >
                  {isTGARestricted ? 'Review' : 'Review & Earn'}
                </CustomButton>
              </Container>
              <ViewportAware preTriggerRatio={0.25}>
                {({ hasEnteredViewport }) => (
                  <ProductRecommendedTabs
                    skip={!hasEnteredViewport || !isFocused}
                    itemViewId={productData?.magento_product_id}
                    brandName={isLuxuryProduct ? productData.brand_name : undefined}
                    refreshing={refreshing}
                  />
                )}
              </ViewportAware>
              <ViewportAware preTriggerRatio={0.25}>
                {({ hasEnteredViewport }) => (
                  <ProductRecent
                    skip={!hasEnteredViewport || !isFocused || isLuxuryProduct}
                    isScreenRefreshing={refreshing}
                    exclude={productData.productSku}
                    isLuxuryProduct={isLuxuryProduct}
                  />
                )}
              </ViewportAware>
              <ViewportAware preTriggerRatio={0.25}>
                {({ hasEnteredViewport }) => (
                  <ProductRelatedArticles
                    categoryId={productData?.magento_category_id || productData?.comestri_category_id}
                    brandId={productData?.brand_magento_category_id || productData?.brand_comestri_category_id}
                    isLuxuryProduct={isLuxuryProduct}
                    skip={!hasEnteredViewport}
                  />
                )}
              </ViewportAware>
            </Container>
          </View>
        </ScrollView>
      </ViewportProvider>
      <View>
        <ProductPriceBar productData={productData} variant={selectedOption} scrollToDropdown={scrollToDropdown} />
      </View>
      <ShareButton
        isVisible={shareButtonStyle.top && isShareButtonVisible}
        style={[styles.shareButton, shareButtonStyle]}
        onPress={() => handleShareClick(productData)}
      />
    </SafeScreenView>
  )
}

export default ProductScreen
