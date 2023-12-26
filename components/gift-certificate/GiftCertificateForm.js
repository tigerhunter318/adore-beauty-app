import React from 'react'
import { StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'
import Type from '../ui/Type'
import Container from '../ui/Container'
import Icon from '../ui/Icon'
import FormField from '../form/FormField'
import theme from '../../constants/theme'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { useActionState } from '../../store/utils/stateHook'
import { getIn } from '../../utils/getIn'
import CustomPicker from '../ui/CustomPicker/CustomPicker'
import { getRemoteConfigJson } from '../../services/useRemoteConfig'
import { isNumberBetween } from '../../utils/validation'

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: 10
  },
  addMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10
  },
  addMessage: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 5
  },
  optionalMessage: {
    textTransform: 'lowercase',
    color: theme.textGreyDark
  },
  characterLimit: {
    fontSize: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
    letterSpacing: 0.5
  },
  theme: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 5,
    marginTop: 30,
    marginBottom: 10
  },
  checkBoxContainter: {
    marginBottom: 10,
    marginTop: 10
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15
  },
  checkBoxText: {
    fontSize: 12,
    paddingLeft: 10,
    color: theme.lightBlack,
    lineHeight: 24
  },
  checkBoxAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 3
  },
  checkBoxAlert: {
    fontSize: 10,
    paddingLeft: 12,
    color: theme.darkRed,
    lineHeight: 24
  }
})

const inputStyles = {
  container: {
    marginTop: 20
  },
  input: {
    paddingTop: 12,
    paddingBottom: 12
  }
}

const GiftCertificateRecipientForm = ({ form }) => (
  <Container>
    <Type bold style={styles.title}>
      Gift card is for ...
    </Type>
    <FormField
      fieldType="name"
      required
      name="recipientsName"
      placeholder={`Recipient's Name`}
      form={form}
      nextName="recipientEmail"
      inputStyle={inputStyles}
      condensed
      errorMessage={() => 'You must enter your name.'}
    />
    <FormField
      fieldType="email"
      required
      name="recipientsEmail"
      placeholder={`Recipient's Email`}
      form={form}
      nextName="giftAmount"
      inputStyle={inputStyles}
      condensed
      errorMessage={() => 'You must enter a valid email.'}
    />
    <FormField
      required
      name="giftAmount"
      placeholder="Gift Amount $"
      form={form}
      nextName="sendersName"
      inputStyle={inputStyles}
      keyboardType="decimal-pad"
      validate={[amount => isNumberBetween(amount, 1, 500)]}
      maskProps={{
        type: 'custom',
        options: {
          mask: '999'
        }
      }}
      condensed
      errorMessage={() => 'You must enter a certificate amount between $1.00 and $500.00'}
    />
  </Container>
)

const GiftCertificateSenderForm = ({ form }) => (
  <Container>
    <Type bold style={styles.title}>
      From ...
    </Type>
    <FormField
      fieldType="name"
      required
      name="sendersName"
      placeholder="Your Name"
      form={form}
      nextName="recipientEmail"
      inputStyle={inputStyles}
      condensed
      errorMessage={() => 'You must enter a valid recipient name.'}
    />
    <FormField
      fieldType="email"
      required
      name="sendersEmail"
      placeholder="Your Email"
      form={form}
      nextName="message"
      inputStyle={inputStyles}
      condensed
      errorMessage={() => 'You must enter a valid recipient email.'}
    />
  </Container>
)

const GiftCertificateFormAddMessage = ({ form }) => {
  const messageLength = form.getValue('message')?.length || 0
  const messageMaxLength = 250

  return (
    <Container>
      <Container style={styles.addMessageContainer}>
        <Icon name="pencil" type="materialcommunityicons" size={18} />
        <Type bold style={styles.addMessage}>
          add a message? <Type style={styles.optionalMessage}>(optional)</Type>
        </Type>
      </Container>
      <Container>
        <FormField
          name="message"
          form={form}
          multiline
          textAlignVertical="top"
          maxLength={messageMaxLength}
          editable
          inputStyle={{ input: { minHeight: 110, paddingBottom: 25 } }}
        />
        <Container>
          {messageLength === 0 ? (
            <Type style={styles.characterLimit} color={theme.textGreyDark}>
              {messageMaxLength} character limit
            </Type>
          ) : (
            <Type
              semiBold
              style={styles.characterLimit}
              color={messageLength >= messageMaxLength - 10 ? theme.darkRed : theme.textGreyDark}
            >
              {messageMaxLength - messageLength} <Type color={theme.textGreyDark}>/ 100</Type>
            </Type>
          )}
        </Container>
      </Container>
    </Container>
  )
}

