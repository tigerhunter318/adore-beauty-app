import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/core'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import CustomFlatlistCarousel from '../ui/CustomFlatlistCarousel'
import { vw } from '../../utils/dimensions'
import { StackNavigationProp } from '@react-navigation/stack/src/types'

type CurrentOffersCarouselProps = {
  items: []
  onPress: () => void
}

const CurrentOffersCarousel = ({ items, onPress }: CurrentOffersCarouselProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>()

  const handlePress = useCallback(({ item }) => {
    onPress()
    navigation.push('HasuraPromoQuickView', item)
  }, [])

  return (
    <Container backgroundColor={theme.white}>
      <CustomFlatlistCarousel data={items} onPress={handlePress} type="currentOffers" width={vw(60)} />
    </Container>
  )
}

export default CurrentOffersCarousel
