import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CMSContent from '../../components/cms/CMSContent'
import { useActionState } from '../../store/utils/stateHook'
import cms from '../../store/modules/cms'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'

const CMSScreen = ({
  route: {
    params: { data, identifier }
  }
}) => {
  const content = useActionState(`cms.articles.${identifier}.content`)
  const postContent = useActionState(`cms.articles.${identifier}.postContent`)

  const dispatch = useDispatch()

  const handleMount = () => {
    if (data) {
      dispatch(cms.actions.update({ data, identifier }))
    } else {
      dispatch(cms.actions.fetch(identifier))
    }
  }

  const handleInitialLoading = () => {
    emarsysEvents.trackScreen('CMS screen')
  }

  useEffect(handleMount, [dispatch, data, identifier])
  useEffect(handleInitialLoading, [])

  if (!content && !postContent?.length) return null

  return <CMSContent postContent={postContent} content={content} />
}

export default CMSScreen
