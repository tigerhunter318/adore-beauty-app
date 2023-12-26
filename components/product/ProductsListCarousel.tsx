import React from 'react'
import { StyleSheet } from 'react-native'
import { isValidArray } from '../../utils/validation'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import ContentLoading from '../ui/ContentLoading'
import CustomFlatlistCarousel from '../ui/CustomFlatlistCarousel'
import Hr from '../ui/Hr'
import SectionTitle from '../ui/SectionTitle'

const styles = StyleSheet.create({
  hr: {
    backgroundColor: theme.splitorColor,
    height: 1,
    marginBottom: 30,
    marginTop: 0
  }
})

export type ProductsListCarouselProps = {
  data?: any[]
  loading?: boolean
  hasPlaceholder?: boolean
  testID?: string
  text?: string
  highlightedText?: string
  containerStyle?: any
  trackRecommendationClick?: (productData: any) => void
  complete?: boolean
  contentLoaderConfigs?: object
  FooterComponent?: any
}

const ProductsListCarousel = ({
  data,
  loading = false,
  hasPlaceholder = true,
  testID,
  text = '',
  highlightedText = '',
  complete = false,
  containerStyle = { marginTop: 10 },
  trackRecommendationClick,
  FooterComponent = () => null,
  contentLoaderConfigs = {
    type: 'ProductCarousel',
    styles: { container: { marginBottom: 45 } }
  }
}: ProductsListCarouselProps) => {
  const isInitialRender = !complete && hasPlaceholder

  if (loading || isInitialRender) return <ContentLoading {...contentLoaderConfigs} animate={loading} />

  if (!isValidArray(data)) return null

  return (
    <Container testID={testID} style={containerStyle}>
      {!!text && (
        <>
          <Hr style={styles.hr} />
          <SectionTitle text={text} highlightedText={highlightedText} />
        </>
      )}
      <CustomFlatlistCarousel
        data={data || []}
        productProps={{
          hasReview: false,
          hasFavourite: false,
          hasAddToCart: true,
          hasQuickView: true
        }}
        trackRecommendationClick={trackRecommendationClick}
      />
      {FooterComponent()}
    </Container>
  )
}

export default ProductsListCarousel
