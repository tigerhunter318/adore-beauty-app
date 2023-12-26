import React, { memo, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import useProductsListQuery from '../../gql/hasura/products/hooks/useProductsListQuery'
import ProductsListCarousel, { ProductsListCarouselProps } from '../product/ProductsListCarousel'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import { vw } from '../../utils/dimensions'
import CustomButton from '../ui/CustomButton'

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.white,
    borderColor: theme.black,
    borderWidth: 1,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    width: vw(90)
  }
})

type ShopNewProductsProps = ProductsListCarouselProps & {
  skip: boolean
  isScreenRefreshing: boolean
}

const ShopNewProducts = ({ skip = true, isScreenRefreshing = false, ...props }: ShopNewProductsProps) => {
  const urlNavigation = useUrlNavigation()
  const { products, loading, refetch, complete } = useProductsListQuery({
    sortBy: 'new',
    limit: 20,
    skip
  })

  const handleRefresh = () => {
    if (isScreenRefreshing) {
      refetch()
    }
  }

  useEffect(handleRefresh, [isScreenRefreshing])

  const FooterComponent = () => {
    const handleButtonPress = () => urlNavigation.navigate(`c/new-arrivals.html`)

    return (
      <Container justify center mb={4}>
        <CustomButton
          semiBold
          color={theme.black}
          style={styles.button}
          onPress={handleButtonPress}
          testID="ShopAllPromotions"
        >
          Shop All New
        </CustomButton>
      </Container>
    )
  }

  return (
    <ProductsListCarousel
      text="new "
      highlightedText="products"
      data={products}
      loading={loading}
      complete={complete}
      FooterComponent={FooterComponent}
      {...props}
    />
  )
}

export default memo(ShopNewProducts)
