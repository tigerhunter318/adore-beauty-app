import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { SocietyLogoReverse } from './SocietyAssets'
import theme from '../../constants/theme'
import CustomModal from '../ui/CustomModal'
import SocietyJoinNowButton from './SocietyJoinNowButton'
import SocietyCheckBox from './SocietyCheckBox'
import useForm from '../form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import customer from '../../store/modules/customer'
import { alertError } from '../../store/api'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import SocietyBenefits from './SocietyBenefits'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import DatePicker from '../ui/DatePicker'
import FieldSet from '../ui/FieldSet'
import { formatDate } from '../../utils/date'
import FormField from '../form/FormField'
import { px, useSafeInsets } from '../../utils/dimensions'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.black,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    paddingTop: 40,
    marginBottom: 10
  },
  fieldSet: {
    paddingLeft: 39,
    paddingRight: 0,
    paddingVertical: 10,
    borderBottomWidth: 0,
    borderColor: 'transparent'
  }
})

const inputStyle = {
  container: {
    marginTop: 5,
    width: 220,
    borderColor: theme.black
  },
  input: {
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: 'center'
  }
}

const SocietyJoinModal = ({ isVisible, onClose, navigation }) => {
  const [birthDay, setBirthday] = useState(new Date())
  const sheetRef = useRef(null)
  const form = useForm()
  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const accountBirthday = useActionState('customer.account.date_of_birth')
  const customerId = useActionState('customer.account.id')
  const { bottom: safeBottomInset } = useSafeInsets()

  const handleClose = () => {
    onClose()
    form.reset()
    setBirthday(new Date())
  }

  const handleSubmit = async () => {
    try {
      let payload = { joinLoyalty: form.getValue('join_loyalty') }
      const res = await dispatch(customer.actions.updateCustomerLoyality(payload))

      if (form.getValue('dateOfBirth')) {
        payload = { id: customerId, date_of_birth: formatDate(birthDay, 'YYYY-MM-DD') }
        await dispatch(customer.actions.updateCustomer(payload))
      }

      if (res) {
        emarsysEvents.trackJoinAdoreSociety()
        onClose()
      }
    } catch (error) {
      alertError(error)
    }
  }

  const toggleDatePopup = () => {
    sheetRef.current.toggleOpen()
  }

  const handleDateChange = date => {
    setBirthday(date)
    form.setValue({ dateOfBirth: formatDate(date, 'DD  /  MMMM  /  YYYY').toUpperCase() })
    sheetRef.current.toggleOpen(false)
  }

  return (
    <CustomModal
      isVisible={isVisible || false}
      onClose={handleClose}
      isFullScreen
      closeButtonColor={theme.white}
      closeButtonStyle={{ backgroundColor: 'transparent' }}
      closeButtonPosition={{ top: 38 }}
    >
      <ScrollView style={{ backgroundColor: theme.white }}>
        <Container style={styles.container}>
          <SocietyLogoReverse width={px(150)} height={50} />
        </Container>
        <SocietyBenefits icons={['Gift', 'Shipping', 'Star', 'ShareGift']} />
        <Container ph={2} pt={3}>
          <SocietyCheckBox showYes form={form} navigation={navigation} onPress={handleClose} />
          {!accountBirthday && (
            <Container pb={3}>
              <Container rows align>
                <AdoreSvgIcon name="birthday" width={24} height={24} />
                <Type ml={1.5} style={{ flex: 1 }} semiBold>
                  Tell us your birthday so we can send you a reward!
                </Type>
              </Container>
              <FieldSet style={styles.fieldSet} onPress={toggleDatePopup}>
                <FormField
                  name="dateOfBirth"
                  form={form}
                  placeholder="DATE  /  MONTH  /  YEAR"
                  inputStyle={inputStyle}
                  labelProps={{ heading: false }}
                  editable={false}
                  containerProps={{ pointerEvents: 'none' }}
                />
              </FieldSet>
            </Container>
          )}
        </Container>
      </ScrollView>
      <Container style={{ paddingBottom: 20 + safeBottomInset, paddingHorizontal: 20 }}>
        <SocietyJoinNowButton
          maxWidth={null}
          disabled={!form.getValue('join_loyalty')}
          onPress={handleSubmit}
          loading={isPending}
          name="join now & close"
        />
        <Type pt={2} onPress={handleClose} center>
          No thanks!
        </Type>
      </Container>
      <DatePicker date={birthDay} onSave={handleDateChange} mode="date" ref={sheetRef} />
    </CustomModal>
  )
}

export default SocietyJoinModal
