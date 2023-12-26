import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { isLuxuryBrandProduct, isValidArray } from '../../utils/validation'
import { getPromotionsData } from '../promotions/utils/helpers'
import { promoQueryTimeStamp } from '../../gql/hasura/utils/timestamp'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import ShopPromoItems from '../shop/ShopPromoItems'
import BrandPromotionsQuery from '../../gql/hasura/promotions/BrandPromotionsQuery'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: theme.borderColor
  },
  tabContainer: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor
  },
  activeTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    shadowOpacity: 0
  },
  shadow: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4
  },
  title: {
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 1
  },
  arrowForward: {
    marginLeft: 10
  },
  expandedTab: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor
  }
})

type ProductTabProps = {
  name: string
  meta?: any
  onTabItem: (item: any) => void
  isExpanded?: boolean
  id?: string
  productPromotions: [] | any
  productData: {} | any
}

const ProductPromotionsTab = ({ onTabItem, name, productPromotions, productData, ...rest }: ProductTabProps) => (
  <Container style={styles.expandedTab}>
    <Container
      rows
      style={[styles.tabContainer, styles.activeTabContainer]}
      justify="space-between"
      onPress={onTabItem}
    >
      <Type size={12} semiBold style={styles.title}>
        {name}
      </Type>
      <Container rows>
        <Container rows align pr={0.3}>
          <AdoreSvgIcon name="angle-down" width={13} height={16} />
        </Container>
      </Container>
    </Container>
    <Container pt={2} pb={2}>
      <ShopPromoItems
        hasTitle={false}
        items={getPromotionsData(productPromotions)}
        productData={productData}
        testID="ProductTabs.ShopPromoItems"
      />
    </Container>
  </Container>
)

const ProductTab = ({ name, meta, onTabItem, isExpanded, id, productPromotions, productData }: ProductTabProps) => {
  if (id === 'promotions' && isExpanded) {
    return (
      <ProductPromotionsTab
        name={name}
        onTabItem={onTabItem}
        productData={productData}
        productPromotions={productPromotions}
      />
    )
  }
  return (
    <Container onPress={onTabItem}>
      <Container rows style={[styles.tabContainer]} justify="space-between">
        <Type size={12} semiBold style={styles.title}>
          {name}
        </Type>
        <Container rows>
          {!!meta && (
            <Type size={13} pt={0.1} semiBold color={theme.orange}>
              ({meta})
            </Type>
          )}
          <Container rows align>
            <AdoreSvgIcon name="ArrowRight" width={16} height={13} />
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

type ProductTabsProps = {
  productData: {} | any
  onItemPress: (item: any) => void
  hasEnteredViewport: boolean
}

const ProductTabs = ({ productData, onItemPress, hasEnteredViewport }: ProductTabsProps) => {
  const [isExpanded, setExpanded] = useState<boolean>(false)
  const brandIdentifier = productData?.brand_identifier_s

  const { data: promotionsData } = useHasuraQuery(BrandPromotionsQuery, {
    variables: {
      where: {
        identifier: { _eq: brandIdentifier }
      },
      display_locations: { _contains: { product_detail_page: true } },
      queryDate: promoQueryTimeStamp()
    },
    skip: !(brandIdentifier && hasEnteredViewport)
  })

  const handleTabPress = (item: any) => {
    if (item.id === 'promotions') {
      setExpanded(prev => !prev)
    } else {
      onItemPress(item)
    }
  }

  const isLuxuryProduct = isLuxuryBrandProduct(productData)
  const hasReviewData = parseFloat(productData?.reviewAverage) > 0
  const productPromotions = promotionsData?.brands

  const tabsData = [
    {
      id: 'productinfo',
      name: 'Product info',
      isVisible: true
    },

    {
      id: 'ingredients',
      name: 'Ingredients',
      isVisible: !!productData.ingredients
    },
    {
      id: 'reviews',
      name: 'Reviews',
      isVisible: hasReviewData,
      meta: productData.reviewTotal || ''
    },
    {
      id: 'promotions',
      name: isLuxuryProduct ? 'Bonus Gift' : 'Promotions',
      isVisible: isValidArray(productPromotions?.[0]?.promotions)
    }
  ]

  return (
    <Container style={[styles.container, styles.shadow]}>
      {tabsData
        .filter(item => item.isVisible)
        .map((item, i) => (
          <ProductTab
            key={i}
            id={item.id}
            name={item.name}
            meta={item.meta}
            productData={productData}
            isExpanded={isExpanded}
            onTabItem={() => handleTabPress(item)}
            productPromotions={productPromotions}
          />
        ))}
    </Container>
  )
}

export default ProductTabs
