import React from 'react'
import { TouchableOpacity } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ReviewSummary from '../product-review/ReviewSummary'
import theme from '../../constants/theme'
import { formatCurrency } from '../../utils/format'

const RichTextProductManagedCopyProduct = ({ data, onPress }) => {
  const product = data?.product

  if (!product) {
    return null
  }

  const {
    name,
    price,
    oldPrice,
    has_special_price: hasSpecialPrice,
    review_avg: reviewAverage,
    review_total: reviewTotal,
    product_id: productId
  } = product

  return (
    <Container pv={0.5}>
      {!!name && (
        <TouchableOpacity onPress={() => onPress(productId)}>
          <Type size={14} lineHeight={17.5} bold underline color={theme.lightBlack}>
            {name}
          </Type>
        </TouchableOpacity>
      )}
      {!!price && (
        <Container mt={1} rows>
          <Type size={18} bold lineHeight={22.5} color={theme.lightBlack}>
            {formatCurrency(price)}
          </Type>
          {!!hasSpecialPrice && (
            <Type size={18} lineThrough ml={1} color={theme.lightBlack}>
              {formatCurrency(oldPrice)}
            </Type>
          )}
        </Container>
      )}
      {reviewAverage >= 0 && (
        <Container mt={0.5} rows>
          <ReviewSummary reviewAverage={reviewAverage} reviewTotal={reviewTotal} />
        </Container>
      )}
    </Container>
  )
}

export default RichTextProductManagedCopyProduct
