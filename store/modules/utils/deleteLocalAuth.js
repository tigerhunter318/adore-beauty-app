import { emarsysService } from '../../../services/emarsys/emarsys'
import facebook from '../../../services/facebook'
import { deleteAsyncStorageItem } from '../../../utils/asyncStorage'

export const deleteLocalAuth = () => async (dispatch, getState) => {
  await deleteAsyncStorageItem(`cart.cart`, true)
  await deleteAsyncStorageItem('customer', true)
  await dispatch({ type: 'AUTH_RESET', payload: {} })
  facebook.logout()
  emarsysService.clearContact()
}
