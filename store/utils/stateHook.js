import { useSelector } from 'react-redux'
import { getIn } from '../../utils/getIn'

/**
 * const {data} = useActionState('cart.details.lineItems')
 *
 * @param path
 */
export const useActionState = path => useSelector(s => s && getIn(s, path))

export const useRequestPending = actionName => {
  const isPending = useActionState('cart.request.pending')
  const requestName = useActionState('cart.request.meta.method.name')
  return isPending && requestName === actionName
}

export const useCustomerId = () => useActionState('customer.account.id')
export const useIsLoggedIn = () => !!useCustomerId()

export const useIsSocietyMember = () => useActionState('customer.account.has_joined_loyalty')

export const useIsGuestUser = () => {
  const { email, isGuest, id } = useActionState('customer.account') || {}
  return !!email && !id && isGuest
}
