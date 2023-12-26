import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import CustomModal from '../ui/CustomModal'
import Type from '../ui/Type'
import useForm from '../form/useForm'
import FormField from '../form/FormField'
import Container from '../ui/Container'
import FieldSet from '../ui/FieldSet'
import FormCheckBox from '../form/FormCheckBox'
import FormRadio from '../form/FormRadio'
import CustomButton from '../ui/CustomButton'
import Hr from '../ui/Hr'
import theme from '../../constants/theme'
import { isSmallDevice } from '../../utils/device'

const WishlistNameItem = ({ item, form, name, onChange }) => (
  <Container mb={1}>
    <FormRadio form={form} id={item.id} name={name} onChange={onChange}>
      <Container ml={0.5} rows center>
        <Type bold>{item.name}</Type>
        {item.is_public && (
          <Container background={theme.textGrey} pv={0.25} ph={1} borderRadius={5} ml={0.5}>
            <Type bold color="white" size={12}>
              Public
            </Type>
          </Container>
        )}
      </Container>
    </FormRadio>
  </Container>
)

const initialValues = {
  id: null,
  is_public: false,
  name: null
}
const FavouriteWishlistModal = ({ lists = [], editData, isVisible, onSubmit, isPending, onClose }) => {
  const form = useForm(initialValues)
  const formValues = form.getValues()
  const isValid = formValues.id || formValues.name
  const hasMultipleWishlists = lists?.length > 1
  const scrollViewRef = useRef()

  const handleSubmit = evt => {
    if (isValid) {
      onSubmit(form.getValues())
      onClose()
    }
  }

  const handleNameChange = (name, val) => {
    if (val) {
      form.setValue({ id: null })
    }
  }

  const handleIdChange = (name, val) => {
    if (val) {
      form.setValue({ name: null, is_public: null })
    }
  }

  const handleReset = () => {
    form.setValue({ ...initialValues })
    if (isVisible && editData) {
      form.setValue({ ...editData })
    }
  }

  useEffect(handleReset, [isVisible])

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      containerStyle={{
        marginTop: 30,
        marginBottom: isSmallDevice() ? 0 : 30,
        maxHeight: hasMultipleWishlists ? 600 : 280
      }}
    >
      <ScrollView ref={scrollViewRef}>
        <Type center size={18} mt={2.8} mb={2} pr={isSmallDevice() ? 1 : 0} heading>
          {editData ? 'Edit' : 'Create'} Wishlist
        </Type>
        <FieldSet mb={2}>
          <FormField
            name="name"
            fieldType="name"
            form={form}
            placeholder="Name of wishlist"
            onSubmitEditing={handleSubmit}
            onChange={handleNameChange}
          />
          <Container pt={1} mb={1}>
            <FormCheckBox form={form} name="is_public" label="Public List" onChange={handleNameChange} />
            <Type size={12} pl={3}>
              Wishlist will be visible to everyone
            </Type>
          </Container>
        </FieldSet>

        {hasMultipleWishlists && (
          <Container mb={2}>
            <Type center size={20} bold heading mb={1}>
              OR
            </Type>
            <Hr />
            <Type center heading mb={2} size={18}>
              Add to Wishlist
            </Type>
            <FieldSet>
              {lists.map(item => (
                <WishlistNameItem
                  form={form}
                  onChange={handleIdChange}
                  name="id"
                  item={item}
                  key={`${item.name}-${item.id}`}
                />
              ))}
            </FieldSet>
          </Container>
        )}
        <Container mb={2} center>
          <CustomButton
            bold
            fontSize={16}
            pv={1}
            loading={isPending}
            width={150}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            {editData ? 'Update' : 'Save'}
          </CustomButton>
        </Container>
      </ScrollView>
    </CustomModal>
  )
}

export default FavouriteWishlistModal
