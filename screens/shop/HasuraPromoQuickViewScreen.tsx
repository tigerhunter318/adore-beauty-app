import React from 'react'
import { StyleSheet, ScrollView, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core'
import { formatPromotionData, formatPromotionDescription } from '../../components/promotions/utils/helpers'
import { isIos, isSmallDevice } from '../../utils/device'
import { getIn } from '../../utils/getIn'
import { vw, px } from '../../utils/dimensions'
import Container from '../../components/ui/Container'
import ScreenViewModal from '../../components/ui/ScreenViewModal'
import Type from '../../components/ui/Type'
import CustomButton from '../../components/ui/CustomButton'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import CustomCarousel from '../../components/ui/CustomCarousel'
import RichTextContent from '../../components/RichText/RichTextContent'
import theme from '../../constants/theme'
import Clipboard from '../../services/clipboard'
import Toast from '../../services/toast'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'

const styles = StyleSheet.create({
  PromoOfferText: {
    marginTop: 0,
    marginBottom: 0
  },
  modalContainer: {
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice() ? 30 : 0
  },
  container: {
    paddingTop: 0
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    paddingBottom: 0,
    backgroundColor: theme.white,
    justifyContent: 'space-around'
  },
  button: {
    width: vw(50),
    borderRadius: 2
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    paddingBottom: isIos() ? 25 : 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopColor: theme.borderColor,
    borderTopWidth: 1
  }
})
const shadowStyle = {
  shadowOffset: { width: 0, height: 2 },
  shadowColor: theme.borderColorDark,
  shadowOpacity: 1,
  shadowRadius: 10,
  borderTopColor: theme.borderColor,
  borderTopWidth: 1
}

const promoDescStyle = StyleSheet.create({
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.lightBlack,
    letterSpacing: 0.1,
    paddingHorizontal: 20,
    marginBottom: 0,
    marginTop: 0
  }
})

const PromoQuickViewCarouselItem = ({ item, hasMultipleOffers }: { item: {}; hasMultipleOffers: boolean }) => {
  const name = getIn(item, 'name')
  const description = formatPromotionDescription(getIn(item, 'description'))
  const brandLogo = getIn(item, 'brands.0.brand.image_link')
  const image = getIn(item, 'images.0.image.url_relative')
  const offerDescription = name.replace(/[*.:]+/g, '')

  return (
    <Container center ph={1} pb={3}>
      {!!image && (
        <Container width={vw(70)}>
          <ResponsiveImage src={image} width={150} height={150} useAspectRatio />
        </Container>
      )}
      {!!brandLogo && (
        <Image style={{ resizeMode: 'contain', width: vw(35), height: 100 }} source={{ uri: brandLogo }} />
      )}
      <Type size={16} semiBold letterSpacing={0.5} lineHeight={25} center pt={1}>
        {hasMultipleOffers ? description : offerDescription}
      </Type>
    </Container>
  )
}

const PromoQuickViewButton = ({
  redeemUrl,
  code,
  hasCouponCode,
  navigation
}: {
  redeemUrl: string
  code: string
  hasCouponCode: boolean
  navigation: any
}) => {
  const label = hasCouponCode ? 'COPY CODE & SHOP NOW' : 'SHOP NOW'
  const urlNavigation = useUrlNavigation()
  const route = useRoute()
  // @ts-ignore
  const { parentScreenPath } = route?.params || {}

  const handlePress = () => {
    if (hasCouponCode) {
      Toast.show('Code copied', {
        duration: 1500,
        onShow: () => {
          Clipboard.copyToClipboard(code)
        }
      })
    }
    navigation.goBack() // close modal
    const options = { fromScreenPath: '' }
    // go back to screen that loaded ShopPromoItems
    if (parentScreenPath) {
      options.fromScreenPath = parentScreenPath
    }
    urlNavigation.push(redeemUrl, options)
  }

  return (
    <Container rows style={styles.buttonContainer}>
      <CustomButton
        center
        bold
        mt={0.5}
        pb={1.6}
        pt={1.6}
        ph={3}
        width="auto"
        size={16}
        lineHeight={24}
        letterSpacing={1.5}
        color={theme.white}
        background={theme.black}
        onPress={handlePress}
        style={styles.button}
      >
        {label}
      </CustomButton>
    </Container>
  )
}

const HasuraPromoQuickViewScreen = ({ route: { params } }) => {
  const navigation = useNavigation()
  const { code, title, isAddFreeItem, siteMessage, products, redeemUrl } = formatPromotionData(params)
  const hasCouponCode = !isAddFreeItem && code
  const hasMultipleOffers = products?.length > 1

  const handleRenderItem = ({ item }: { item: { id: number } }) => (
    <PromoQuickViewCarouselItem
      key={`PromoQuickViewCarouselItem - ${item.id}`}
      item={item}
      hasMultipleOffers={hasMultipleOffers}
    />
  )

  return (
    <ScreenViewModal
      testID="HasuraPromoQuickView"
      onClose={navigation.goBack}
      containerStyle={styles.modalContainer}
      footerComponent={
        <Container style={isIos() ? [styles.footerContainer, shadowStyle] : styles.footerContainer}>
          <PromoQuickViewButton
            navigation={navigation}
            hasCouponCode={hasCouponCode}
            code={code}
            redeemUrl={redeemUrl}
          />
        </Container>
      }
      edges={['right', 'bottom', 'left', 'top']}
    >
      <ScrollView>
        <Container center ph={3} mb={5} style={styles.container}>
          <Type heading mt={5} size={22} letterSpacing={1.5} lineHeight={30} bold center pb={3}>
            {title}
          </Type>
          {hasCouponCode && (
            <Container center>
              <Type light heading lineHeight={25}>
                code required
              </Type>
              <Type light heading pb={2}>
                use code:{' '}
                <Type heading color={theme.orange}>
                  {code}
                </Type>
              </Type>
            </Container>
          )}
          <CustomCarousel
            sliderWidth={vw(80)}
            containerHeight={px(512)}
            items={products}
            renderItem={handleRenderItem}
          />
          <RichTextContent content={siteMessage} htmlStyleSheet={promoDescStyle} />
        </Container>
      </ScrollView>
    </ScreenViewModal>
  )
}

export default HasuraPromoQuickViewScreen
