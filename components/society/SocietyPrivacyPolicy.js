import React, { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'

import Loading from '../ui/Loading'
import { useActionState } from '../../store/utils/stateHook'
import cms from '../../store/modules/cms'
import SocietyRichTextContent from './SocietyRichTextContent'

const SocietyPrivacyPolicy = () => {
  const dispatch = useDispatch()
  const content = useActionState('cms.articles.privacy.content')
  const isPending = useActionState('cms.fetch.pending')

  const handleMount = () => {
    dispatch(cms.actions.fetch('privacy'))
  }
  useEffect(handleMount, [dispatch])

  if (isPending) return <Loading lipstick />
  if (!content) return null

  return (
    <ScrollView>
      <SocietyRichTextContent olIcon="check-item" content={content} />
    </ScrollView>
  )
}

export default SocietyPrivacyPolicy
