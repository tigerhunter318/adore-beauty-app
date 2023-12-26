import React from 'react'
import { ScrollView } from 'react-native'
import { formatCurrency } from '../../utils/format'
import { getIn } from '../../utils/getIn'
import { withNavigation } from '../../navigation/utils'
import { isValidArray } from '../../utils/validation'
import FieldSet from '../ui/FieldSet'
import Container from '../ui/Container'
import CartConfirmLineItem from '../cart/CartConfirmLineItem'
import theme from '../../constants/theme'
import Type from '../ui/Type'
import OrderDeliveryDetails from './OrderDeliveryDetails'
import { withScreenRouter } from '../../navigation/router/screenRouter'

const SummaryRow = ({ title, price, text, bold, size = 13, heading = false, isDiscount = false }) => {
  const priceText = price !== undefined ? formatCurrency(price) : text

  return (
    <FieldSet pv={1.5} rows justify="space-between">
      <Type bold={bold} size={size} heading={heading}>
        {title}
      </Type>
      <Type bold={bold} size={size} color={price < 0 || isDiscount ? theme.orange : theme.lightBlack}>
        {isDiscount ? `- ${priceText}` : priceText}
      </Type>
    </FieldSet>
  )
}

const getProductDetails = (products, item) => {
  const sku = getIn(item, 'sku')
  if (sku && products) {
    return products.find(p => p.productSku.includes(sku))
  }
}

const OrderDetails = ({ order, productsData, products, navigation }) => {
  const totalPrice = parseFloat(getIn(order, 'total_inc_tax') || 0)
  const hasDiscount = !!parseFloat(order?.coupon_discount || 0)
  const hasGiftCert = !!parseFloat(order?.gift_certificate_amount || 0)
  const hasStoreCredit = !!parseFloat(order?.store_credit_amount || 0)

  const handleProductClick = item => {
    const sku = getIn(item, 'sku')

    if (sku && products) {
      const productData = products.find(p => p.productSku.includes(sku))
      withScreenRouter(navigation).push('ProductStack/Product', { ...productData })
    }
  }

  return (
    <ScrollView>
      <OrderDeliveryDetails data={order} />
      <Container>
        {isValidArray(productsData) &&
          productsData.map(item => (
            <FieldSet pv={0} key={item.id}>
              <CartConfirmLineItem
                item={item}
                product={getProductDetails(products, item)}
                onItemClick={() => handleProductClick(item)}
              />
            </FieldSet>
          ))}
      </Container>
      <Container background={theme.backgroundLightGrey}>
        <SummaryRow title="Order Summary" price={order.subtotal_inc_tax} />
        {hasDiscount && <SummaryRow title="Discounts" isDiscount price={order.coupon_discount} />}
        <SummaryRow title="Shipping" price={order.shipping_cost_inc_tax} />
        {hasStoreCredit && <SummaryRow title="Store Credit" price={order.store_credit_amount} isDiscount />}
        {hasGiftCert && <SummaryRow title="Gift Certificate" price={order.gift_certificate_amount} isDiscount />}
        <SummaryRow title="Total Paid" price={totalPrice} bold size={16} heading />
        <SummaryRow title="Gst" price={order.total_tax} />
        <SummaryRow title="Payment Method" text={order.payment_method} />
      </Container>
    </ScrollView>
  )
}

export default withNavigation(OrderDetails)
