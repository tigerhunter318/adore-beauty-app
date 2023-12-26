import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import podcasts from '../../store/modules/podcasts'
import PodcastEpisodesListItem from './PodcastEpisodesListItem'

const PodcastRichTextWidget = ({ url }) => {
  const [data, setData] = useState(null)
  const dispatch = useDispatch()

  const fetchData = async () => {
    const response = await dispatch(podcasts.actions.fetchClipDetails({ url }))

    if (response) {
      setData(response)
    }
  }

  const handleScreenLoad = () => {
    fetchData()
  }

  useScreenFocusEffect(handleScreenLoad, [])

  if (!data) return null

  return <PodcastEpisodesListItem episode={data} />
}

export default PodcastRichTextWidget
