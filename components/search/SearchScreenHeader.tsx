import React from 'react'
import { useNavigation } from '@react-navigation/core'
import Header from '../ui/Header'
import SearchScreenHeaderSearchBox from './SearchScreenHeaderSearchBox'
import Bag from '../ui/Bag'

const SearchScreenHeader = () => {
  const navigation = useNavigation()

  const handleRightPress = () => navigation.navigate('Cart', { fromScreen: 'Product' })

  return <Header hasBack center={<SearchScreenHeaderSearchBox />} onRightPress={handleRightPress} right={<Bag />} />
}

export default SearchScreenHeader
