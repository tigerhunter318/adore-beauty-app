import React from 'react'
import zendesk from '../../services/zendesk'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import CustomButton from '../ui/CustomButton'

const ZendeskChat = () => {
  const handlePress = () => {
    emarsysEvents.trackCustomEvent('customerSupport')
    zendesk.startChat({})
  }

  return (
    <CustomButton
      icon="speech"
      iconType="adoresvg"
      iconSize={20}
      bold
      fontSize={14}
      background="white"
      pv={1.4}
      onPress={handlePress}
      borderRadius
    >
      Need help? Chat now
    </CustomButton>
  )
}

export default ZendeskChat
