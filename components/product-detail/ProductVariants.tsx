import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ViewportProvider } from '../viewport/ViewportContext'
import { getInitialVariantOption } from './utils/getInitialVariantOption'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import Type from '../ui/Type'
import Container from '../ui/Container'
import ResponsiveImage from '../ui/ResponsiveImage'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import CustomModal from '../ui/CustomModal'

const styles = StyleSheet.create({
  variant: {
    width: 36,
    height: 36
  },
  dropVariantStyle: {
    width: 21,
    height: 21
  },
  variantContainer: {
    overflow: 'hidden',
    width: 36,
    height: 36
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.borderColor,
    paddingRight: 10
  },
  downArrow: {
    position: 'absolute',
    right: 15
  },
  dropdownContent: {
    backgroundColor: theme.white
  }
})

const DropdownMenu = ({ variant, onModalVisible }) => (
  <Container rows style={styles.dropdown} ph={1.5} pv={1.0} align onPress={onModalVisible}>
    {variant ? (
      <>
        <Container style={styles.dropVariantStyle} mr={1.5}>
          <ResponsiveImage
            width={21}
            height={21}
            src={variant.image_url}
            styles={{
              image: { resizeMode: 'center' }
            }}
            useAspectRatio
          />
        </Container>
        <Type size={15} color={theme.lightBlack} numberOfLines={1} pr={7}>
          {variant.color}
          {variant.isSalable === 0 && <Type size={10}> (Out of stock)</Type>}
        </Type>
        <Container style={styles.downArrow}>
          <AdoreSvgIcon name="AngleDown" width={16} height={22} />
        </Container>
      </>
    ) : (
      <>
        <Type size={15} color={theme.lightBlack}>
          Please select
        </Type>
        <Container style={styles.downArrow}>
          <AdoreSvgIcon name="AngleDown" width={18} height={24} />
        </Container>
      </>
    )}
  </Container>
)

const ProductVariant = ({ onVariantPress, variant, item }) => {
  const isActiveOption = variant?.option_id === item.option_id

  return (
    <Container rows align ph={1} pv={1} onPress={() => onVariantPress(item)}>
      <Container style={styles.variant} mr={1.5}>
        <ViewportProvider lazyLoadImage={false}>
          <ResponsiveImage
            width={35}
            height={35}
            displayWidth={35}
            displayHeight={35}
            src={item.image_url}
            useAspectRatio
          />
        </ViewportProvider>
      </Container>
      <Container flex={1}>
        <Type numberOfLines={3} bold={isActiveOption} color={isActiveOption ? theme.black : theme.lighterBlack}>
          {item.color}
          {!item.isSalable && (
            <Type size={12} color={theme.orange}>
              {' '}
              (Out of stock)
            </Type>
          )}
        </Type>
      </Container>
    </Container>
  )
}

type ProductVariantsProps = {
  productData: {} | any
  variant: string | any
}

const ProductVariants = ({ productData, variant }: ProductVariantsProps) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const route: any = useRoute()
  const navigation = useNavigation()
  const variants = productData.attributeOptions

  const handleVariantChange = selectedVariant => navigation.setParams({ productSku: selectedVariant.productSku })

  const handleModalVisible = () => setIsModalVisible(!isModalVisible)

  const handleSelectInitialVariant = () => {
    const initialVariant = getInitialVariantOption({ routeParams: route.params, productData })

    handleVariantChange(initialVariant)
  }

  useScreenFocusEffect(handleSelectInitialVariant, [route?.params?.productSku, productData?.comestri_product_id])

  const handleVariantPress = selectedVariant => {
    setIsModalVisible(false)
    handleVariantChange(selectedVariant)
  }

  const renderItem = useCallback(
    ({ item }) => <ProductVariant item={item} variant={variant} onVariantPress={handleVariantPress} />,
    [variant, route?.params]
  )

  const keyExtractor = useCallback((item, index) => `dropdown-${item?.option_id}-${index}`, [])

  return (
    <Container ph={2} mb={1.25} mt={0.5}>
      <DropdownMenu variant={variant} onModalVisible={handleModalVisible} />
      <CustomModal
        isVisible={isModalVisible}
        onClose={handleModalVisible}
        contentStyle={{ flex: 0 }}
        containerStyle={{ flex: 0 }}
      >
        <Container style={styles.dropdownContent}>
          <FlatList
            data={variants}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingTop: 50, paddingBottom: 20, paddingHorizontal: 10 }}
            scrollIndicatorInsets={{ right: -3 }}
            initialNumToRender={20}
          />
        </Container>
      </CustomModal>
    </Container>
  )
}

export default ProductVariants
