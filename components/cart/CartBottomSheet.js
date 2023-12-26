import React, { useCallback, useEffect, useRef } from 'react'
import { View, Pressable } from 'react-native'
import { useDispatch } from 'react-redux'
import BottomSheet, { BottomSheetBackdrop, useBottomSheet } from '@gorhom/bottom-sheet'
import { useActionState } from '../../store/utils/stateHook'
import { isAndroid } from '../../utils/device'
import { isValidArray } from '../../utils/validation'
import { useSafeInsets } from '../../utils/dimensions'
import useRecommendedProducts, { useRecommendedProductsFilters } from '../shop/hooks/useRecommendedProducts'
import screenRouter from '../../navigation/router/screenRouter'
import CartBottomSheetRecommendations from './CartBottomSheetRecommendations'
import cart from '../../store/modules/cart'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Type from '../ui/Type'
import Icon from '../ui/Icon'
import envConfig from '../../config/envConfig'

const styleSheet = {
  innerContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: theme.borderColor,
    paddingHorizontal: 15,
    paddingVertical: 30
  },
  iconTop: {
    top: -2,
    left: 5,
    position: 'absolute'
  },
  btnWhite: {
    container: {
      backgroundColor: 'white',
      marginBottom: 15,
      borderColor: 'black',
      borderWidth: 1
    },
    text: {
      color: 'black'
    }
  }
}

const SheetContent = ({
  navigation,
  containerHeight,
  hasRecommendations,
  recommendedProducts,
  onSheetClose,
  trackRecommendationClick
}) => {
  const { expand, animatedIndex } = useBottomSheet()
  const isPending = useActionState('cart.request.pending')
  const timeoutRef = useRef(null)
  const { navigateScreen } = screenRouter({ navigation })
  const { name: activeRoute, params } = navigation.getCurrentRoute() || {}
  const addedToCartItems = useActionState('cart.addedToCartItems') || []
  const hasRecommendedProducts = Array.isArray(recommendedProducts)
  const hasProductData = !!(addedToCartItems?.[0]?.productSku || addedToCartItems?.[0]?.name === 'Gift Certificate')
  const isBottomSheetVisible =
    hasRecommendedProducts &&
    hasProductData &&
    (activeRoute !== 'Cart' || (activeRoute === 'Cart' && params?.tabName === 'wishlist'))

  let label = 'Added to bag'

  if (isPending) {
    label = 'Adding...'
  }

  const handleClose = async () => {
    if (animatedIndex !== -1) {
      await onSheetClose()
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleCheckout = () => {
    handleClose()

    const unsubscribe = navigation.addListener('state', () => {
      unsubscribe()
      handleClose()
      navigation.setParams({ tabName: undefined })
    })

    navigateScreen('Main/Cart')
  }

  const handleCartQuantityChange = () => {
    if (isBottomSheetVisible) {
      expand()
      timeoutRef.current = setTimeout(handleClose, envConfig.cartSheetTimeout)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }

  useEffect(handleCartQuantityChange, [isBottomSheetVisible])

  return (
    <Container
      style={styleSheet.innerContainer}
      height={containerHeight}
      pt={3}
      ph={1.5}
      pb={4}
      testID="CartBottomSheet.SheetContent"
    >
      <View style={styleSheet.bar}>
        <View style={styleSheet.barInner} />
      </View>
      <Container rows justify="center" align="flex-start">
        {!!label && (
          <Container mr={1}>
            <Icon type="simplelineicons" name="handbag" color="black" style={styleSheet.iconBottom} size={24} />
            {!isPending && <Icon type="material" name="check" color="black" style={styleSheet.iconTop} size={30} />}
          </Container>
        )}
        <Type center heading size={20} mb={3}>
          {label}
        </Type>
      </Container>
      <Button size="large" styles={styleSheet.btnWhite} onPress={handleClose} testID="CartBottomSheet.Continue">
        Keep Shopping
      </Button>
      <Button size="large" onPress={handleCheckout} testID="CartBottomSheet.CheckoutNow">
        Checkout now
      </Button>
      {hasRecommendations && isValidArray(recommendedProducts) && (
        <CartBottomSheetRecommendations
          navigation={navigation}
          recommendedProducts={recommendedProducts}
          trackRecommendationClick={trackRecommendationClick}
          onClose={handleClose}
        />
      )}
    </Container>
  )
}

const CartBottomSheet = ({ navigation, hasRecommendations = false }) => {
  const { bottom: safeBottomInset } = useSafeInsets()
  const bottomSheetRef = useRef(null)
  const dispatch = useDispatch()
  console.log('-------------------------------------')
  const isPending = useActionState('cart.request.pending')
  console.log({ isPending })
  const requestName = useActionState('cart.request.meta.method.name')
  console.log({ requestName })
  const isAddLineItemsPending = isPending && requestName === 'addLineItems'
  console.log({ isAddLineItemsPending })
  const productPending = useActionState('cart.productPending')
  console.log({ productPending_brandName: productPending?.brand_name })
  const filters = useRecommendedProductsFilters(productPending?.brand_name)
  console.log({ filters })
  const { fetchRecommendedProducts, products: recommendedProducts, trackRecommendationClick } = useRecommendedProducts({
    logic: 'CART',
    limit: 3,
    filters,
    skip: false
  })
  console.log({ recommendedProductsCount: recommendedProducts?.length })

  const containerHeightWithRecommendations = isAndroid() ? 480 : 440
  const containerHeight =
    (hasRecommendations && isValidArray(recommendedProducts) ? containerHeightWithRecommendations : 210) +
    safeBottomInset

  const handleSheetClose = async () => {
    if (bottomSheetRef?.current) {
      await dispatch(cart.actions.addedToCartItems([]))
      bottomSheetRef.current.close()
    }
  }

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop {...props} opacity={0.8} pressBehavior={0} disappearsOnIndex={0} appearsOnIndex={1}>
        {/* fix android back issue */}
        <Pressable onPress={handleSheetClose} style={{ flex: 1 }} />
      </BottomSheetBackdrop>
    ),
    []
  )

  const handleFetchRecommendedProducts = () => {
    if (isAddLineItemsPending && productPending?.brand_name) {
      console.log('fetch recommended products started')
      fetchRecommendedProducts()
    }
  }

  useEffect(handleFetchRecommendedProducts, [isAddLineItemsPending, productPending])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[1, containerHeight]}
      handleComponent={() => null}
      enablePanDownToClose
      index={-1}
      backdropComponent={renderBackdrop}
    >
      <SheetContent
        navigation={navigation}
        containerHeight={containerHeight}
        hasRecommendations={hasRecommendations}
        recommendedProducts={hasRecommendations ? recommendedProducts : []}
        onSheetClose={handleSheetClose}
        trackRecommendationClick={trackRecommendationClick}
      />
    </BottomSheet>
  )
}

export default CartBottomSheet
