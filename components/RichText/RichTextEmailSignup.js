import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Container from '../ui/Container'
import Type from '../ui/Type'
import FormField from '../form/FormField'
import CustomButton from '../ui/CustomButton'
import ResponsiveImage from '../ui/ResponsiveImage'
import useForm from '../form/useForm'
import RichTextContentEmailSignup from './RichTextContentEmailSignup'
import RichTextEmailSignupModal from './RichTextEmailSignupModal'
import emarsys from '../../store/modules/emarsys'
import { useActionState } from '../../store/utils/stateHook'
import { vw } from '../../utils/dimensions'

const RichTextEmailSignup = ({ content }) => {
  const dispatch = useDispatch()
  const [isModalVisible, setModalVisibility] = useState(false)
  const isPending = useActionState('emarsys.pending')
  const form = useForm()
  const handleRevealCode = async () => {
    form.setSubmitted(true)
    if (form.isValid()) {
      const response = await dispatch(emarsys.actions.createContact(form.getValues().email, content.sourceId))

      if (response.status === 200) {
        setModalVisibility(true)
      }
    }
  }
  return (
    <Container pb={2}>
      <ResponsiveImage src={content.logo} width={401} height={101} useAspectRatio />
      <Container align mt={1.5}>
        <RichTextContentEmailSignup content={content.description} color={content.descTextBackground} />
      </Container>

      <Container>
        <FormField required name="email" fieldType="email" form={form} placeholder="Your email" />
        <Container align pt={1.5}>
          <CustomButton
            background="white"
            color="black"
            fontSize={14}
            width={vw(90)}
            onPress={handleRevealCode}
            disabled={isPending}
            loading={isPending}
          >
            {content.ctaButtons.title}
          </CustomButton>
        </Container>
      </Container>

      <Container mt={2}>
        <Type size={12} center>
          {content.termsAndConditions}
        </Type>
      </Container>

      {content.mobileImage ? (
        <Container ph={2} mt={2}>
          <ResponsiveImage src={content.mobileImage} width={750} height={500} useAspectRatio />
        </Container>
      ) : null}

      <RichTextEmailSignupModal
        isVisible={isModalVisible}
        onClose={() => {
          setModalVisibility(false)
        }}
        data={content.ctaPopup.content}
      />
    </Container>
  )
}

export default RichTextEmailSignup
