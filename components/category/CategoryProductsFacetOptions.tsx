import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { isValidArray } from '../../utils/validation'
import { vh } from '../../utils/dimensions'
import { formatCategoryProductsQuery } from '../../gql/hasura/categories/CategoryProductsQuery'
import Container from '../ui/Container'
import RadioInput from '../ui/RadioInput'
import useSubCategoriesFilters from './hooks/useSubCategoriesFilters'
import useProductFacetGroupOptionsQuery from './hooks/useProductFacetGroupOptionsQuery'
import ListFooterLoadingIndicator from '../ui/ListFooterLoadingIndicator'
import useCategoryBrandsFilters from './hooks/useCategoryBrandsFilters'
import Loading from '../ui/Loading'
import useCategoryFilters from './hooks/useCategoryFilters'

type FacetOption = {
  id: any
  name: string
  checked: boolean
  onChange: (item: any) => Promise<void>
}
const FacetOption = ({ id, name, checked, onChange, ...props }: FacetOption) => (
  <RadioInput
    id={id}
    name={name}
    label={name}
    onPress={onChange}
    checked={checked}
    style={{ text: { flex: 1, fontSize: 13, paddingRight: 5 } }}
    {...props}
  />
)
type FacetOptionsList = {
  data: any[]
  checkIds: any[]
  name?: string
  onEndReached?: (info: { distanceFromEnd: number }) => void
  loading?: boolean
}
const FacetOptionsList = ({ data, checkIds, name, onEndReached = () => {}, loading = false }: FacetOptionsList) => {
  const { selectFacetOption } = useCategoryFilters()

  const handleOptionPress = async item => {
    selectFacetOption(name, item.id)
  }

  const renderItem = useCallback(
    ({ item }: any) => (
      <FacetOption
        onChange={handleOptionPress}
        checked={checkIds?.find(code => code === item.code)}
        id={item.code}
        name={item.name}
      />
    ),
    [checkIds]
  )

  const keyExtractor = useCallback(item => item.id || item.code, [])

  if (!isValidArray(data)) return null

  return (
    <FlatList
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20 }}
      renderItem={renderItem}
      data={data}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
      initialNumToRender={20}
      ListFooterComponent={<ListFooterLoadingIndicator active={loading} />}
    />
  )
}

const CategoryProductsFacetOptions = ({ code, url }: { code: string; url: string }) => {
  const { getPriceFilters, selectedFacets } = useCategoryFilters()
  const {
    data: facetsData,
    selectedFacetOptions,
    loading: facetsLoading,
    onEndReached,
    isFetchingMore: facetsIsFetchingMore
  } = useProductFacetGroupOptionsQuery({
    code,
    skip: ['subCategory', 'price', 'brand'].includes(code)
  })
  const productConditions = { products: { product: formatCategoryProductsQuery(selectedFacets, 'subCategory') } }
  const { subCategories, loading: subCategoriesLoading } = useSubCategoriesFilters({
    url,
    productConditions,
    skip: code !== 'subCategory'
  })

  const {
    brands,
    loading: brandsLoading,
    onEndReached: brandsOnEndReached,
    isFetchingMore: brandsIsFetchingMore
  } = useCategoryBrandsFilters({
    skip: code !== 'brand'
  })

  if (facetsLoading || subCategoriesLoading || brandsLoading) return <Loading lipstick style={{ height: vh(80) }} />

  const isFetchingMore = facetsIsFetchingMore || brandsIsFetchingMore

  let data
  switch (code) {
    case 'brand':
      data = brands
      break
    case 'subCategory':
      data = subCategories
      break
    case 'price':
      data = getPriceFilters()
      break
    default:
      data = facetsData
      break
  }

  return (
    <Container flex={1}>
      <FacetOptionsList
        data={data}
        checkIds={selectedFacetOptions}
        name={code}
        onEndReached={() => {
          if (code === 'brand') {
            return brandsOnEndReached(brands)
          }
          onEndReached(data)
        }}
        loading={isFetchingMore}
      />
    </Container>
  )
}

export default CategoryProductsFacetOptions
