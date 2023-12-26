import { getRemoteConfigItem } from '../services/useRemoteConfig'
import { isEmpty } from './object'

export const composeModel = () => {
  const model = {}
  const reRankModel = getRemoteConfigItem('rerankmodel')

  if (reRankModel) {
    model.reRankModel = reRankModel
  }

  return isEmpty(model) ? undefined : JSON.stringify(model)
}
