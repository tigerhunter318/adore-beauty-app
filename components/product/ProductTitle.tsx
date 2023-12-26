import React from 'react'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import { formatBrandNameFromProductName, stripBrandFromProductName } from '../../utils/format'

const styleSheet = {
  title: {
    height: 55,
    fontSize: 13
  }
}

type ProductTitleProps = {
  name: string
  brand?: string
  style?: {} | any
  numOfLines?: number
}

const ProductTitle = ({ name, brand, style = {}, numOfLines = 3 }: ProductTitleProps) => {
  if (brand) {
    return (
      <Type numberOfLines={numOfLines} style={[styleSheet.title, style]}>
        <Type bold>
          {formatBrandNameFromProductName(brand, name)}
          {'\n'}
        </Type>
        <Type color={theme.lighterBlack}>{stripBrandFromProductName(brand, name)}</Type>
      </Type>
    )
  }

  return (
    <Type numberOfLines={numOfLines} style={[styleSheet.title, style]}>
      <Type>{name?.trim()}</Type>
    </Type>
  )
}

export default ProductTitle
