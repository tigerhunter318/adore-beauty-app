import React, { useState, useRef, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import Container from '../../components/ui/Container'
import ShopHeader from '../../components/shop/ShopHeader'
import HomeQuery from '../../gql/HomeQuery'
import HomeBrowseRoutines from '../../components/home/HomeBrowseRoutines'
import HomeMarketingBanner from '../../components/home/HomeMarketingBanner'
import { composeModel } from '../../utils/composeModel'
import theme from '../../constants/theme'
import Hr from '../../components/ui/Hr'
import BeautyIqArticles from '../../components/beautyiq/BeautyIqArticles'
import CustomButton from '../../components/ui/CustomButton'
import envConfig from '../../config/envConfig'
import SelectApiEnv from '../../components/debug/SelectApiEnv'
import { filterSalableProducts } from '../../components/product/filterSalableProducts'
import SocietyBottomSheetContent from '../../components/society/SocietyBottomSheetContent'
import CustomBottomSheet from '../../components/ui/CustomBottomSheet'
import SocietyJoinModal from '../../components/society/SocietyJoinModal'
import ShopPromo from '../../components/shop/ShopPromo'
import { useActionState, useIsSocietyMember, useIsLoggedIn } from '../../store/utils/stateHook'
import useScrollDirection from '../../hooks/useScrollDirection'
import SocietyFooterBarTitle from '../../components/society/SocietyFooterBarTitle'
import { isIos } from '../../utils/device'
import customer from '../../store/modules/customer'
import PodcastLatestEpisodesWidget from '../../components/podcasts/PodcastLatestEpisodesWidget'
import settings from '../../constants/settings'
import { getRemoteConfigItem } from '../../services/useRemoteConfig'
import { ViewportProvider } from '../../components/viewport/ViewportContext'
import ViewportAware from '../../components/viewport/ViewportAware'
import { isValidArray } from '../../utils/validation'
import useScreenQuery from '../../gql/useScreenQuery'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import SectionTitle from '../../components/ui/SectionTitle'
import AdoreSvgIcon from '../../components/ui/AdoreSvgIcon'
import ShopNewProducts from '../../components/shop/ShopNewProducts'

const logoSourceDefault = require('../../assets/images/logo.png')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    padding: 0
  },
  headerHighlight: {
    backgroundColor: 'black',
    height: 200
  },
  hr: {
    backgroundColor: theme.splitorColor,
    height: 1,
    marginBottom: 30,
    marginTop: 20
  },
  button: {
    backgroundColor: theme.white,
    borderColor: theme.black,
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15
  }
})

const HomeScreen = ({ navigation }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true)
  const { handleScroll, direction } = useScrollDirection()
  const sheetRef = useRef(null)
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const { navigateScreen } = useScreenRouter()
  // Remote config logo
  const remoteLogoSource = getRemoteConfigItem('home_header_logo')

  const handleRemoteLogoChange = () => {
    navigation.setParams({
      screenHeaderLogoSource: remoteLogoSource || logoSourceDefault
    })
  }

  const isLoggedIn = useIsLoggedIn()
  const isSocietyMember = useIsSocietyMember()
  const showBar = !isSocietyMember || !isLoggedIn
  const shouldShowSocietyJoinModal = useActionState('customer.shouldShowSocietyJoinModal')

  const { data, refreshControl, refreshing, initialComponent } = useScreenQuery(HomeQuery, {
    variables: { locale: envConfig.locale, model: composeModel() }
  })

  useEffect(handleRemoteLogoChange, [navigation, remoteLogoSource])

  if (initialComponent) {
    return (
      <>
        {envConfig.isStagingApp && <SelectApiEnv />}
        {initialComponent}
      </>
    )
  }

  const { beautyiq, routineCategories, marketingBanner } = data

  const handleViewAllBeautyIQClick = async () => {
    navigateScreen('MainTab/BeautyIQ/BeautyIQ/Articles')
  }

  const handleBottomSheet = () => sheetRef?.current?.toggleOpen(false)

  const handleBottomSheetOpenChange = val => setIsBottomSheetOpen(val)

  const handleCloseSocietyModal = () => {
    dispatch(customer.actions.shouldShowSocietyJoinModal(false))
  }

  return (
    <Container style={styles.container} testID="HomeScreen">
      <ViewportProvider lazyLoadImage>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={settings.defaultScrollEventThrottle}
          contentContainerStyle={styles.contentContainer}
          refreshControl={refreshControl}
          testID="HomeScreen.ScrollView"
        >
          <HomeMarketingBanner data={marketingBanner} />
          {envConfig.isStagingApp && <SelectApiEnv />}
          <Container>
            <BeautyIqArticles
              articles={beautyiq}
              header={
                <Container pt={2} rows justify>
                  <SectionTitle text={`Latest `} highlightedText="Beauty " />
                  <AdoreSvgIcon name="iq" color={theme.black} width={30} height={30} />
                </Container>
              }
              footer={
                <Container>
                  <CustomButton semiBold color={theme.black} style={styles.button} onPress={handleViewAllBeautyIQClick}>
                    VIEW ALL BEAUTY IQ
                  </CustomButton>
                </Container>
              }
            />
            <Hr style={styles.hr} />
            <ViewportAware always>
              {({ inViewport }) => (
                <PodcastLatestEpisodesWidget
                  inViewport={inViewport}
                  refreshing={refreshing}
                  buttonStyle={styles.button}
                  testID="HomeScreen.PodcastLatestEpisodesWidget"
                />
              )}
            </ViewportAware>
            <Hr style={styles.hr} />
            {routineCategories && isValidArray(routineCategories) && (
              <HomeBrowseRoutines categories={routineCategories} categoryType="routines" />
            )}
            <Hr style={styles.hr} />
            <ViewportAware>
              {({ hasEnteredViewport }) => (
                <ShopPromo testID="HomeScreen.ShopPromo" skip={!hasEnteredViewport} isScreenRefreshing={refreshing} />
              )}
            </ViewportAware>
            <ViewportAware>
              {({ hasEnteredViewport }) => (
                <ShopNewProducts
                  skip={!hasEnteredViewport}
                  testID="HomeScreen.NewProduts"
                  containerStyle={{ marginTop: 10 }}
                  isScreenRefreshing={refreshing}
                />
              )}
            </ViewportAware>
          </Container>
        </ScrollView>
      </ViewportProvider>
      {showBar && (
        <CustomBottomSheet
          ref={sheetRef}
          title={<SocietyFooterBarTitle isOpen={isBottomSheetOpen} />}
          height={410}
          headerHeight={44}
          headerStyle={{ opacity: 1 }}
          onOpenChange={handleBottomSheetOpenChange}
          isHeaderVisible={direction ? direction !== 'down' : true}
          enabledContentGestureInteraction={!!isIos()}
          hasHeaderClose={false}
          content={
            <SocietyBottomSheetContent
              isSocietyMember={isSocietyMember}
              isLoggedIn={isLoggedIn}
              onPress={handleBottomSheet}
              navigation={navigation}
            />
          }
        />
      )}
      <SocietyJoinModal
        navigation={navigation}
        isVisible={isFocused && shouldShowSocietyJoinModal}
        onClose={handleCloseSocietyModal}
      />
    </Container>
  )
}

HomeScreen.navigationOptions = {
  header: props => <ShopHeader {...props} />
}

export default HomeScreen
