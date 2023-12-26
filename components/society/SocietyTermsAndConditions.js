import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Loading from '../ui/Loading'
import { useActionState } from '../../store/utils/stateHook'
import cms from '../../store/modules/cms'
import SocietyRichTextContent from './SocietyRichTextContent'
import Container from '../ui/Container'

const SocietyTermsAndConditions = () => {
  const dispatch = useDispatch()
  const data = useActionState('cms.articles.adore-society-terms-conditions')
  const content = data?.postContent?.[0]?.content?.html
  const isPending = useActionState('cms.fetch.pending')

  const handleMount = () => {
    dispatch(cms.actions.fetch('adore-society-terms-conditions'))
  }
  useEffect(handleMount, [dispatch])

  if (isPending) return <Loading lipstick />
  if (!content) return null

  return (
    <Container ph={2}>
      <SocietyRichTextContent content={content} />
    </Container>
  )
}

export default SocietyTermsAndConditions
