import React from 'react'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import { getIn } from '../../utils/getIn'
import { vw } from '../../utils/dimensions'
import LoadingOverlay from '../ui/LoadingOverlay'

type PromoBannerItemProps = {
  item: any
  index: number
  onPress: (item: any) => void
  isLoading: boolean
}

const PromoBannerItem = ({ item, index, onPress, isLoading }: PromoBannerItemProps) => (
  <Container style={{ overflow: 'hidden' }} key={index} align onPress={() => onPress(item)}>
    <ResponsiveImage
      src={getIn(item, 'image') || getIn(item, 'mobile_image')}
      width={getIn(item, 'mobile_image') ? 400 : 500}
      height={350}
      useAspectRatio
      styles={{ image: { width: vw(100) - 60, resizeMode: 'contain' } }}
    />
    <LoadingOverlay active={isLoading} />
  </Container>
)

export default PromoBannerItem
