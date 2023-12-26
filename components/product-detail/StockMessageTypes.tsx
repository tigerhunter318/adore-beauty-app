import React from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Icon from '../ui/Icon'

const styles = StyleSheet.create({
  default: {
    backgroundColor: theme.lightPink,
    paddingLeft: 15,
    paddingVertical: 10
  },
  defaultLabelContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  },
  defaultLabel: {
    lineHeight: 18,
    paddingLeft: 10,
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 0.5
  },
  defaultMessageSubLabel: {
    lineHeight: 18,
    fontSize: 12,
    paddingLeft: 22,
    paddingTop: 5,
    color: theme.lightBlack
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: theme.lightGrey
  },
  label: {
    paddingLeft: 10,
    letterSpacing: 1,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  soldOut: {
    paddingVertical: 10
  },
  soldOutLabel: {
    color: theme.textGreyDark
  },
  waitlist: {
    paddingVertical: 13
  },
  waitlistLabel: {
    color: theme.lightBlack
  },
  backorders: {
    backgroundColor: theme.black,
    paddingVertical: 5
  },
  backordersLabel: {
    color: theme.white
  }
})

const WaitlistMessage = () => (
  <Container style={[styles.container, styles.waitlist]}>
    <Icon name="close" type="material" size={20} color={theme.lightBlack} />
    <Type semiBold style={[styles.label, styles.waitlistLabel]}>
      Out of stock
    </Type>
  </Container>
)

const BackordersMessage = () => (
  <Container style={[styles.container, styles.backorders]}>
    <AdoreSvgIcon name="PreOrder" width={36} height={36} color={theme.lightBlack} />
    <Type style={[styles.label, styles.backordersLabel]}>
      Out of stock -<Type bold> due in 8 days</Type>
    </Type>
  </Container>
)

const SoldOutMessage = () => (
  <Container style={[styles.container, styles.soldOut]}>
    <AdoreSvgIcon name="SoldOutBox" width={26} height={26} color={theme.lightBlack} />
    <Type semiBold style={[styles.label, styles.soldOutLabel]}>
      this product is sold out
    </Type>
  </Container>
)

const DefaultMessage = ({ isShowable, localDispatchTime }: { isShowable?: boolean; localDispatchTime?: string }) => (
  <Container style={styles.default}>
    <Container style={styles.defaultLabelContainer}>
      <AdoreSvgIcon name="tick" width={12} height={12} color={theme.lightBlack} />
      <Type semiBold style={styles.defaultLabel}>
        in stock
      </Type>
    </Container>
    {isShowable && (
      <Type style={styles.defaultMessageSubLabel}>- Free Same day dispatch before {localDispatchTime}</Type>
    )}
  </Container>
)

type StockMessageTypesProps = {
  isWaitlistAndOutOfStock: boolean
  isBackordersAndOutOfStock: boolean
  isItemSoldOut: boolean
  isShowable: boolean
  localDispatchTime: string
}

const StockMessageTypes = ({
  isWaitlistAndOutOfStock,
  isBackordersAndOutOfStock,
  isItemSoldOut,
  ...props
}: StockMessageTypesProps) => {
  switch (true) {
    case isWaitlistAndOutOfStock:
      return <WaitlistMessage />
    case isBackordersAndOutOfStock:
      return <BackordersMessage />
    case isItemSoldOut:
      return <SoldOutMessage />
    default:
      return <DefaultMessage {...props} />
  }
}

export default StockMessageTypes
