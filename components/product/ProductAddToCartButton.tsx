import React from 'react'
import { StyleSheet } from 'react-native'
import { isSmallDevice } from '../../utils/device'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import CatalogProductProvider from './CatalogProductProvider'
import OutOfStockSubscribe from './OutOfStockSubscribe'
import Icon from '../ui/Icon'
import formatProductInventory from './utils/formatProductInventory'
import { logObjectToJson } from '../../utils/logInfo'

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 3,
    flexDirection: 'row'
  },
  button: {
    textTransform: 'uppercase'
  },
  label: {
    paddingLeft: 10,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  backordersContainer: {
    borderWidth: 1.2,
    borderColor: theme.orange
  },
  backordersBadge: {
    position: 'absolute',
    top: -17,
    right: 4
  },
  soldOutLabel: {
    paddingLeft: 0,
    color: theme.textGreyDark
  }
})

const DefaultAddButton = ({
  onPress,
  disabled,
  isListingView,
  isCartLineItem
}: {
  onPress: () => void
  disabled: boolean
  isListingView: boolean
  isCartLineItem: boolean
}) => {
  const getLabel = () => {
    let label = isListingView ? 'Add' : 'Add to bag'
    if (isCartLineItem) {
      label = isListingView ? 'Added' : 'Added to bag'
    }
    if (disabled) {
      label = isListingView ? 'Add' : 'Adding...'
    }
    return label
  }

  return (
    <Container
      onPress={onPress}
      style={styles.buttonContainer}
      background={theme.orange}
      disabled={disabled}
      ph={isListingView ? 0 : 1}
      testID="Button.AddToCart"
    >
      <Type bold color={theme.white} size={12} style={styles.button} testID="Button.AddToCart.Type">
        {getLabel()}
      </Type>
    </Container>
  )
}

const GiftlistButton = ({ disabled }: { disabled: boolean }) => (
  <Container style={styles.buttonContainer} disabled={disabled}>
    <Icon color={theme.black} name="close" type="material" size={20} />
    <Type pl={0.5} semiBold style={styles.label} testID="GiftlistButton.Type">
      sold out
    </Type>
  </Container>
)

const WaitlistButton = ({
  disabled,
  productSku,
  productUrl,
  isModalVisible,
  onNotifyPress,
  isListingView
}: {
  disabled: boolean
  productSku: string
  productUrl: string
  isModalVisible: boolean
  onNotifyPress: () => void
  isListingView: boolean
}) => (
  <Container
    onPress={onNotifyPress}
    style={styles.buttonContainer}
    background={theme.lightGrey}
    disabled={disabled}
    ph={!isListingView ? 1 : 0}
  >
    <Container center rows>
      <AdoreSvgIcon name="email" height={14} width={16} />
      {!isListingView && !isSmallDevice() ? (
        <Type semiBold style={styles.label} testID="WaitlistButton.Type">
          notify me
        </Type>
      ) : null}
    </Container>
    <CatalogProductProvider productSku={productSku}>
      {({ catalogProductData }: any) => (
        <OutOfStockSubscribe
          isVisible={isModalVisible}
          onClose={onNotifyPress}
          baseVariantId={catalogProductData?.base_variant_id}
          id={catalogProductData?.id}
          productUrl={productUrl}
          isListingView={isListingView}
        />
      )}
    </CatalogProductProvider>
  </Container>
)

const BackordersButton = ({
  onPress,
  disabled,
  isListingView,
  isCarouselItem
}: {
  onPress: () => void
  disabled: boolean
  isListingView: boolean
  isCarouselItem?: boolean
}) => (
  <Container
    onPress={onPress}
    style={[styles.buttonContainer, styles.backordersContainer]}
    disabled={disabled}
    background={theme.white}
    ph={!isListingView ? 1 : 0}
  >
    {isListingView ? (
      <Container style={styles.backordersBadge}>
        <AdoreSvgIcon name="PreOrderBadge" color={theme.black} width={31} height={31} />
      </Container>
    ) : (
      <Container pr={0.5}>
        <AdoreSvgIcon name="PreOrder" width={30} height={30} />
      </Container>
    )}
    <Type semiBold style={styles.button} color={theme.orange} size={isSmallDevice() || isCarouselItem ? 8 : 12}>
      preorder
    </Type>
  </Container>
)

const SoldOutButton = ({ isListingView }: { isListingView: boolean }) => (
  <Container style={styles.buttonContainer} background={theme.lightGrey} ph={1}>
    <Type
      semiBold
      center
      style={[styles.label, styles.soldOutLabel, { fontSize: isListingView ? 8 : 12 }]}
      testID="SoldOutButton.Type"
    >
      sold out
    </Type>
  </Container>
)

type ProductAddToCartButtonProps = {
  productData: object
  productVariant: object
  isCartLineItem: boolean
  isModalVisible: boolean
  isListingView: boolean
  disabled: boolean
  productSku: string
  productUrl: string
  onNotifyPress: () => void
  onPress: () => void
  isCarouselItem?: boolean
}

const ProductAddToCartButton = ({ productData, productVariant, ...props }: ProductAddToCartButtonProps) => {
  const { isSoldOut, isOutOfStock, isBackordersOutOfStock, isGiftlistItemOutOfStock } = formatProductInventory(
    productData,
    productVariant
  )

  // console.log('198', '', 'ProductAddToCartButton', productData, productVariant, props)
  // logObjectToJson(productData)

  switch (true) {
    case isGiftlistItemOutOfStock:
      return <GiftlistButton {...props} />
    case isOutOfStock:
      return <WaitlistButton {...props} />
    case isBackordersOutOfStock:
      return <BackordersButton {...props} />
    case isSoldOut:
      return <SoldOutButton {...props} />
    default:
      return <DefaultAddButton {...props} />
  }
}

export default ProductAddToCartButton
