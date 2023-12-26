import React, { useCallback, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isValidObject } from '../../utils/validation'
import ButtonCategory from '../../components/shop/ButtonCategory'
import ItemColumns from '../../components/ui/ItemColumns'
import useScreenQuery from '../../gql/useScreenQuery'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import TopLevelCategoriesQuery from '../../gql/hasura/categories/TopLevelCategoriesQuery'
import { categoryProductsInventoryCondition } from '../../gql/hasura/categories/CategoryProductsQuery'

const ShopCategoryTopLevelCategories = ({ navigation }: any) => {
  const [disabled, setDisabled] = useState(false)
  const childCategoryProductCondition = { children: { products: { product: categoryProductsInventoryCondition } } }

  const { data, initialComponent, refreshing, handleRefresh } = useScreenQuery(TopLevelCategoriesQuery, {
    useQueryHook: useHasuraQuery,
    variables: {
      categoryConditions: {
        _or: [{ name: { _eq: 'Gift Cards' } }, childCategoryProductCondition],
        path_tree: { _matches: 'au.default.*{1}' },
        include_in_navigation_menu: { _eq: true },
        is_active: { _eq: true }
      }
    },
    formatResponse: res => [...(res?.topLevelCategories || []), ...(res?.specials?.[0]?.children || [])]
  })

  const handleOnPress = useCallback(
    category => {
      if (!disabled && isValidObject(category)) {
        setDisabled(true)
        if (category.name === 'Gift Cards') {
          return navigation.push('GiftCertificate')
        }
        if (category.metadata?.url_path) {
          return navigation.push('ShopCategorySubCategories', {
            name: category.name,
            url_path: category.metadata.url_path
          })
        }
      }
    },
    [disabled]
  )

  const renderItem = useCallback(
    (category, index) => (
      <ButtonCategory
        index={index}
        key={`cat-${category.metadata?.url_path}-${category.name}`}
        item={category}
        onPress={() => handleOnPress(category)}
      />
    ),
    [disabled]
  )

  const onMount = () => {
    setDisabled(false)
  }

  useScreenFocusEffect(onMount, [])

  if (initialComponent) return initialComponent

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      testID="ShopCategory.ScrollView"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <ItemColumns
        testID="ShopCategory.ItemColumns"
        items={data}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
        renderItem={renderItem}
      />
    </ScrollView>
  )
}

export default ShopCategoryTopLevelCategories
