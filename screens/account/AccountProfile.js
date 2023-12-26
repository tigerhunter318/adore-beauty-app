import React, { useState, useRef } from 'react'
import { Switch, Alert, Linking, AppState } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import Accordion from 'react-native-collapsible/Accordion'
import dayjs from 'dayjs'
import messaging from '@react-native-firebase/messaging'
import DatePicker from '../../components/ui/DatePicker'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import Hr from '../../components/ui/Hr'
import FieldSet from '../../components/ui/FieldSet'
import theme from '../../constants/theme'
import FormField from '../../components/form/FormField'
import useForm from '../../components/form/useForm'
import Loading from '../../components/ui/Loading'
import AdoreSvgIcon from '../../components/ui/AdoreSvgIcon'
import FormInputPassword from '../../components/form/FormInputPassword'
import CustomPicker from '../../components/ui/CustomPicker/CustomPicker'
import customer from '../../store/modules/customer'
import { useActionState } from '../../store/utils/stateHook'
import { getIn } from '../../utils/getIn'
import { formatDate } from '../../utils/date'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { isValidName } from '../../utils/validation'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import AccountProfileCloseAccount from '../../components/account/AccountProfileCloseAccount'
import CustomButton from '../../components/ui/CustomButton'

const styleSheet = {
  container: {},
  hr: {
    backgroundColor: theme.black,
    height: 0.5,
    marginTop: 18
  },
  fieldSet: {
    borderBottomWidth: 0,
    borderColor: 'transparent'
  },
  inputStyle: {
    container: {
      marginTop: 5
    },
    input: {
      paddingTop: 12,
      paddingBottom: 12
    }
  },
  passwordField: {
    container: {
      marginTop: 5,
      marginRight: 30
    },
    input: {
      paddingTop: 12,
      paddingBottom: 12
    }
  },
  loading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  sectionContainerStyle: {
    borderTopWidth: 2,
    borderTopColor: theme.darkGray,
    paddingTop: 20,
    marginBottom: 20
  },
  accordionContent: {
    borderTopWidth: 0.5,
    borderTopColor: theme.black,
    borderBottomWidth: 0,
    marginTop: 20
  }
}

