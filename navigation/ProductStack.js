import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { screenOptions } from './utils'
import { isIos } from '../utils/device'
import ProductScreen from '../screens/product/ProductScreen'
import ProductTab from '../screens/product/ProductTab'
import ProductSubmitReview from '../screens/product/ProductSubmitReview'
import SearchSuggestionsScreen from '../screens/search/SearchSuggestionsScreen'
import SearchResultsScreen from '../screens/search/SearchResultsScreen'
import SearchScreenHeader from '../components/search/SearchScreenHeader'

const Stack = createStackNavigator()

const stackScreenOptions = {
  animationEnabled: isIos(),
  header: () => <SearchScreenHeader />
}

export const ProductStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Product" component={ProductScreen} />
    <Stack.Screen name="ProductTab" component={ProductTab} options={ProductTab.screenOptions} />
    <Stack.Screen
      name="ProductSubmitReview"
      component={ProductSubmitReview}
      options={screenOptions({
        title: 'Review',
        hasBack: true
      })}
    />

    <Stack.Screen name="SearchSuggestions" component={SearchSuggestionsScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
  </Stack.Navigator>
)
