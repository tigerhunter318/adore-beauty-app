import React, { useState } from 'react'
import { ScrollView, TextInput, Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import { formatPagePath } from '../../utils/format'
import Container from '../ui/Container'
import Type from '../ui/Type'
import CustomModal from '../ui/CustomModal'
import theme from '../../constants/theme'
import CustomButton from '../ui/CustomButton'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Loading from '../ui/Loading'
import { useSafeInsets } from '../../utils/dimensions'

const TestInput = ({ onChange, onPress, customUrl }) => (
  <Container ph={2} pb={1}>
    <Container justify center>
      <Type bold size={16} pb={2}>
        URL
      </Type>
      <Type pv={1} color={customUrl ? theme.lightBlack : theme.textGrey}>
        base url: https://www.adorebeauty.com.au/
      </Type>
      <TextInput
        style={{
          height: 40,
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 16,
          borderBottomColor: theme.textGreyDark,
          borderBottomWidth: 0.5,
          borderRadius: 1,
          width: '100%'
        }}
        autoCapitalize="none"
        onBlur={Keyboard.dismiss}
        placeholder="e.g. shipping.html"
        onChangeText={onChange}
        onSubmitEditing={() => onPress({ url: customUrl })}
      />
    </Container>
    <CustomButton
      semiBold
      fontSize={14}
      background={theme.black}
      borderColor={theme.white}
      color={theme.white}
      borderWidth={1}
      disabled={!customUrl}
      onPress={() => onPress({ url: customUrl })}
    >
      TEST
    </CustomButton>
  </Container>
)

const TestIdentifier = ({ onPress, identifier, onChange }) => (
  <Container ph={2} pt={4}>
    <Container justify center>
      <Type bold size={16} pb={2}>
        IDENTIFIER
      </Type>
      <TextInput
        style={{
          height: 40,
          textAlign: 'center',
          marginBottom: 20,
          fontSize: 16,
          borderBottomColor: theme.textGreyDark,
          borderBottomWidth: 0.5,
          borderRadius: 1,
          width: '100%'
        }}
        autoCapitalize="none"
        onBlur={Keyboard.dismiss}
        placeholder="e.g. shipping"
        onChangeText={onChange}
        onSubmitEditing={() => onPress({ screen: 'CMS', identifier })}
      />
    </Container>
    <CustomButton
      semiBold
      fontSize={14}
      background={theme.black}
      borderColor={theme.white}
      color={theme.white}
      borderWidth={1}
      disabled={!identifier}
      onPress={() => onPress({ screen: 'CMS', identifier })}
    >
      TEST
    </CustomButton>
  </Container>
)

const MenuButton = ({ onPress, isMenuVisible }) => (
  <Container center ph={2} pt={isMenuVisible ? 0 : 5}>
    <Container
      center
      justify="flex-end"
      style={{
        width: '100%'
      }}
    >
      <Type bold size={16} pb={3}>
        SAMPLES
      </Type>
      <Container
        style={{
          position: 'relative',
          borderBottomColor: theme.textGreyDark,
          borderBottomWidth: 0.5,
          borderRadius: 1,
          width: '100%'
        }}
        onPress={onPress}
      >
        <Type center semiBold={isMenuVisible} justify pb={1} color={isMenuVisible ? theme.lightBlack : theme.textGrey}>
          URLS
        </Type>
        <AdoreSvgIcon
          style={{ position: 'absolute', right: 0 }}
          name={isMenuVisible ? 'angle-up' : 'angle-down'}
          color={theme.black}
          width={18}
          height={16}
        />
      </Container>
    </Container>
  </Container>
)

const DropDownMenu = ({ onPress }) => (
  <Container background="rgb(251, 251, 251)" ml={1.8} mr={1.8}>
    {CMSTestUrls.map((url, index) => (
      <Container
        key={`dropdown-${index}`}
        style={{ borderBottomWidth: 0.5, borderBottomColor: theme.textGreyDark }}
        onPress={() => onPress({ url })}
        center
        pv={2}
      >
        <Type size={14}>{formatPagePath(url)}</Type>
      </Container>
    ))}
  </Container>
)

const CMSTestUrls = [
  'https://www.adorebeauty.com.au/giftcertificates.php',
  'https://www.adorebeauty.com.au/results?q=sex',
  'https://www.adorebeauty.com.au/skin-care.html',
  'https://www.adorebeauty.com.au/results?q=estee%20lauder',
  'https://www.adorebeauty.com.au/about.html',
  'https://www.adorebeauty.com.au/shipping.html',
  'https://www.adorebeauty.com.au/contact-details.html',
  'https://www.adorebeauty.com.au/diversity-and-inclusion.html',
  'https://www.adorebeauty.com.au/click-frenzy-sale.html',
  'https://www.adorebeauty.com.au/afterpay-day-sale.html',
  'https://www.adorebeauty.com.au/adore-beauty-besties.html',
  'https://www.adorebeauty.com.au/fragrance-week-2021.html',
  'https://www.adorebeauty.com.au/natural-skincare-sale.html',
  'https://www.adorebeauty.com.au//hair-care-sale-2021.html',
  'https://www.adorebeauty.com.au/australian-beauty.html',
  'https://www.adorebeauty.com.au/best-mothers-day-gifts.html',
  'https://www.adorebeauty.com.au/skincare-school-lab-muffin.html',
  'https://www.adorebeauty.com.au/klarna.html',
  'https://www.adorebeauty.com.au/unidays.html',
  'https://www.adorebeauty.com.au/zip.html',
  'https://support.adorebeauty.com.au/hc/en-us/articles/115006480587-Twilight-Delivery'
]

const initialState = {
  isModalVisible: false,
  isMenuVisible: false,
  isLoading: false,
  customUrl: '',
  customIdentifier: ''
}

export const UrlNavigationTestButton = ({ url = 'skin-care.html' }) => {
  const urlNavigation = useUrlNavigation()
  return (
    <Container justify="center" align="center" pv={1.5}>
      <CustomButton onPress={() => urlNavigation.push(url)} label={url} />
    </Container>
  )
}

const UrlNavigationTest = ({ buttonStyle }) => {
  const [state, setState] = useState(initialState)
  const urlNavigation = useUrlNavigation()
  const navigation = useNavigation()
  const { top } = useSafeInsets()

  const resetState = () => setState({ ...initialState })
  const updateState = (newState = {}) => setState(prevState => ({ ...prevState, ...newState }))

  const handleMenu = () => updateState({ isMenuVisible: !state.isMenuVisible })
  const handleCustomUrl = content => updateState({ customUrl: content })
  const handleIdentifier = content => updateState({ customIdentifier: content })

  const handleRedirect = async ({ url, identifier, screen }) => {
    updateState({ isLoading: true })
    if (url) {
      await urlNavigation.push(url)
    }
    if (identifier) {
      await navigation.navigate(screen, { identifier })
    }
    resetState()
  }

  const handleModal = () => {
    if (state.isModalVisible) {
      resetState()
    }
    updateState({ isModalVisible: !state.isModalVisible })
  }

  return (
    <Container>
      <CustomButton onPress={handleModal} {...buttonStyle}>
        URL
      </CustomButton>
      <CustomModal
        isVisible={state.isModalVisible}
        style={{ margin: 0, paddingTop: top + 40, paddingBottom: 0 }}
        containerStyle={{ borderRadius: 30 }}
        closeButtonPosition={{ right: 0, top: 10 }}
        onClose={handleModal}
      >
        <ScrollView>
          {state.isLoading ? (
            <Loading lipstick screen />
          ) : (
            <Container pt={3}>
              <Type heading size={20} center bold pb={6}>
                tests
              </Type>
              {!state.isMenuVisible && (
                <TestInput onChange={handleCustomUrl} onPress={handleRedirect} customUrl={state.customUrl} />
              )}
              {!state.isMenuVisible && (
                <TestIdentifier
                  identifier={state.customIdentifier}
                  onPress={handleRedirect}
                  onChange={handleIdentifier}
                  isMenuVisible={state.isMenuVisible}
                />
              )}
              <MenuButton onPress={handleMenu} isMenuVisible={state.isMenuVisible} />
              {state.isMenuVisible && <DropDownMenu onPress={handleRedirect} />}
            </Container>
          )}
        </ScrollView>
      </CustomModal>
    </Container>
  )
}

export default UrlNavigationTest
