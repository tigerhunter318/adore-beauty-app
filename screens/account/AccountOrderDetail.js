import React from 'react'
import { useDispatch } from 'react-redux'
import { useActionState } from '../../store/utils/stateHook'
import Container from '../../components/ui/Container'
import OrderDetails from '../../components/order/OrderDetails'
import cart from '../../store/modules/cart'
import { getIn } from '../../utils/getIn'
import Loading from '../../components/ui/Loading'
import useProductQuery from '../../gql/useProductQuery'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isValidArray } from '../../utils/validation'

const AccountOrderDetail = ({ route }) => {
  const { id: orderId } = route.params
  const dispatch = useDispatch()
  const orderConfirmation = useActionState('cart.orderConfirmation')
  const productsData = useActionState('cart.orderConfirmation.products')
  const skus = isValidArray(productsData)
    ? productsData.map(item => getIn(item, 'sku')).filter(string => !!string)
    : null

  const { data } = useProductQuery({
    sku: skus
  })
  const products = data && data.products

  const handleLoadData = () => {
    dispatch(cart.actions.orderConfirmation(null))
    if (orderId) {
      dispatch(cart.actions.fetchOrder(orderId))
    }
  }

  useScreenFocusEffect(handleLoadData, [orderId])

  return (
    <Container>
      {!orderConfirmation && <Loading lipstick />}
      {orderConfirmation && productsData && (
        <OrderDetails order={orderConfirmation} productsData={productsData} products={products} />
      )}
    </Container>
  )
}

export default AccountOrderDetail
