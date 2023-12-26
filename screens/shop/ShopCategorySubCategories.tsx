import React, { useCallback, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { useScreenBack } from '../../navigation/utils'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isValidObject } from '../../utils/validation'
import { formatUrlPathQueryVariables } from '../../gql/hasura/utils/format'
import ContentLoading from '../../components/ui/ContentLoading'
import Container from '../../components/ui/Container'
import SubCategoryList from '../../components/category/SubCategoryList'
import Type from '../../components/ui/Type'
import ItemColumns from '../../components/ui/ItemColumns'
import useScreenQuery from '../../gql/useScreenQuery'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import SubCategoriesQuery from '../../gql/hasura/categories/SubCategoriesQuery'
import { categoryProductsInventoryCondition } from '../../gql/hasura/categories/CategoryProductsQuery'

const ShopCategorySubCategories = ({ navigation, route }: any) => {
  const [disabled, setDisabled] = useState(false)
  const { name: categoryName, url_path: topLevelCategoryUrlPath } = route?.params || {}
  const childCategoryProductCondition = { products: { product: categoryProductsInventoryCondition } }

  const { data, initialComponent, refreshing, handleRefresh } = useScreenQuery(SubCategoriesQuery, {
    useQueryHook: useHasuraQuery,
    variables: {
      categoryConditions: {
        ...formatUrlPathQueryVariables(topLevelCategoryUrlPath),
        is_active: { _eq: true },
        children: childCategoryProductCondition
      },
      childCategoryConditions: childCategoryProductCondition
    },
    skip: !topLevelCategoryUrlPath,
    formatResponse: response => response?.subCategories?.[0]?.children,
    LoaderComponent: (
      <Container>
        <ContentLoading type="ButtonList" height={150} />
        <ContentLoading type="ButtonList" height={150} />
        <ContentLoading type="ButtonList" height={150} />
        <ContentLoading type="ButtonList" height={150} />
      </Container>
    )
  })

  const handleItemPress = useCallback(
    item => {
      if (isValidObject(item) && !disabled) {
        setDisabled(true)

        navigation.push('ShopCategoryProducts', {
          url_path: item.metadata?.url_path || item.url_path,
          parent_category_url: topLevelCategoryUrlPath,
          name: item.name || categoryName
        })
      }
    },
    [disabled]
  )

  const renderItem = useCallback(
    (item, i) => <SubCategoryList onPress={handleItemPress} key={`${topLevelCategoryUrlPath}-${i}`} item={item} />,
    [disabled]
  )

  const onMount = () => {
    setDisabled(false)
  }

  useScreenFocusEffect(onMount, [topLevelCategoryUrlPath, data])
  useScreenBack([navigation])

  if (initialComponent) return initialComponent

  return (
    <ScrollView
      testID="ShopCategorySubCategories.ScrollView"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Container pv={1} pl={1.5}>
        <Type
          heading
          bold
          mb={2}
          onPress={() => handleItemPress(route.params)}
          testID="ShopCategorySubCategories.ButtonShopAll"
        >
          Shop All {categoryName}
        </Type>
        {data && <ItemColumns testID="ShopCategorySubCategories.ItemColumns" items={data} renderItem={renderItem} />}
      </Container>
    </ScrollView>
  )
}

export default ShopCategorySubCategories
