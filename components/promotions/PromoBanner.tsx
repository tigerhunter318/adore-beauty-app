import React from 'react'
import { vw } from '../../utils/dimensions'
import CustomFlatlistCarousel from '../ui/CustomFlatlistCarousel'

type PromoBannerProps = {
  items: []
  onPress: (item: any) => void
  loadingLinkUrl: string
}

const PromoBanner = ({ items, onPress, loadingLinkUrl }: PromoBannerProps) => (
  <CustomFlatlistCarousel
    data={items}
    onPress={onPress}
    type="promoBanners"
    width={vw(100) - 60}
    carouselItemStyle={{ marginLeft: 10 }}
    loadingLinkUrl={loadingLinkUrl}
  />
)

export default PromoBanner
