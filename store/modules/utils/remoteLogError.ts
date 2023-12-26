import remoteLog from '../../../services/remoteLog'
import { parseApiErrorMessage } from '../../api'

export const remoteLogError = ({ payload, error, namespace, endpoint }) => {
  remoteLog.addBreadcrumb({
    category: `ApiError-${namespace}`,
    message: endpoint,
    data: {
      payload,
      response: error?.response?.data
    }
  })
  return remoteLog.logError(`ApiError-${namespace || ''}`, { message: parseApiErrorMessage(error) })
}
