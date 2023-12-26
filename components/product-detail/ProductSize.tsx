import React from 'react'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'

type ProductSize = {
  size: string
  mt?: number
  ph?: number
}

const ProductSize = ({ size = '', mt = 0, ph = 0, ...props }) =>
  !!size && (
    <Container mt={mt} ph={ph} {...props}>
      <Type uppercase size={11} letterSpacing={0.5} lineHeight={18} color={theme.lighterBlack}>
        {`size: `}
        <Type color={theme.black} semiBold letterSpacing={0.5}>
          {size}
        </Type>
      </Type>
    </Container>
  )

export default ProductSize
