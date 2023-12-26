import React, { useState } from 'react'
import SocietyJoinNowButton from './SocietyJoinNowButton'
import CustomButton from '../ui/CustomButton'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import SocietyJoinModal from './SocietyJoinModal'
import SocietyBenefits from './SocietyBenefits'

const styles = {
  joinNowBtn: {
    borderWidth: 1,
    borderColor: theme.black
  }
}

const SocietyBottomSheetContent = ({ navigation, isLoggedIn }) => {
  const [isModalVisible, setModalVisibility] = useState(false)
  const handleCloseModal = () => setModalVisibility(false)

  const handleJoinNow = () => {
    if (isLoggedIn) {
      setModalVisibility(true)
    } else {
      setTimeout(() => navigation.push('Login', { goBack: true }), 300)
    }
  }

  const handleLearnMore = () => {
    navigation.navigate('AdoreSocietyModalScreen')
  }

  return (
    <Container pb={3}>
      <SocietyBenefits containerStyle={{ paddingTop: 10, paddingBottom: 20 }} />
      <Container rows justify="center" mb={1}>
        <Container mr={1}>
          <CustomButton
            center
            bold
            mt={1}
            mb={0}
            pb={1}
            pt={1}
            fontSize={13}
            lineHeight={24}
            letterSpacing={0.86}
            background={theme.white}
            color={theme.black}
            onPress={handleLearnMore}
            width="100%"
            maxWidth={135}
            alignSelf="center"
          >
            learn more
          </CustomButton>
        </Container>
        <Container>
          <SocietyJoinNowButton
            mt={1}
            pb={1}
            pt={1}
            ph={2.3}
            fontSize={13}
            maxWidth={130}
            onPress={handleJoinNow}
            name="join now"
            style={styles.joinNowBtn}
          />
        </Container>
      </Container>
      <SocietyJoinModal navigation={navigation} isVisible={!!isModalVisible} onClose={handleCloseModal} />
    </Container>
  )
}

export default SocietyBottomSheetContent
