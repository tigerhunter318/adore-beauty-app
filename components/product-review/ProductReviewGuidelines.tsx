import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActionState } from '../../store/utils/stateHook'
import cms from '../../store/modules/cms'
import RichTextContent from '../RichText/RichTextContent'
import Loading from '../ui/Loading'
import { vh } from '../../utils/dimensions'

const ProductReviewGuidelines = () => {
  const dispatch = useDispatch()
  const data = useActionState('cms.articles.review-guidelines')
  const content = data?.postContent?.[0]?.content?.html
  const isPending = useActionState('cms.fetch.pending')

  const handleMount = () => {
    dispatch(cms.actions.fetch('review-guidelines'))
  }
  useEffect(handleMount, [dispatch])

  if (isPending) return <Loading lipstick style={{ height: vh(75) }} />
  if (!content) return null

  // @ts-ignore
  return <RichTextContent content={content} />
}

export default ProductReviewGuidelines
