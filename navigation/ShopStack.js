import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ShopHeader from '../components/shop/ShopHeader'
import getTabBar from '../components/ui/TabBarLabel'
import ShopCategoryTopLevelCategories from '../screens/shop/ShopCategoryTopLevelCategories'
import ShopCategorySubCategories from '../screens/shop/ShopCategorySubCategories'
import ShopCategoryProductsScreen from '../screens/shop/ShopCategoryProductsScreen'
import ShopBrands from '../screens/shop/ShopBrands'
import ShopConcern from '../screens/shop/ShopConcern'
import ShopConcernCategory from '../screens/shop/ShopConcernCategory'
import ShopScreen from '../screens/shop/ShopScreen'
import ShopPromotions from '../screens/shop/ShopPromotions'
import { config, withScreenOptions } from './utils'

const Stack = createStackNavigator()
const TopTab = createMaterialTopTabNavigator()

const topTabOptions = {
  indicatorStyle: {
    backgroundColor: 'black'
  },
  style: {
    height: 55
  }
}

export const ShopCategoryStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="ShopCategory" component={ShopCategoryTopLevelCategories} />
    <Stack.Screen name="ShopCategorySubCategories" component={ShopCategorySubCategories} />
  </Stack.Navigator>
)
export const ShopBrandStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="ShopBrands" component={ShopBrands} />
  </Stack.Navigator>
)
export const ShopConcernStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="ShopConcern" component={ShopConcern} />
    <Stack.Screen name="ShopConcernCategory" component={ShopConcernCategory} />
  </Stack.Navigator>
)

export const ShopTabStack = () => (
  <TopTab.Navigator tabBarOptions={topTabOptions} swipeEnabled={false}>
    <TopTab.Screen
      options={{
        tabBarLabel: getTabBar('Category')
      }}
      name="category"
      component={ShopCategoryStack}
    />
    <TopTab.Screen
      name="brand"
      options={{
        tabBarLabel: getTabBar('Brand')
      }}
      component={ShopBrandStack}
    />
    <Stack.Screen
      name="concern"
      options={{
        tabBarLabel: getTabBar('Concern')
      }}
      component={ShopConcernStack}
    />
  </TopTab.Navigator>
)

export const shopScreenOptions = props => withScreenOptions(ShopHeader, props)

export const ShopStack = () => (
  <Stack.Navigator {...config}>
    <Stack.Screen
      name="Shop"
      component={ShopScreen}
      options={shopScreenOptions({ hasBack: false, showTabNav: true, hasSearch: true })}
    />
    <Stack.Screen
      name="ShopCategoryProducts"
      component={ShopCategoryProductsScreen}
      options={shopScreenOptions({ hasBack: true, showTabNav: false, hasSearch: true })}
    />
    <Stack.Screen
      name="ShopTabs"
      component={ShopTabStack}
      options={shopScreenOptions({ hasBack: true, showTabNav: false, hasSearch: true })}
    />
    <Stack.Screen
      name="ShopPromotions"
      component={ShopPromotions}
      options={shopScreenOptions({ hasBack: true, hasSearch: true, title: 'Promotions' })}
    />
  </Stack.Navigator>
)
