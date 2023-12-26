import { useEffect, useState } from 'react'
import envConfig, { versionNumber } from '../config/envConfig'
import { compareVersion } from '../utils/compareVersion'
import { getRemoteConfigItem } from './useRemoteConfig'

const useUpdateAvailable = mounted => {
  const [state, setState] = useState({
    isUpdateAvailable: false,
    isUpdateRequired: false,
    updateUrl: ''
  })

  const handleMount = () => {
    if (mounted && envConfig.enableUpdateCheck) {
      const updateUrl = getRemoteConfigItem('update_url')
      const minAppVersion = getRemoteConfigItem('min_app_version')
      const liveAppVersion = getRemoteConfigItem('live_app_version')
      const appVersion = versionNumber()
      const isUpdateAvailable =
        compareVersion(appVersion, '<', liveAppVersion) && compareVersion(appVersion, '>', minAppVersion)
      const isUpdateRequired = compareVersion(appVersion, '<', minAppVersion)

      setState({
        isUpdateAvailable,
        isUpdateRequired,
        updateUrl
      })
    }
  }

  useEffect(handleMount, [mounted])

  return state
}
export default useUpdateAvailable
