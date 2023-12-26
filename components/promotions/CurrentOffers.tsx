import React, { memo } from 'react'
import { isValidArray } from '../../utils/validation'
import CurrentOffersCarousel from './CurrentOffersCarousel'
import CustomBottomSheet from '../ui/CustomBottomSheet'

type CurrentOffersProps = {
  offers: any
  isHeaderHidden: boolean
  headerHeight?: number
  headerStyle?: {} | any
}

const CurrentOffers = ({ offers = [], isHeaderHidden, headerHeight, headerStyle = {} }: CurrentOffersProps) => {
  const length = isValidArray(offers) ? offers.length : 0
  const hasMultipleOffers = length > 1
  const title = hasMultipleOffers ? `current offers (${length})` : 'current offer'

  if (!isValidArray(offers)) return null

  return (
    <CustomBottomSheet
      title={title}
      headerHeight={headerHeight}
      headerStyle={headerStyle}
      isHeaderVisible={!isHeaderHidden}
      content={<CurrentOffersCarousel onPress={() => {}} items={offers} />}
      height={420}
      onHeaderPress={undefined}
    />
  )
}

export default memo(CurrentOffers)
