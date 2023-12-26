import React from 'react'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'

const styleSheet = {
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 16
  }
}

const BeautyIQSubNavigationItem = ({ data, checked, onCategoryPress }) => (
  <Container pv={1.1} ph={0.3}>
    <Container
      background={checked ? theme.black : theme.white}
      ph={0.9}
      pv={0.25}
      onPress={() => onCategoryPress(data)}
    >
      <Type
        bold={checked}
        heading
        size={12}
        lineHeight={20}
        color={checked ? theme.white : theme.black}
        testID={`BeautyIQSubNavigationItem.Type${checked ? ':checked' : ''}`}
      >
        {data?.name}
      </Type>
    </Container>
  </Container>
)

const blockedCategories = [5682, 161, 46, 5759, 999999]

const trimSlug = text => !!text && text.toLowerCase().replace('-', '')

const BeautyIQSubNavigation = ({ categories: categoriesData, categorySlug }) => {
  const navigation = useNavigation()
  const categories = (categoriesData?.category || []).filter(category => !blockedCategories.includes(category.id))
  const handleCategoryPress = category => {
    navigation.setParams({ slug: category.url_key })
  }

  const renderItem = ({ item }) => {
    const checked = trimSlug(categorySlug) === trimSlug(item.url_key) || (!categorySlug && item.id === 'all')
    return <BeautyIQSubNavigationItem data={item} checked={checked} onCategoryPress={handleCategoryPress} />
  }

  if (!categoriesData) {
    return null
  }

  return (
    <Container style={styleSheet.container} testID="BeautyIQSubNavigation">
      <FlatList
        data={[{ name: 'All', id: 'all' }, ...categories]}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={category => category.id}
      />
    </Container>
  )
}

export default BeautyIQSubNavigation
