import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import gql from 'graphql-tag'
import { useScreenHeader } from '../../navigation/utils'
import Container from '../../components/ui/Container'
import Header from '../../components/ui/Header'
import ProductIngredients from '../../components/product-detail/ProductIngredients'
import ReviewListView from '../../components/product-review/ReviewListView'
import RichTextContent from '../../components/RichText/RichTextContent'
import ProductPriceBar from '../../components/product-detail/ProductPriceBar'
import SafeScreenView from '../../components/ui/SafeScreenView'
import useProductDetailScreenEffect from '../../components/product-detail/hooks/useProductDetailScreenEffect'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import useGoBackParams from '../../navigation/utils/useGoBackParams'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  contentContainer: {
    paddingVertical: 20
  }
})

const ProductDescriptionQuery = gql`
  query app_ProductDescriptionQuery($product_url: String) {
    products(where: { metadata: { url_path: { _eq: $product_url } } }) {
      description
    }
  }
`

const ProductTab = ({ route }: any) => {
  const { id, name, product_url, productSku } = route.params
  const { productData, selectedOption } = useProductDetailScreenEffect()

  useGoBackParams({ ...route.params, productSku })

  useScreenHeader(() => <Header title={name} hasBack />, [route?.params])

  const isDescriptionRequired = product_url && id === 'productinfo'
  const { data: productDescriptionData } = useHasuraQuery(ProductDescriptionQuery, {
    variables: { product_url },
    skip: !isDescriptionRequired
  })

  if (!productData) return null

  const renderContent = () => {
    switch (id) {
      case 'reviews':
        return <ReviewListView productUrl={product_url} />
      case 'ingredients':
        return <ProductIngredients ingredients={productData.ingredients} />
      case 'productinfo':
        return (
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Container gutter>
              {/*
                // @ts-ignore */}
              <RichTextContent content={productDescriptionData?.products?.[0]?.description} />
            </Container>
          </ScrollView>
        )
      default:
        return null
    }
  }

  return (
    <SafeScreenView flex={1}>
      <Container style={styles.container} pb={5}>
        {renderContent()}
        {productData && <ProductPriceBar productData={productData} variant={selectedOption} />}
      </Container>
    </SafeScreenView>
  )
}

export default ProductTab
