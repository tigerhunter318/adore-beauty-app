import React from 'react'
import { StyleSheet, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { isIos, isSmallDevice } from '../../utils/device'
import { vw, px } from '../../utils/dimensions'
import Container from '../ui/Container'
import ScreenViewModal from '../ui/ScreenViewModal'
import Type from '../ui/Type'
import CustomButton from '../ui/CustomButton'
import ResponsiveImage from '../ui/ResponsiveImage'
import CustomCarousel from '../ui/CustomCarousel'
import RichTextContent from '../RichText/RichTextContent'
import theme from '../../constants/theme'
import Clipboard from '../../services/clipboard'
import Toast from '../../services/toast'
import ImageSize from '../../constants/ImageSize'

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

type PromoQuickViewCarouselItemProps = {
  data: { index: number; item: {} | any }
  hasMultipleOffers: boolean
}

const PromoQuickViewCarouselItem = ({ data: { index, item }, hasMultipleOffers }: PromoQuickViewCarouselItemProps) => {
  const productImage = item?.productImage
  const brandLogo = item?.brand_logo
  const productDescription = item?.description
  const offerDescription = item?.name?.replace(/[*.:]+/g, '')
  const { width, height } = ImageSize.product.medium
  const navigation = useNavigation()
  const handleRedirectSuccess = () => navigation.goBack()

  return (
    <Container key={index} center ph={1} pb={3}>
      {productImage && (
        <Container width={vw(70)}>
          <ResponsiveImage src={productImage} width={width} height={height} useAspectRatio />
        </Container>
      )}
      {brandLogo && <Image style={{ resizeMode: 'contain', width: vw(35), height: 100 }} source={{ uri: brandLogo }} />}
      {hasMultipleOffers ? (
        <RichTextContent center content={productDescription} onRedirectSuccess={handleRedirectSuccess} />
      ) : (
        <Type size={16} semiBold letterSpacing={0.5} lineHeight={25} center pt={1} pb={1}>
          {offerDescription}
        </Type>
      )}
    </Container>
  )
}

type PromoQuickViewButtonProps = {
  navigation: any
  code: string
  hasCode: boolean
}

const PromoQuickViewButton = ({ navigation, code, hasCode }: PromoQuickViewButtonProps) => {
  const buttonTitle = hasCode ? 'COPY CODE & SHOP NOW' : 'SHOP NOW'

  const handlePress = () => {
    if (hasCode) {
      Toast.show('Code copied', {
        duration: 1500,
        onShow: () => {
          Clipboard.copyToClipboard(code)
        }
      })
    }
    navigation.goBack()
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
        {buttonTitle}
      </CustomButton>
    </Container>
  )
}

const PromoOfferDescription = ({ description }: { description: string }) => {
  const required = /(No|code)(.*)(required)/gi
  const text = description
    .split('. ')
    .filter(line => !required.test(line))
    .join('. ')
    .replace(/<span/, '<p')
    .replace(/<\/span>$/, '</p>')
    .replace(/line-height[ ]?:[ ]??([0-9]*[.])?[0-9]+;/g, 'line-height:0;')
    .replace(/<a[^>]*>|<\/a>/g, ' ')

  return <RichTextContent content={text} htmlStyleSheet={promoDescStyle} />
}

type PromoQuickViewProps = {
  item: {} | any
  title: string
  description: string
  productType: string
}

const PromoQuickView = ({ item, title, description, productType }: PromoQuickViewProps) => {
  const hasMultipleOffers = item?.gift_items?.length > 1
  const hasAutoAdd = !!item?.auto_add
  const code = item?.coupon_code
  const hasCode = !hasAutoAdd && code
  const navigation = useNavigation()
  const handleClose = () => navigation.goBack()

  const handleRenderItem = (data: { index: number; item: {} | any }) => (
    <PromoQuickViewCarouselItem data={data} hasMultipleOffers={hasMultipleOffers} />
  )

  return (
    <ScreenViewModal
      onClose={handleClose}
      containerStyle={styles.modalContainer}
      footerComponent={
        productType !== 'gift' && (
          <Container style={isIos() ? [styles.footerContainer, shadowStyle] : styles.footerContainer}>
            <PromoQuickViewButton navigation={navigation} hasCode={hasCode} code={code} />
          </Container>
        )
      }
      edges={['right', 'bottom', 'left', 'top']}
    >
      <ScrollView>
        <Container center ph={3} mb={5} style={styles.container}>
          <Type heading mt={6} size={22} letterSpacing={1.5} lineHeight={30} bold center pb={3}>
            {title}
          </Type>
          {hasCode && (
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
            items={item?.gift_items || []}
            renderItem={handleRenderItem}
          />
          <PromoOfferDescription description={description} />
        </Container>
      </ScrollView>
    </ScreenViewModal>
  )
}

export default PromoQuickView
