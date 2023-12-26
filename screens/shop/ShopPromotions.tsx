import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { CardStyleInterpolators } from '@react-navigation/stack'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { isValidArray } from '../../utils/validation'
import PromoBanner from '../../components/promotions/PromoBanner'
import PromoCategories from '../../components/promotions/PromoCategories'
import PromoBrands from '../../components/promotions/PromoBrands'
import PromoTermsAndConditions from '../../components/promotions/PromoTermsAndConditions'
import ShopHeader from '../../components/shop/ShopHeader'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import useScrollDirection from '../../hooks/useScrollDirection'
import PromotionQuery from '../../gql/PromotionQuery'
import envConfig from '../../config/envConfig'
import theme from '../../constants/theme'
import settings from '../../constants/settings'
import useScreenQuery from '../../gql/useScreenQuery'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabItemText: {
    fontSize: 13,
    letterSpacing: 1.18,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  borderStyle: {
    borderBottomWidth: 1.5,
    borderColor: theme.black
  },
  innerStyle: {
    paddingVertical: 14
  }
})

const PromoTabitem = ({ name, active, onPress }: { name: string; active: boolean; onPress: () => void }) => {
  const containerStyle: {} | undefined = []
  const textStyle = [styles.tabItemText]

  return (
    <Container flex={1} style={containerStyle} onPress={onPress}>
      <Container style={[styles.innerStyle, active && styles.borderStyle]}>
        <Type
          style={textStyle}
          color={active ? theme.black : theme.tabTextColor}
          semiBold={active}
          numberOfLines={1}
          center
        >
          {name}
        </Type>
      </Container>
    </Container>
  )
}

const PromoTabs = ({
  data,
  activeIndex,
  onPress
}: {
  data: [] | any
  activeIndex: number
  onPress: (index: any) => void
}) => (
  <Container rows ph={2}>
    {isValidArray(data) &&
      data.map((title: any, index: string | number | null | undefined) => (
        <PromoTabitem name={title} key={index} active={activeIndex === index} onPress={() => onPress(index)} />
      ))}
  </Container>
)

const ShopPromotions = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [loadingLinkUrl, setLoadingLinkUrl] = useState<string>('')
  const { handleScroll, direction } = useScrollDirection()
  const urlNavigation = useUrlNavigation()

  const { data, refreshing, initialComponent, refreshControl } = useScreenQuery(PromotionQuery, {
    variables: { locale: envConfig.locale }
  })

  const handleScreenFocused = () => {
    emarsysEvents.trackScreen('Promotions screen', 'https://www.adorebeauty.com.au/promotion.html')
  }

  useScreenFocusEffect(handleScreenFocused)

  if (initialComponent) {
    return initialComponent
  }

  const handleTabPress = (index: React.SetStateAction<number>) => {
    setSelectedTabIndex(index)
  }

  const handlePressCarouselItem = async (item: { url: React.SetStateAction<string> }) => {
    if (item?.url && item?.url !== loadingLinkUrl) {
      setLoadingLinkUrl(item.url)
      await urlNavigation.push(item.url)
      setLoadingLinkUrl('')
    }
  }

  const renderTabContent = (index: number) =>
    index === 0 ? <PromoCategories isScreenRefreshing={refreshing} /> : <PromoBrands isScreenRefreshing={refreshing} />

  const { carousal, banner, promoFooter } = data
  const tabTitles = ['categories', 'brands']

  return (
    <SafeAreaView style={{ flex: 1 }} testID="ShopPromotionsScreen">
      <ScrollView
        style={styles.container}
        scrollEventThrottle={settings.defaultScrollEventThrottle}
        refreshControl={refreshControl}
        onScroll={handleScroll}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Container pt={2}>
          <PromoBanner items={carousal} onPress={handlePressCarouselItem} loadingLinkUrl={loadingLinkUrl} />
        </Container>
        <Container mt={2}>
          <PromoBanner items={banner} onPress={handlePressCarouselItem} loadingLinkUrl={loadingLinkUrl} />
        </Container>
        <Container mt={2} pb={4.3}>
          <PromoTabs data={tabTitles} activeIndex={selectedTabIndex} onPress={handleTabPress} />
          {renderTabContent(selectedTabIndex)}
        </Container>
      </ScrollView>
      {isValidArray(promoFooter) && (
        <PromoTermsAndConditions isHeaderVisible={direction !== 'down'} data={promoFooter} />
      )}
    </SafeAreaView>
  )
}

ShopPromotions.navigationOptions = {
  header: (
    props: JSX.IntrinsicAttributes & {
      navigation: object
      hasBack?: boolean | undefined
      hasSearch?: boolean | undefined
      title?: any
      showTabNav?: boolean | undefined
      showLogo?: boolean | undefined
    }
  ) => <ShopHeader {...props} />,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export default ShopPromotions
