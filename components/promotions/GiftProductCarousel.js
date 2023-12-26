import React from 'react'
import { StyleSheet, View } from 'react-native'
import Container from '../ui/Container'
import CustomCarousel from '../ui/CustomCarousel'
import { vw } from '../../utils/dimensions'
import { groupArray } from '../../utils/array'
import theme from '../../constants/theme'
import GiftListItem from './GiftListItem'
import { useActionState } from '../../store/utils/stateHook'

const styleSheet = StyleSheet.create({
  container: {},
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderColor: theme.white,
    borderWidth: 0
  }
})

const ProductCarouselItem = ({ item, navigation }) => {
  const isPending = useActionState('cart.request.pending')

  return (
    <View style={styleSheet.slide}>
      <Container rows justify="flex-start" style={{ width: '100%' }} ph={0.5}>
        {item &&
          item.map((product, i) => (
            <GiftListItem
              data={product}
              key={`gift-item-${i}-${product.id}`}
              navigation={navigation}
              disabled={isPending}
            />
          ))}
      </Container>
    </View>
  )
}

const GiftProductCarousel = ({ products, navigation }) => {
  if (products && products.length > 0) {
    const items = groupArray(products, 2)
    return (
      <CustomCarousel
        items={items}
        sliderWidth={vw(100) - 10}
        containerHeight={240}
        renderItem={({ item }) => <ProductCarouselItem item={item} navigation={navigation} />}
      />
    )
  }
  return null
}

export default GiftProductCarousel