const AccountProfile = ({ navigation }) => {
  const form = useForm()
  const account = useActionState('customer.account')
  const preferences = useActionState('customer.preferences')
  const isPending = useActionState('customer.request.pending')
  const dispatch = useDispatch()
  const [lastRefresh, setLastRefresh] = useState(Date(Date.now()).toString())
  const [activeSections, setActiveSections] = useState([])
  const [sections, setSections] = useState([])
  const [birthDay, setBirthday] = useState(new Date())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const updateFieldsRef = useRef([])
  const sheetRef = useRef(null)
  const firstName = isValidName(getIn(account, 'first_name')) ? getIn(account, 'first_name') : ''
  const lastName = isValidName(getIn(account, 'last_name')) ? getIn(account, 'last_name') : ''
  const phone = getIn(account, 'default_phone') || ''

  const handleSave = async () => {
    const payload = {
      id: form.getValue('id'),
      default_phone: form.getValue('phone'),
      first_name: form.getValue('firstName'),
      last_name: form.getValue('lastName'),
      full_name: `${form.getValue('firstName')} ${form.getValue('lastName')}`,
      date_of_birth: formatDate(birthDay, 'YYYY-MM-DD'),
      updateCustomerPreferences: true,
      subscribed_to_promotions: form.getValue('subscribed_to_promotions') ? 1 : 0,
      subscribed_to_loyalty: form.getValue('subscribed_to_loyalty') ? 1 : 0,
      subscribed_to_mobile: form.getValue('subscribed_to_mobile') ? 1 : 0,
      subscribed_to_newsletter: form.getValue('subscribed_to_newsletter') ? 1 : 0,
      gender: form.getValue('gender') || undefined
    }

    const currentPassword = form.getValue('currentPassword')
    const password = form.getValue('newPassword')
    const confirmPassword = form.getValue('confirmPassword')
    if (password && confirmPassword && currentPassword) {
      payload.password = password
      payload.password_confirmation = confirmPassword
      payload.current_password = currentPassword
    }

    setHasUnsavedChanges(false)
    if (updateFieldsRef?.current?.length) {
      emarsysEvents.trackCustomEvent('updateProfile', {
        editedFields: updateFieldsRef.current.join(', ')
      })
      updateFieldsRef.current = []
    }
    dispatch(customer.actions.updateCustomer(payload))
  }

  const handleSubscribe = (name, value) => {
    setHasUnsavedChanges(true)

    if (name === 'subscribed_to_newsletter') {
      if (value) {
        form.setValue({
          [name]: !value,
          subscribed_to_promotions: 0,
          subscribed_to_loyalty: 0,
          subscribed_to_mobile: 0
        })
      } else {
        form.setValue({
          [name]: !value
        })
      }
    } else if (value) {
      form.setValue({
        [name]: value,
        subscribed_to_newsletter: 1
      })
    } else {
      form.setValue({
        [name]: value
      })
    }
  }

  const handlePushNotifications = () => {
    Linking.openSettings()
  }

  const handlePreferenceChange = (parentInd, optionInd, value) => {
    updateEditedFields(`My Preferences - ${preferences?.[parentInd]?.name}`)
    setHasUnsavedChanges(true)
    dispatch(customer.actions.storeCustomerPreferences({ parentInd, optionInd, value }))
  }

  const toggleDatePopup = () => {
    sheetRef.current.toggleOpen()
  }

  const handleDateChange = date => {
    updateEditedFields('Date of birth')
    setBirthday(date)
    setHasUnsavedChanges(true)
    form.setValue({
      dateOfBirth: formatDate(date, 'DD  /  MMMM  /  YYYY').toUpperCase()
    })

    sheetRef.current.toggleOpen(false)
  }

  const handleGenderChange = selectedGender => {
    updateEditedFields('Gender')
    setHasUnsavedChanges(true)
    form.setValue({
      gender: selectedGender
    })
  }

  const handleFormChange = fieldName => {
    updateEditedFields(fieldName)
    setHasUnsavedChanges(true)
  }

  const updateEditedFields = fieldName => {
    if (fieldName && !updateFieldsRef?.current?.includes(fieldName)) {
      updateFieldsRef.current.push(fieldName)
    }
  }

  const renderHeader = (section, index, isActive) => (
    <Container rows justify="space-between" align pr={1.1} key={`accordion-header-${index}`}>
      <Type size={16} lineHeight={24} heading bold letterSpacing={0.61} color={theme.lightBlack}>
        {section.title}
      </Type>
      <AdoreSvgIcon name={isActive ? 'angle-up' : 'angle-down'} width={12} height={16} />
    </Container>
  )

  const renderContent = ({ id }) => {
    switch (id) {
      case 'communication':
        return (
          <Container style={styleSheet.accordionContent}>
            <Container pt={1} ph={1.1}>
              <Container rows align pv={1.5} justify="space-between">
                <Type lineHeight={24} letterSpacing={0.11} bold>
                  Email Newsletters & Promotions
                </Type>
                <Switch
                  trackColor={{ false: theme.textGreyDark, true: theme.black }}
                  thumbColor={theme.white}
                  onValueChange={value => handleSubscribe('subscribed_to_promotions', value)}
                  value={form.getValue('subscribed_to_promotions')}
                />
              </Container>
              <Container rows align pv={1.5} justify="space-between">
                <Type lineHeight={24} letterSpacing={0.11} bold>
                  Email Loyalty Communications
                </Type>
                <Switch
                  trackColor={{ false: theme.textGreyDark, true: theme.black }}
                  thumbColor={theme.white}
                  onValueChange={value => handleSubscribe('subscribed_to_loyalty', value)}
                  value={form.getValue('subscribed_to_loyalty')}
                />
              </Container>
              <Container rows align pv={1.5} justify="space-between">
                <Type lineHeight={24} letterSpacing={0.11} bold>
                  SMS
                </Type>
                <Switch
                  trackColor={{ false: theme.textGreyDark, true: theme.black }}
                  thumbColor={theme.white}
                  onValueChange={value => handleSubscribe('subscribed_to_mobile', value)}
                  value={form.getValue('subscribed_to_mobile')}
                />
              </Container>
              <Container rows align pv={1.5} justify="space-between">
                <Type lineHeight={24} letterSpacing={0.11} bold>
                  Unsubscribe to all communications
                </Type>
                <Switch
                  trackColor={{ false: theme.textGreyDark, true: theme.black }}
                  thumbColor={theme.white}
                  onValueChange={value => handleSubscribe('subscribed_to_newsletter', value)}
                  value={!form.getValue('subscribed_to_newsletter')}
                />
              </Container>
              <Type size={12} pv={1} lineHeight={18} color={theme.lightBlack}>
                You will still get Order Confirmations, Order Dispatch and Shipping notifications if you choose not
                {` `}to receive the above communications.
              </Type>
            </Container>
          </Container>
        )
      case 'pushnotifications':
        return (
          <Container style={styleSheet.accordionContent}>
            <Container pt={2} ph={1.1}>
              <Container rows align justify="space-between">
                <Type lineHeight={24} letterSpacing={0.11} bold>
                  Push Notifications
                </Type>
                <Switch
                  trackColor={{ false: theme.textGreyDark, true: theme.black }}
                  thumbColor={theme.white}
                  onValueChange={handlePushNotifications}
                  value={form.getValue('push_notifications')}
                />
              </Container>
            </Container>
          </Container>
        )
      case 'mypreferences':
        return (
          <Container style={styleSheet.accordionContent} pv={1}>
            {preferences &&
              preferences.map((preference, parentInd) => (
                <Container pt={2} ph={1.1}>
                  <Type mb={0.6} bold heading>
                    {preference.name}
                  </Type>
                  {preference?.options.map((option, optionInd) => (
                    <Container rows align center pv={0.6} justify="space-between">
                      <Type>{option.name}</Type>
                      <Switch
                        trackColor={{
                          false: theme.textGreyDark,
                          true: theme.black
                        }}
                        thumbColor={theme.white}
                        onValueChange={value => handlePreferenceChange(parentInd, optionInd, value)}
                        value={option.customer_selected}
                      />
                    </Container>
                  ))}
                </Container>
              ))}
          </Container>
        )
      case 'closeaccount':
        return (
          <Container style={styleSheet.accordionContent} pv={1}>
            <AccountProfileCloseAccount account={account} />
          </Container>
        )
      default:
        return (
          <>
            <Container pb={1.8} />
            <FieldSet style={styleSheet.fieldSet}>
              <FormInputPassword
                fieldType="password"
                label="Current Password"
                name="currentPassword"
                form={form}
                required={false}
                nextName="newPassword"
                inputStyle={styleSheet.passwordField}
                labelProps={{ heading: false }}
                eyeIconStyles={{ top: 35 }}
                lockIconStyles={{ top: 40 }}
              />
            </FieldSet>
            <FieldSet style={styleSheet.fieldSet}>
              <FormInputPassword
                label="New Password"
                name="newPassword"
                form={form}
                nextName="confirmPassword"
                inputStyle={styleSheet.passwordField}
                required={false}
                labelProps={{ heading: false }}
                eyeIconStyles={{ top: 35 }}
                lockIconStyles={{ top: 40 }}
              />
            </FieldSet>
            <FieldSet style={styleSheet.fieldSet}>
              <FormInputPassword
                label="Confirm Password"
                name="confirmPassword"
                form={form}
                inputStyle={styleSheet.passwordField}
                required={false}
                labelProps={{ heading: false }}
                eyeIconStyles={{ top: 35 }}
                lockIconStyles={{ top: 40 }}
              />
            </FieldSet>
          </>
        )
    }
  }

  const updateSections = activeSecs => {
    setActiveSections(activeSecs)
  }

  const onMount = () => {
    if (account) {
      const dateFormat = 'DD-MM-YYYY'
      form.setValue({
        id: getIn(account, 'id'),
        firstName,
        lastName,
        phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        dateOfBirth: getIn(account, 'date_of_birth')
          ? formatDate(dayjs(getIn(account, 'date_of_birth'), dateFormat), 'DD  /  MMMM  /  YYYY')
          : null,
        subscribed_to_promotions: !!getIn(account, 'subscribed_to_promotions'),
        subscribed_to_loyalty: !!getIn(account, 'subscribed_to_loyalty'),
        subscribed_to_mobile: !!getIn(account, 'subscribed_to_mobile'),
        subscribed_to_newsletter: !!getIn(account, 'subscribed_to_newsletter'),
        gender: account?.gender || null
      })

      if (getIn(account, 'date_of_birth')) {
        setBirthday(new Date(dayjs(getIn(account, 'date_of_birth'), dateFormat)))
      }

      const isEmailAccount = !account.facebook_id && !account.twitter_id && !account.google_id && !account.apple_id

      const accordionSections = [
        {
          title: 'Communication',
          id: 'communication'
        },
        {
          title: 'Push Notifications',
          id: 'pushnotifications'
        },
        {
          title: 'My Preferences',
          id: 'mypreferences'
        },
        isEmailAccount && {
          title: 'Update Password',
          id: 'updatepassword'
        },
        {
          title: 'Close Account',
          id: 'closeaccount'
        }
      ]
      setSections(accordionSections.filter(x => x))
    }
    form.setFocused('')
    setLastRefresh(Date(Date.now()).toString())
  }

  const loadNotificationSettings = () => {
    const checkPermission = async () => {
      const authStatus = await messaging().hasPermission()

      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        form.setValue({
          push_notifications: true
        })
      } else {
        form.setValue({
          push_notifications: false
        })
      }
    }
    checkPermission()
  }

  const handleUnsavedChange = () => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!hasUnsavedChanges) {
        return
      }

      e.preventDefault()

      Alert.alert('You have unsaved changes on this page?', '', [
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action)
        },
        { text: 'Save', onPress: handleSave }
      ])
    })

    return unsubscribe
  }

  const loadCustomerPreferences = () => {
    dispatch(customer.actions.fetchCustomerPreferences())
  }

  useScreenFocusEffect(onMount, [account])
  useScreenFocusEffect(loadCustomerPreferences, [])
  useScreenFocusEffect(loadNotificationSettings, [])
  useScreenFocusEffect(handleUnsavedChange, [navigation, hasUnsavedChanges])
  useScreenFocusEffect(() => {
    AppState.addEventListener('change', loadNotificationSettings)
    return () => {
      AppState.removeEventListener('change', loadNotificationSettings)
    }
  })

  return (
    <Container testID="AccountProfileScreen">
      <KeyboardAwareScrollView extraScrollHeight={60} key={lastRefresh}>
        <Container ph={1.8}>
          <Container pt={3} ph={0.2}>
            <Type heading bold size={16} lineHeight={24} letterSpacing={0.61} color={theme.lightBlack}>
              Account Information
            </Type>
          </Container>
          <Hr style={styleSheet.hr} mb={2.5} />
          <FieldSet style={styleSheet.fieldSet} ph={1.1} pv={0} mb={2.5}>
            <FormField
              fieldType="name"
              label="First name"
              required
              name="firstName"
              form={form}
              nextName="lastName"
              inputStyle={styleSheet.inputStyle}
              labelProps={{ heading: false }}
              onChange={handleFormChange}
              errorMessage={() => 'Enter a valid First Name'}
            />
          </FieldSet>
          <FieldSet style={styleSheet.fieldSet} ph={1.1} pv={0} mb={2.5}>
            <FormField
              fieldType="name"
              label="Surname"
              required
              name="lastName"
              form={form}
              nextName="phone"
              inputStyle={styleSheet.inputStyle}
              labelProps={{ heading: false }}
              onChange={handleFormChange}
              errorMessage={() => 'Enter a valid Last Name'}
            />
          </FieldSet>
          <FieldSet style={styleSheet.fieldSet} ph={1.1} pv={0} mb={2.5}>
            <FormField
              fieldType="phone"
              label="Contact Phone"
              name="phone"
              required
              form={form}
              placeholder="0400 000 000"
              nextName="dateOfBirth"
              inputStyle={styleSheet.inputStyle}
              labelProps={{ heading: false }}
              onChange={() => handleFormChange('Contact Phone')}
            />
          </FieldSet>
          <FieldSet style={styleSheet.fieldSet} ph={1.1} pv={0} mb={2.5} onPress={toggleDatePopup}>
            <FormField
              label="Date of birth"
              name="dateOfBirth"
              required
              form={form}
              placeholder="DATE  /  MONTH  /  YEAR"
              inputStyle={styleSheet.inputStyle}
              labelProps={{ heading: false }}
              editable={false}
              containerProps={{ pointerEvents: 'none' }}
            />
          </FieldSet>
          <FieldSet style={styleSheet.fieldSet} ph={1.1} pv={0} mb={2.5}>
            <Type size={14} mb={1}>
              Gender
            </Type>
            <CustomPicker
              defaultValue={form.getValue('gender')}
              onChange={handleGenderChange}
              title="Select Gender"
              options={[
                { label: 'He/Him', value: 'male' },
                { label: 'She/Her', value: 'female' },
                { label: 'They/Them', value: 'non_binary' }
              ]}
            />
          </FieldSet>
          <Type left ph={1.5} mb={2.5} size={12} color={theme.darkRed} semiBold>
            * Required fields
          </Type>
          <Container borderBottomWidth={2} borderColor={theme.darkGray}>
            <Accordion
              sections={sections}
              activeSections={activeSections}
              renderHeader={renderHeader}
              renderContent={renderContent}
              onChange={updateSections}
              underlayColor={theme.textGrey}
              sectionContainerStyle={styleSheet.sectionContainerStyle}
            />
          </Container>
          <CustomButton
            mt={3}
            mb={3}
            pv={1.5}
            semiBold
            background={theme.black}
            color={theme.white}
            borderColor={theme.black}
            borderWidth={0}
            onPress={handleSave}
            disabled={isPending || !form.isValid()}
          >
            save
          </CustomButton>
        </Container>
      </KeyboardAwareScrollView>
      {isPending && (
        <Container style={styleSheet.loading} justify center>
          <Loading lipstick />
        </Container>
      )}
      <DatePicker date={birthDay} onSave={handleDateChange} mode="date" ref={sheetRef} />
    </Container>
  )
}

export default AccountProfile
