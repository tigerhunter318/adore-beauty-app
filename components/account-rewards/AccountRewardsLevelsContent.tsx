import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Container from '../ui/Container'
import Type from '../ui/Type'
import { useActionState } from '../../store/utils/stateHook'
import cms from '../../store/modules/cms'
import SocietyMenuLevels from '../society/SocietyMenu/SocietyMenuLevels'
import { fontStyles } from '../../constants/fontStyles'

const AccountRewardsLevelsContent = () => {
  const dispatch = useDispatch()
  const cmsContent = useActionState('cms.articles.adore-society.postContent')
  const { title, cards } = cmsContent?.find(res => res?.content?.title === 'THREE LEVELS OF BENEFITS')?.content || {}

  const handleMount = () => {
    if (!cmsContent) {
      dispatch(cms.actions.fetch('adore-society'))
    }
  }

  useEffect(handleMount, [dispatch, cmsContent])

  if (!title) return null

  return (
    <Container>
      <Type ph={4} pt={4} center heading size={fontStyles.h3.fontSize} lineHeight={30} letterSpacing={1}>
        {title}
      </Type>
      <SocietyMenuLevels cards={cards} isSocietyMember onPress={undefined} />
    </Container>
  )
}

export default AccountRewardsLevelsContent
