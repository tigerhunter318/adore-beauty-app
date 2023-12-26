import React, { useState, useEffect } from 'react'
import { Linking } from 'react-native'
import Container from './Container'
import AdoreSvgIcon from './AdoreSvgIcon'
import { gaEvents } from '../../services/ga'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { now } from '../../utils/date'

const SocialShareIcon = ({ name, url, contentType, eventName, ...rest }) => {
  const [available, setAvailable] = useState(false)
  const checkAvailable = async () => {
    const result = await Linking.canOpenURL(url)
    setAvailable(result)
  }
  const handleLinkOpen = () => {
    Linking.openURL(url)

    gaEvents.shareEvent(contentType, eventName)
    emarsysEvents.trackCustomEvent('referAFriend', {
      interaction: JSON.stringify({
        shareButtonPressed: now(),
        name
      })
    })
  }
  const handleLinkChange = () => {
    checkAvailable()
  }
  useEffect(handleLinkChange, [url])

  if (!available) {
    return null
  }

  return (
    <Container mr={1.5} onPress={handleLinkOpen}>
      <AdoreSvgIcon name={name} {...rest} />
    </Container>
  )
}
export default SocialShareIcon
