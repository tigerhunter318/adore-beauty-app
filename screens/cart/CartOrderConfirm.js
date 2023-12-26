import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import theme from '../../constants/theme'
import FieldSet from '../../components/ui/FieldSet'
import { formatCurrency, padNumber } from '../../utils/format'
import { getIn } from '../../utils/getIn'
import CartConfirmLineItem from '../../components/cart/CartConfirmLineItem'
import { useActionState } from '../../store/utils/stateHook'
import CustomButton from '../../components/ui/CustomButton'
import OrderDeliveryDetails from '../../components/order/OrderDeliveryDetails'
import { vw } from '../../utils/dimensions'
import { appReview } from '../../services/appReview'
import { isValidArray } from '../../utils/validation'
import { withScreenRouter } from '../../navigation/router/screenRouter'

const SummaryRow = ({ title, price, bold, size = 13, heading = false, isDiscount = false }) => (
  <FieldSet pv={1.5} rows justify="space-between">
    <Type bold={bold} size={size} heading={heading}>
      {title}
    </Type>
    <Type bold={bold} size={size} color={price < 0 || isDiscount ? theme.orange : theme.lightBlack}>
      {isDiscount ? `- ${formatCurrency(price)}` : formatCurrency(price)}
    </Type>
  </FieldSet>
)

const CountDown = ({ startAt = 300 }) => {
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    setSecs(startAt)
    const interval = setInterval(() => {
      setSecs(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [startAt])

  const m = Math.floor(secs / 60)
  const s = secs - m * 60
  return <Type color={theme.orange}>{`${padNumber(m)}:${padNumber(s)}`}</Type>
}

const CartOrderConfirm = ({ navigation }) => {
  const orderConfirmation = useActionState('cart.orderConfirmation')
  const productsData = useActionState('cart.orderConfirmation.products')
  const hasDiscount = !!parseFloat(getIn(orderConfirmation, 'coupon_discount') || 0)
  const totalPrice = parseFloat(getIn(orderConfirmation, 'total_inc_tax') || 0)
  const products = orderConfirmation.productsDetail
  const hasGiftCert = !!parseFloat(orderConfirmation.gift_certificate_amount)
  const hasStoreCredit = !!parseFloat(orderConfirmation.store_credit_amount)

  const getProductDetails = item => {
    const sku = getIn(item, 'sku')
    if (sku && products) {
      return products.find(p => p.productSku.includes(sku))
    }
  }

  const handleBackToShop = () => {
    appReview.rateApp()
    navigation.navigate('Shop')
  }

  const handleItemClick = product => {
    withScreenRouter(navigation).push('ProductStack/Product', product)
  }

  if (!orderConfirmation) {
    return null
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
      <OrderDeliveryDetails data={orderConfirmation} />
      <Container ph={0.5}>
        {isValidArray(productsData) &&
          productsData.map(item => (
            <FieldSet pv={0} key={item.id}>
              <CartConfirmLineItem item={item} product={getProductDetails(item)} onItemClick={handleItemClick} />
            </FieldSet>
          ))}
      </Container>
      <Container background={theme.backgroundLightGrey} ph={0.5}>
        <SummaryRow title="Order Summary" price={orderConfirmation.subtotal_inc_tax} />
        {hasDiscount && <SummaryRow title="Discounts" isDiscount price={orderConfirmation.coupon_discount} />}
        <SummaryRow title="Shipping" price={orderConfirmation.shipping_cost_inc_tax} />
        {hasStoreCredit && <SummaryRow title="Store Credit" price={orderConfirmation.store_credit_amount} isDiscount />}
        {hasGiftCert && (
          <SummaryRow title="Gift Certificate" price={orderConfirmation.gift_certificate_amount} isDiscount />
        )}
        <SummaryRow title="Total Paid" price={totalPrice} bold heading size={16} />
        <SummaryRow title="Gst" price={orderConfirmation.total_tax} />
      </Container>
      {/* disable support links */}
      {/*
      <FieldSet pv={2}>
        <Type color={theme.lightBlue} size={15} bold mb={1}>
          Need help or support?
        </Type>
        <Container rows>
          <CustomButton mr={1} fontSize={12} textProps={{ weight: 'Medium' }}>
            Send a message
          </CustomButton>
          <CustomButton background="white" fontSize={12} textProps={{ weight: 'Medium' }}>
            Contact info
          </CustomButton>
        </Container>
      </FieldSet>
      */}
      {/* disable upsell */}
      {/* <Container background="black" justify align pv={2.5}>
        <Type bold color="white" heading size={16}>
          Take a second look?
        </Type>
      </Container>
      <Container background={theme.backgroundLightGrey} justify align pv={2.5}>
        <Type bold heading size={14}>
          You have <CountDown /> to add your order
        </Type>
      </Container>
      <Container>
        <ProductsUpSell numOfProducts={4} />
      </Container>
      <Container center mb={2}>
        <CustomButton background="white" width={vw(100) - 60} bold pv={1.5} fontSize={16} onPress={handleBackToShop}>
          Back to shop
        </CustomButton>
      </Container> */}
      <Container center pv={2}>
        <CustomButton background="white" width={vw(92)} bold pv={1.5} fontSize={16} onPress={handleBackToShop}>
          Back to shop
        </CustomButton>
      </Container>
    </ScrollView>
  )
}

export default CartOrderConfirm
