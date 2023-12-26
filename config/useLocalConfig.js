import { useState, useEffect } from 'react'
import { getAsyncStorageItem } from '../utils/asyncStorage'
import { deepMerge } from '../utils/object'
import envConfig from './envConfig'

const useLocalConfig = () => {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    const loadConfig = async () => {
      const localConfig = await getAsyncStorageItem('ENV_CONFIG')
      let newConfig = { ...envConfig }
      if (localConfig && Object.keys(localConfig).length > 0) {
        newConfig = deepMerge(envConfig, localConfig)
      }
      setConfig(newConfig)
    }
    loadConfig()
  }, [])

  return config
}

export default useLocalConfig
