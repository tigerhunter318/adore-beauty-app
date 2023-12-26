import React from 'react'
import { useNavigation } from '@react-navigation/native'
import RichTextContentEmailSignup from './RichTextContentEmailSignup'
import CustomModal from '../ui/CustomModal'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import Type, { DEFAULT_FONT } from '../ui/Type'
import { isValidObject } from '../../utils/validation'
import { fontStyles } from '../../constants/fontStyles'

const styles = {
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
    fontFamily: `${DEFAULT_FONT}-Light`
  }
}

const RichTextEmailSignupModal = ({ isVisible, onClose, data }) => {
  const navigation = useNavigation()

  const handleButtonClick = buttonInfo => {
    onClose()
    if (buttonInfo.url) {
      navigation.navigate('Home')
    }
  }

  if (!isValidObject(data)) return null

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      containerStyle={{ marginTop: 30, marginBottom: 30, backgroundColor: data.backgroundColour }}
      contentStyle={{ marginTop: 30 }}
    >
      <Container style={styles.container}>
        <Container>
          <Type style={fontStyles.h3} center>
            {data.title}
          </Type>
        </Container>
        <Container mt={2}>
          <RichTextContentEmailSignup content={data.content} />
        </Container>
        <Container rows justify mt={1}>
          {data.ctaButtons &&
            data.ctaButtons.map((button, index) => (
              <CustomButton
                key={`key-${index}`}
                background={button.buttonColour}
                fontSize={14}
                onPress={() => handleButtonClick(button)}
              >
                {button.title}
              </CustomButton>
            ))}
        </Container>
        {data.underCtaContent && (
          <Container mt={1}>
            <RichTextContentEmailSignup centerDescription content={data.underCtaContent} />
          </Container>
        )}
      </Container>
    </CustomModal>
  )
}

export default RichTextEmailSignupModal
