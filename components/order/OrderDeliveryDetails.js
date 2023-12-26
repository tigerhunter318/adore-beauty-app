import React from 'react'
import { StyleSheet } from 'react-native'
import { formatDate } from '../../utils/date'
import { getIn } from '../../utils/getIn'
import Container from '../ui/Container'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import OrderStatusLabel from './OrderStatusLabel'
import Hr from '../ui/Hr'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center'
  },
  orderId: {
    fontSize: 15,
    paddingTop: 15
  },
  transactionId: {
    fontSize: 13,
    paddingTop: 5
  },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  orderStatusText: {
    fontSize: 12,
    lineHeight: 18
  },
  shippingMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20
  },
  shippingMethodText: {
    fontSize: 11,
    marginLeft: 20,
    color: theme.lighterBlack
  },
  deliveryAddress: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.lighterBlack
  }
})

const OrderDeliveryDetails = ({ data }) => {
  const shippingAddress = getIn(data, 'shippingAddress.0')

  const AddressPart = ({ name, suffix = '\n' }) =>
    !!shippingAddress[name] && (
      <>
        {shippingAddress[name]}
        {suffix}
      </>
    )
  return (
    <Container>
      <Container style={styles.container}>
        <AdoreSvgIcon name="TickCircle" width={54} height={54} />
        <Type semiBold style={styles.orderId}>
          Thank you for your order <Type bold>#{data.id}</Type>
        </Type>
        {data?.transaction?.id && (
          <Type semiBold style={styles.transactionId}>
            Transaction <Type bold>#{data?.transaction?.id}</Type>
          </Type>
        )}
      </Container>
      <Container style={styles.orderStatusContainer}>
        <Container>
          <Type style={styles.orderStatusText}>
            <Type bold>Order Date: </Type>
            {formatDate(data.date_created)}
          </Type>
          {!!data.date_shipped && (
            <Type style={styles.orderStatusText}>
              <Type bold>Shipped Date: </Type>
              {formatDate(data.date_shipped)}
            </Type>
          )}
          {/* 
          // TODO - display estimated delivery time - https://adorebeautywiki.atlassian.net/browse/MOB-203?focusedCommentId=123221
           {!!data.estimated_delivery && (
            <Type style={styles.orderStatusText}>
              <Type bold>Estimated Delivery: </Type>
              {formatDate(data.estimated_delivery)}
            </Type>
          )} 
          */}
        </Container>
        <OrderStatusLabel status={data.status} fontSize={10} />
      </Container>
      <Hr mb={1} mt={1.5} full height={1} />
      {!!shippingAddress && (
        <>
          <Container style={styles.shippingMethodContainer}>
            <AdoreSvgIcon name="mail" width={30} height={30} />
            <Type style={styles.shippingMethodText}>{shippingAddress.shipping_method}</Type>
          </Container>
          <Container ph={2}>
            <Type bold pb={0.5} heading style={styles.deliveryAddress}>
              Deliver To:
            </Type>
            <Type style={styles.deliveryAddress}>
              {shippingAddress.first_name} {shippingAddress.last_name}
            </Type>
            <Type style={styles.deliveryAddress}>
              <AddressPart name="street_1" />
              <AddressPart name="street_2" />
              <AddressPart name="city" suffix=", " />
              {'\n'}
              <AddressPart name="state" suffix={' '} />
              <AddressPart name="zip" />
            </Type>
          </Container>
          <Hr mb={0} mt={0} full height={1} />
        </>
      )}
    </Container>
  )
}

export default OrderDeliveryDetails
