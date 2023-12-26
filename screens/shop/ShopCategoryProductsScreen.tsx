import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useScreenBack, useScreenHeaderTitle } from '../../navigation/utils'
import { ResultTabs } from '../../components/ui/ResultTabs'
import { isBrandUrl, isValidArray, isValidNumber } from '../../utils/validation'
import { pluraliseResults, formatPagePath } from '../../utils/format'
import { gaEvents } from '../../services/ga'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import Container from '../../components/ui/Container'
import CurrentOffers from '../../components/promotions/CurrentOffers'
import useScrollDirection from '../../hooks/useScrollDirection'
import theme from '../../constants/theme'
import CategoryArticles from '../../components/category/CategoryArticles'
import CategorySortAndFilterTabs from '../../components/category/CategorySortAndFilterTabs'
import useCategoryProductsPromotionsQuery from '../../gql/hasura/promotions/hooks/useCategoryProductsPromotionsQuery'
import CategoryProducts from '../../components/category/CategoryProducts'
import useCategoryProductsQuery from '../../gql/hasura/categories/hooks/useCategoryProductsQuery'
import useCategoryArticlesCountQuery from '../../gql/hasura/contentful/hooks/useCategoryArticlesCountQuery'
import ContentLoading from '../../components/ui/ContentLoading'
import useLuxuryBrands from '../../gql/hasura/brands/hooks/useLuxuryBrands'
import useCategoryDetailsQuery from '../../gql/hasura/categories/hooks/useCategoryDetailsQuery'
import useConsentForm from '../../hooks/useConsentForm'

const styles = StyleSheet.create({
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    justifyContent: 'center'
  }
})

type CategoryResultTabsProps = {
  activeTabName: string | any
  productsResultCount: number | any
  articlesResultCount: number | any
  isArticlesLoading: boolean
  onChangeTab: (tab: string) => void
}

const CategoryResultTabs = ({
  activeTabName,
  productsResultCount,
  articlesResultCount,
  isArticlesLoading,
  onChangeTab
}: CategoryResultTabsProps) => {
  const tabs = [
    { name: 'product', count: isValidNumber(productsResultCount) ? productsResultCount : 0 },
    { name: 'article', count: isValidNumber(articlesResultCount) ? articlesResultCount : 0 }
  ]

  const mergedData = tabs
    .map(({ name, count }) => ({
      name: pluraliseResults(count, name),
      active: activeTabName === name,
      disabled: !count,
      loading: name === 'article' && isArticlesLoading,
      onPress: () => onChangeTab(name)
    }))
    .filter(x => x)

  return (
    <Container style={styles.tabsContainer}>
      <ResultTabs tabs={mergedData} />
    </Container>
  )
}

type ShopCategoryProductsProps = {
  name: string
  url: string
  navigation: any
  setIsTabsDisabled: (val: boolean) => void
}

const ShopCategoryProducts = ({ name, url, navigation, setIsTabsDisabled }: ShopCategoryProductsProps) => {
  const [selectedTabName, setSelectedTabName] = useState('product')
  const { handleScroll, direction } = useScrollDirection()
  const {
    isBrandCategory = false,
    categoryName,
    categoryId,
    brandLogo,
    brandBanner,
    isConsentRequired
  } = useCategoryDetailsQuery({
    url,
    skip: !url
  })
  const consentForm = useConsentForm(isConsentRequired)
  const isCategoryDataReady = categoryId && !consentForm && !!url
  const categoryProductsQueryResult = useCategoryProductsQuery({ skip: !isCategoryDataReady })
  const {
    data,
    loading,
    isFetchingMore,
    initialComponent,
    refreshing,
    handleRefresh,
    onEndReached
  } = categoryProductsQueryResult
  const { products, productsResultCount } = data || {}
  const { offers } = useCategoryProductsPromotionsQuery({ url, isBrandCategory, skip: !isCategoryDataReady })
  const isBrandScreen = isBrandUrl(url) || isBrandCategory
  const brandName = products?.[0]?.brand_name
  const { findLuxuryBrand } = useLuxuryBrands()

  const articlesQueryConditions = {
    categoryIds: [categoryId],
    brandIds: [categoryId],
    skipCategories: isBrandScreen,
    skipBrands: !isBrandScreen
  }

  const { articlesResultCount, loading: articlesResultCountLoading } = useCategoryArticlesCountQuery({
    articlesQueryConditions,
    isBrandScreen,
    skip: !isCategoryDataReady
  })

  const onLoadingPageData = () => {
    if (isBrandCategory && brandName) {
      gaEvents.trackBrand(brandName)
      emarsysEvents.trackCategoryView([brandName])
    }
  }
  const shouldDisableTab = selectedTabName === 'article' || !isValidArray(products) || loading

  const handleTabsDisable = () => {
    setIsTabsDisabled(shouldDisableTab)
  }

  useEffect(handleTabsDisable, [shouldDisableTab])
  useEffect(onLoadingPageData, [isBrandCategory, brandName])
  useScreenBack([navigation])
  useScreenHeaderTitle(categoryName || name)

  if (consentForm) return consentForm
  if (initialComponent !== undefined) return initialComponent

  return (
    <>
      {articlesResultCountLoading && (
        <Container style={{ height: 56 }}>
          <ContentLoading height={56} type="ResultsCount" />
        </Container>
      )}
      {!articlesResultCountLoading && (
        <CategoryResultTabs
          activeTabName={selectedTabName}
          onChangeTab={setSelectedTabName}
          productsResultCount={productsResultCount}
          articlesResultCount={articlesResultCount}
          isArticlesLoading={articlesResultCountLoading}
        />
      )}
      {selectedTabName === 'product' && (
        <CategoryProducts
          isBrandCategory={isBrandScreen}
          onScroll={handleScroll}
          hasOffers={isValidArray(offers)}
          products={products}
          loading={loading}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          onEndReached={() => onEndReached(products)}
          isFetchingMore={isFetchingMore}
          brandBanner={brandBanner}
          brandLogo={!!findLuxuryBrand(categoryName) && brandLogo}
          url={url}
        />
      )}
      {selectedTabName === 'article' && (
        <CategoryArticles
          onScroll={handleScroll}
          articlesQueryConditions={articlesQueryConditions}
          skip={!categoryId}
        />
      )}
      {isValidArray(offers) && (
        <CurrentOffers offers={offers} isHeaderHidden={direction === 'down' || selectedTabName !== 'product'} />
      )}
    </>
  )
}

const ShopCategoryProductsScreen = ({ navigation, route: { params } }: any) => {
  const [isTabsDisabled, setIsTabsDisabled] = useState(true)
  const name = params?.name
  const url = params?.url_path || params?.url
  const urlPath = `/${formatPagePath(url, true)}`

  return (
    <SafeAreaView style={{ flex: 1 }} testID="ShopCategoryProductsScreen">
      <View testID={`urlIdentifier:${url?.replace('.html', '')}`} />
      <CategorySortAndFilterTabs
        disabled={isTabsDisabled}
        url={urlPath}
        parentCategoryUrl={params?.parent_category_url}
      />
      <ShopCategoryProducts name={name} url={urlPath} setIsTabsDisabled={setIsTabsDisabled} navigation={navigation} />
    </SafeAreaView>
  )
}

export default ShopCategoryProductsScreen