const GiftCertificateFormCheckBox = ({ form }) => {
  const isNonRefundableChecked = form.getValue('agreeWithNonRefundable')
  const handleNonRefundableCheckBox = () => form.setValue({ agreeWithNonRefundable: !isNonRefundableChecked })
  const isExpireChecked = form.getValue('agreeWithExpire')
  const handleExpireCheckBox = () => form.setValue({ agreeWithExpire: !isExpireChecked })

  return (
    <Container style={styles.checkBoxContainter}>
      <Container style={styles.checkBox}>
        <CheckBox
          onClick={handleNonRefundableCheckBox}
          isChecked={!!isNonRefundableChecked}
          checkedImage={<Icon name="check-box" type="material" size={24} />}
          unCheckedImage={<Icon name="check-box-outline-blank" type="material" size={24} />}
        />
        <Type style={styles.checkBoxText}>I understand that Gift Cards expire after 1095 days.</Type>
      </Container>
      {isNonRefundableChecked === false && (
        <Container style={styles.checkBoxAlertContainer}>
          <Icon name="close" size={18} type="material" color={theme.darkRed} />
          <Type style={styles.checkBoxAlert}>You must agree to these terms.</Type>
        </Container>
      )}
      <Container style={styles.checkBox}>
        <CheckBox
          onClick={handleExpireCheckBox}
          isChecked={!!isExpireChecked}
          checkedImage={<Icon name="check-box" type="material" size={24} />}
          unCheckedImage={<Icon name="check-box-outline-blank" type="material" size={24} />}
        />
        <Type style={styles.checkBoxText}>I agree that Gift Cards are non-refundable.</Type>
      </Container>
      {isExpireChecked === false && (
        <Container style={styles.checkBoxAlertContainer}>
          <Icon name="close" size={18} type="material" color={theme.darkRed} />
          <Type style={styles.checkBoxAlert}>You must agree to these terms.</Type>
        </Container>
      )}
    </Container>
  )
}

const GiftCertificateFormTheme = ({ form }) => {
  const { themes } = getRemoteConfigJson('gift_certificate') || {}
  const options = themes?.map((certificateTheme, index) => ({
    label: certificateTheme,
    value: index + 1
  }))

  if (Object.keys(themes)?.length < 2) return null

  return (
    <Container>
      <Type bold style={styles.theme}>
        Theme
      </Type>
      <CustomPicker
        defaultValue={1}
        onChange={value => form.setValue({ theme: options?.[value - 1]?.label })}
        title="PICK A THEME"
        options={options}
      />
    </Container>
  )
}

const GiftCertificateForm = ({ form, giftCertificateOnCart }) => {
  const account = useActionState('customer.account')
  const sendersName = getIn(account, 'first_name') ?? ''
  const sendersEmail = getIn(account, 'email') ?? ''

  const handleScreenFocus = () => {
    form.setSubmitted(false)

    if (giftCertificateOnCart) {
      const {
        amount,
        message,
        sender: { name: sendersNameOnCart, email: sendersEmailOnCart },
        recipient: { name: recipientsName, email: recipientsEmail }
      } = giftCertificateOnCart

      form.setValue({
        sendersName: sendersNameOnCart,
        sendersEmail: sendersEmailOnCart,
        recipientsName,
        recipientsEmail,
        giftAmount: String(amount),
        message,
        theme: 'General',
        agreeWithNonRefundable: true,
        agreeWithExpire: true
      })
    } else {
      form.setValue({ sendersName, sendersEmail, theme: 'General' })
    }
  }

  useScreenFocusEffect(handleScreenFocus, [])

  return (
    <Container>
      <GiftCertificateRecipientForm form={form} />
      <GiftCertificateSenderForm form={form} />
      <GiftCertificateFormTheme form={form} />
      <GiftCertificateFormAddMessage form={form} />
      <GiftCertificateFormCheckBox form={form} />
    </Container>
  )
}

export default GiftCertificateForm
