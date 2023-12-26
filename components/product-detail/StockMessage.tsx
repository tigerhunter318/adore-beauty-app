import React, { useEffect, useState } from 'react'
import StockMessageTypes from './StockMessageTypes'
import getDispatchCutOffTime from '../../hooks/getDispatchCutOffTime'
import formatProductInventory from '../product/utils/formatProductInventory'

type StockMessageProps = {
  productData: {}
  productVariant: {} | any
}

const StockMessage = ({ productData, productVariant }: StockMessageProps) => {
  const [isShowable, setIsShowable] = useState<boolean>(false)
  const [localDispatchTime, setLocalDispatchTime] = useState<string>('')
  const { isTimeShowable, utcDispatchDate } = getDispatchCutOffTime()
  const { isOutOfStock, isBackordersOutOfStock, isSoldOut } = formatProductInventory(productData, productVariant)

  const setLocalDispachTime = () => {
    if (utcDispatchDate) {
      setIsShowable(!!isTimeShowable)
      setLocalDispatchTime(utcDispatchDate)
    }
  }

  useEffect(setLocalDispachTime, [])

  return (
    <StockMessageTypes
      isWaitlistAndOutOfStock={isOutOfStock}
      isBackordersAndOutOfStock={isBackordersOutOfStock}
      isItemSoldOut={isSoldOut}
      isShowable={isShowable}
      localDispatchTime={localDispatchTime}
    />
  )
}

export default StockMessage
