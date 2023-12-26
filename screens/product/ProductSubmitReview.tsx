import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ScrollView, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormField, { Required } from '../../components/form/FormField'
import { useActionState } from '../../store/utils/stateHook'
import { alertError } from '../../store/api'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import Type from '../../components/ui/Type'
import Container from '../../components/ui/Container'
import Stars from '../../components/ui/Stars'
import theme from '../../constants/theme'
import useForm from '../../components/form/useForm'
import CustomButton from '../../components/ui/CustomButton'
import customer from '../../store/modules/customer'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import CustomPicker from '../../components/ui/CustomPicker/CustomPicker'
import CustomModal from '../../components/ui/CustomModal'
import ProductReviewGuidelines from '../../components/product-review/ProductReviewGuidelines'

const styles = StyleSheet.create({
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
    paddingLeft: 20,
    paddingRight: 20
  }
})

const fieldContainerProps = {
  pb: 2,
  mb: 2,
  style: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor
  }
}

const ReviewFormFields = ({ form }: any) => (
  <>
    <Container {...fieldContainerProps}>
      <Type mb={1}>
        Overall Rating <Required />
      </Type>
      <FormField
        required
        name="rating"
        form={form}
        inputComponent={
          <Stars
            size={50}
            stars={form.getValue('rating')}
            onStarPress={(starValue: number) => form.setValue({ rating: starValue })}
          />
        }
      />
    </Container>
    <Container {...fieldContainerProps}>
      <FormField
        required
        name="nick_name"
        form={form}
        nextName="title"
        placeholder="Nickname..."
        label={
          <Container>
            <Type size={14} mb={1}>
              Nickname <Required />
            </Type>
          </Container>
        }
      />
    </Container>
    <Container {...fieldContainerProps}>
      <FormField
        required
        name="title"
        form={form}
        nextName="body"
        placeholder="Natures best friend..."
        label={
          <Container>
            <Type size={14} mb={1}>
              Title of the review <Required />
            </Type>
            <Type size={11} color={theme.lightBlack} mb={1}>
              In a few words, your overall impression with the product
            </Type>
          </Container>
        }
      />
    </Container>
    <Container {...fieldContainerProps}>
      <FormField
        required
        name="body"
        form={form}
        multiline
        numberOfLines={10}
        textAlignVertical="top"
        editable
        inputStyle={{ input: { minHeight: 80 } }}
        label={
          <Container>
            <Type size={14} mb={1}>
              Your Review <Required />
            </Type>
            <Type size={11} color={theme.lightBlack} mb={1}>
              Tell us what you expected, did the product deliver its promise and what results you got.
            </Type>
          </Container>
        }
      />
    </Container>
    <Container>
      <Type size={14} mb={1}>
        Would you recommend this product <Required />
      </Type>
      <CustomPicker
        defaultValue={form.getValue('recommend')}
        onChange={(value: any) => form.setValue({ recommend: value })}
        title="RECOMMEND IT?"
        options={[
          { label: 'Definitely yes', value: 1 },
          { label: 'Likely', value: 2 },
          { label: 'Not sure', value: 3 },
          { label: 'Unlikely', value: 4 },
          { label: 'Never!', value: 5 }
        ]}
      />
    </Container>
    <Type left mt={2} size={12} color={theme.darkRed} semiBold>
      * Required fields
    </Type>
  </>
)

type ProductDetailsProps = {
  data: {} | any
  imageWidth?: number
  imageHeight?: number
}

const ProductDetails = ({ data, imageWidth = 100, imageHeight = 100 }: ProductDetailsProps) => (
  <Container
    rows
    pv={2}
    style={{ borderColor: theme.borderColor, borderTopWidth: 1, borderBottomWidth: 1 }}
    mt={2}
    mb={2}
  >
    <Container style={{ width: '40%' }} center>
      <ResponsiveImage
        src={data.productImage}
        styles={{
          image: { width: imageWidth, height: imageHeight || imageWidth }
        }}
        width={imageWidth}
        height={imageHeight || imageWidth}
        useAspectRatio
      />
    </Container>

    <Container style={{ width: '60%' }} pv={1} ph={2}>
      <Type size={14} bold>
        {data.brand_name}
      </Type>
      <Type size={13}>{data.name}</Type>
    </Container>
  </Container>
)

const ProductSubmitReview = ({ route, navigation }: any) => {
  const [isReviewGuidelinesModalVisible, setIsReviewGuidelinesModalVisible] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const customerAccount = useActionState('customer.account')
  const isPending = useActionState('customer.request.pending')
  const dispatch = useDispatch()
  const form = useForm({ rating: null, recommend: 1 })
  const product = route?.params?.data
  const isTGARestricted = product?.is_tga_restricted

  const handleSubmit = async () => {
    form.setSubmitted(true)
    if (form.isValid() && product) {
      const payload = {
        ...form.getValues(),
        store_id: 1,
        customer_id: customerAccount.id,
        product_id: product.product_id,
        product_name: product.name,
        comestri_product_id: product.comestri_product_id
      }
      try {
        const response = await dispatch(customer.actions.submitProductReview(payload))

        if (response?.value?.data?.data?.id) {
          setSubmitSuccess(true)
        }
      } catch (error) {
        alertError(error)
      }
    }
  }

  const onMount = () => {
    setSubmitSuccess(false)
  }

  const handleReviewGuidelinesModal = () => setIsReviewGuidelinesModalVisible(!isReviewGuidelinesModalVisible)

  useScreenFocusEffect(onMount)

  return (
    <ScrollView>
      <KeyboardAwareScrollView extraScrollHeight={60}>
        <Container>
          <Container ph={2}>
            <Type size={22} semiBold center mt={2}>
              Write a Review
            </Type>
            {!isTGARestricted && (
              <Type mt={2}>
                Earn $1 in store credit for every review we publish. See the{' '}
                <Type underline onPress={handleReviewGuidelinesModal}>
                  review guidelines here
                </Type>
                .
              </Type>
            )}
            <Type size={12} color={theme.lightBlack} italic mt={2}>
              In compliance with the Therapeutic Goods Administration (TGA) regulation, we cannot provide remuneration
              (i.e. $1 store credit) for reviews on TGA listed and registered products.
            </Type>
          </Container>
          <Container align="center">{!!product && <ProductDetails data={product} />}</Container>
          {!submitSuccess && (
            <>
              <Container ph={2}>
                <ReviewFormFields form={form} />
              </Container>
              <Container pv={4} ph={2} mb={2}>
                <CustomButton
                  bold
                  fontSize={16}
                  pv={1.5}
                  inactive={!form.isValid()}
                  disabled={!form.isValid()}
                  onPress={handleSubmit}
                  loading={isPending}
                  label="Submit Review"
                  icon="ArrowRight"
                  iconRight
                />
              </Container>
            </>
          )}
          {submitSuccess && (
            <Container pt={2} center>
              <Type size={16} bold mb={2}>
                Thanks, your review has been submitted
              </Type>
              <CustomButton width={200} icon="ios-arrow-back" iconType="ion" onPress={navigation.goBack}>
                Back
              </CustomButton>
            </Container>
          )}
        </Container>
        <CustomModal
          isVisible={isReviewGuidelinesModalVisible}
          style={styles.modal}
          containerStyle={styles.modalContainer}
          onClose={handleReviewGuidelinesModal}
          useNativeDriver
        >
          <ScrollView style={styles.scrollViewContainer}>
            <ProductReviewGuidelines />
          </ScrollView>
        </CustomModal>
      </KeyboardAwareScrollView>
    </ScrollView>
  )
}

export default ProductSubmitReview
