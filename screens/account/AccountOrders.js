import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import theme from '../../constants/theme'
import List from '../../components/ui/List'
import cart from '../../store/modules/cart'
import { useActionState, useRequestPending } from '../../store/utils/stateHook'
import { formatCurrency } from '../../utils/format'
import { formatDate } from '../../utils/date'
import Loading from '../../components/ui/Loading'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import OrderStatusLabel from '../../components/order/OrderStatusLabel'
import { compareDate } from '../../utils/sort'
import { isValidArray } from '../../utils/validation'
import Icon from '../../components/ui/Icon'
import useRefreshControl from '../../hooks/useRefreshControl'

const OrderItemText = ({ children, width, ...rest }) => (
  <Type size={11} color={theme.lightBlack} style={{ width, borderWidth: 0 }} numberOfLines={1} {...rest}>
    {children}
  </Type>
)

const OrderItem = ({ item }) => (
  <Container rows align justify="flex-end">
    <Container rows align flex={1} justify="space-between">
      <OrderItemText width={70}>{item.id}</OrderItemText>
      <OrderStatusLabel status={item.order_status} width={90} />
      <OrderItemText width={80} center>
        {formatDate(item.created_at)}
      </OrderItemText>
      <OrderItemText mr={0.5} width={60} center>
        {formatCurrency(item.total_inc_tax)}
      </OrderItemText>
    </Container>
  </Container>
)

const OrderTable = ({ items, navigation }) => {
  const handleItemPress = item => {
    navigation.push('AccountOrderDetail', { id: item.id })
  }
  return (
    <Container>
      <List items={items} renderItem={OrderItem} onItemPress={handleItemPress} />
    </Container>
  )
}

const AccountOrders = ({ navigation }) => {
  const [sortingOrder, setSortingOrder] = useState('desc')
  const dispatch = useDispatch()
  const isRequestPending = useRequestPending('fetchCustomerOrders')
  const customerOrders = useActionState('cart.customerOrders')
  const sortedOrders = isValidArray(customerOrders) ? customerOrders.sort(compareDate('created_at', sortingOrder)) : []
  const hasOrders = !isRequestPending && customerOrders?.length > 0

  const handleSortingPress = () => setSortingOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))

  const fetchCustomerOrders = () => {
    dispatch(cart.actions.fetchCustomerOrders())
  }

  const { refreshControl } = useRefreshControl(fetchCustomerOrders)

  useScreenFocusEffect(fetchCustomerOrders, [])

  return (
    <ScrollView testID="AccountOrdersScreen" refreshControl={refreshControl}>
      <Container pv={2}>
        <Type bold center size={25}>
          Orders
        </Type>
        {hasOrders && (
          <Container
            style={{ position: 'absolute', right: 10, top: 18, width: 40 }}
            center
            onPress={handleSortingPress}
          >
            <Icon name="sort" type="materialcommunityicons" size={24} color={theme.black} />
            <Type size={12} color={theme.lighterBlack}>
              {sortingOrder}
            </Type>
          </Container>
        )}
      </Container>
      <Container>
        {isRequestPending && <Loading lipstick screen />}
        {hasOrders && <OrderTable navigation={navigation} items={sortedOrders} />}
        {!isRequestPending && !hasOrders && <Type center>No orders found.</Type>}
      </Container>
    </ScrollView>
  )
}

export default AccountOrders
