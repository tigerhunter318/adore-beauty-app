import React, { useRef } from 'react'
import Container from '../ui/Container'
import FieldSet from '../ui/FieldSet'
import FormField from '../form/FormField'

const formStyles = {
  ml: 1.5,
  mr: 1.5,
  borderBottomWidth: 0,
  borderColor: 'transparent'
}

const styleSheet = {
  inputStyle: {
    container: {
      marginTop: 5
    },
    input: {
      paddingTop: 12,
      paddingBottom: 12
    }
  }
}

const AccountAddressForm = ({ form, containerStyle }) => {
  const phoneInputRef = useRef(null)

  return (
    <Container style={containerStyle}>
      <FieldSet {...formStyles}>
        <FormField
          label="First Name"
          required
          fieldType="name"
          name="firstName"
          form={form}
          nextName="lastName"
          inputStyle={styleSheet.inputStyle}
          labelProps={{ heading: false }}
          condensed
          errorMessage={() => 'Enter a valid First Name so we can ensure correct delivery of your package'}
        />
      </FieldSet>
      <FieldSet {...formStyles}>
        <FormField
          label="Last Name"
          required
          fieldType="name"
          name="lastName"
          form={form}
          nextName="phone"
          inputStyle={styleSheet.inputStyle}
          labelProps={{ heading: false }}
          condensed
          errorMessage={() => 'Enter a valid Last Name so we can ensure correct delivery of your package'}
        />
      </FieldSet>
      <FieldSet {...formStyles}>
        <FormField
          label="Contact Phone"
          name="phone"
          fieldType="phone"
          required
          form={form}
          inputRef={phoneInputRef}
          placeholder="0400 000 000"
          inputStyle={styleSheet.inputStyle}
          labelProps={{ heading: false }}
          condensed
        />
      </FieldSet>
    </Container>
  )
}

export default AccountAddressForm
