import React from 'react'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import ContentLoading from '../ui/ContentLoading'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const CategoryProductsHeader = ({
  logoUrl,
  bannerUrl,
  filterCount,
  url
}: {
  logoUrl: string | any
  bannerUrl: string | any
  filterCount: number
  url: string
}) => {
  const urlNavigation = useUrlNavigation()

  const handleBrandLogoPress = () => {
    if (!url || !filterCount) return

    urlNavigation.navigate(url)
  }

  return (
    <Container testID="ShopCategoryProductsScreen.BrandHeader" justify="space-between" background="white">
      {logoUrl && (
        <Container pv={1} onPress={handleBrandLogoPress}>
          <ResponsiveImage
            src={logoUrl}
            width={184}
            height="29"
            styles={{ image: { resizeMode: 'contain' } }}
            useAspectRatio
          />
        </Container>
      )}
      {bannerUrl && (
        <ResponsiveImage
          src={bannerUrl}
          width={374}
          height="90"
          styles={{ image: { resizeMode: 'contain' } }}
          useAspectRatio
        />
      )}
    </Container>
  )
}
export default CategoryProductsHeader
