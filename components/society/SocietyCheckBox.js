import React, { useState } from 'react'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ScrollView } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { SocietyLogo } from './SocietyAssets'
import { px } from '../../utils/dimensions'
import theme from '../../constants/theme'
import CustomModal from '../ui/CustomModal'
import SocietyTermsAndCoditions from './SocietyTermsAndConditions'
import SocietyPrivacyPolicy from './SocietyPrivacyPolicy'
import SocietyCollectionNotice from './SocietyCollectionNotice'

const styles = {
  modal: {
    flex: 1,
    margin: 0,
    marginTop: 30
  },
  modalContainer: {
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 8
  },
  scrollViewContainer: {
    paddingLeft: 5,
    paddingRight: 5
  }
}

const SocietyCheckBox = ({
  showLogo = false,
  showYes = false,
  form,
  navigation,
  containerStyle,
  marginBottom = 3,
  onPress = () => {}
}) => {
  const [isModalVisible, setModalVisibility] = useState(false)
  const [modalScreen, setModalScreen] = useState(null)
  const hasState = !!form?.formState
  const isChecked = !!form?.getValue('join_loyalty') || false

  const handleClick = () => {
    if (hasState) {
      form.setValue({ join_loyalty: !isChecked ? 1 : 0 })
    }
  }

  const handleNavigation = screen => {
    if (screen === 'InfoPage') {
      onPress()
      setTimeout(() => navigation.push('AdoreSocietyModalScreen'), 50)
    } else {
      setModalVisibility(true)
      setModalScreen(screen)
    }
  }

  const handleCloseModal = () => setModalVisibility(false)

  return (
    <Container style={[{ alignItems: 'flex-start' }, containerStyle]} rows mb={marginBottom}>
      <Container rows align pt={showLogo ? 0.5 : 0} mt={0.5} mb={0.5}>
        <CheckBox
          onClick={handleClick}
          isChecked={!!isChecked}
          checkedImage={<Icon name="check-box" size={24} color={theme.black} />}
          unCheckedImage={<Icon name="check-box-outline-blank" size={24} color={theme.borderColor} />}
        />
      </Container>
      <Container pt={showLogo ? 0 : 0.3} flex={1}>
        {/* //TODO check logo width */}
        {!!showLogo && <SocietyLogo width={px(163)} height={43} />}
        <Type lineHeight={20} size={13} pl={1.5}>
          {showYes && <Type bold>YES! </Type>} I want to join{' '}
          <Type underline onPress={() => handleNavigation('InfoPage')}>
            Adore Society
          </Type>{' '}
          and agree to receiving marketing communications and to the Adore Society{' '}
          <Type underline onPress={() => handleNavigation('TermsAndConditions')}>
            terms and conditions,
          </Type>{' '}
          <Type underline onPress={() => handleNavigation('CollectionNotice')}>
            collection notice
          </Type>{' '}
          and{' '}
          <Type underline onPress={() => handleNavigation('SocietyPrivacyPolicy')}>
            privacy policy.
          </Type>
        </Type>
      </Container>
      <CustomModal
        isVisible={isModalVisible}
        style={styles.modal}
        containerStyle={styles.modalContainer}
        onClose={handleCloseModal}
        useNativeDriver
      >
        <ScrollView style={styles.scrollViewContainer}>
          {isModalVisible && modalScreen === 'TermsAndConditions' && <SocietyTermsAndCoditions />}
          {isModalVisible && modalScreen === 'SocietyPrivacyPolicy' && <SocietyPrivacyPolicy />}
          {isModalVisible && modalScreen === 'CollectionNotice' && <SocietyCollectionNotice />}
        </ScrollView>
      </CustomModal>
    </Container>
  )
}

export default SocietyCheckBox
