import React, { useEffect } from 'react'
import { Alert } from 'react-native'
import { gaEvents } from '../../services/ga'
import { openExternalUrl } from '../../utils/openExternalUrl'

/* eslint-disable no-console */

const handleUpdatePress = async ({ type, url }) => {
  gaEvents.addForceAppUpdate('Update', type)

  if (type === 'required') {
    updateRequired(url)
  }

  await openExternalUrl(url)
}

/* eslint-enable no-console */

const updateAvailable = url => {
  Alert.alert(
    'Update Available',
    'There is a shiny new version of the Adore Beauty app available. Would you like to update?',
    [
      {
        text: 'Not Now',
        onPress: () => gaEvents.addForceAppUpdate('Not Now', 'available')
      },
      {
        text: 'Update',
        onPress: () => handleUpdatePress({ type: 'available', url })
      }
    ],
    {
      cancelable: false
    }
  )
}

const updateRequired = url => {
  Alert.alert(
    'Update Required',
    'You will need to update your Adore Beauty app in order to continue.',
    [
      {
        text: 'Update',
        onPress: () => handleUpdatePress({ type: 'required', url })
      }
    ],
    {
      cancelable: false
    }
  )
}

const UpdateAlert = ({ required, url }) => {
  useEffect(() => {
    if (required) {
      updateRequired(url)
    } else {
      updateAvailable(url)
    }
  }, [required, url])

  return <></>
}

export default UpdateAlert
