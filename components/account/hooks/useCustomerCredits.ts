import { useDispatch } from 'react-redux'
import customer from '../../../store/modules/customer'
import { useActionState, useIsLoggedIn } from '../../../store/utils/stateHook'
import cart from '../../../store/modules/cart'
import { useScreenFocusEffect } from '../../../hooks/useScreen'
import { formatTimestamp, isBeforeTimestamp } from '../../../utils/date'
import { compareDate } from '../../../utils/sort'
import { getRemoteConfigBoolean } from '../../../services/useRemoteConfig'

const useCustomerCredits = (): {
  storeCredits: number
  giftCertificates: any[]
  activeGiftCertificates: any[]
  availableGiftCertificates: any[]
  isFetchPending: boolean
} => {
  const dispatch = useDispatch()
  const isLoggedIn = useIsLoggedIn()
  const storeCredits = useActionState('customer.storeCredits')
  const giftCertificates = useActionState('customer.giftCertificates')
  const activeGiftCertificates = giftCertificates?.filter(
    certificate => certificate.status === 'active' && !isBeforeTimestamp(certificate.expiry_date)
  )
  const availableGiftCertificates = giftCertificates
    ?.filter(
      certificate =>
        (certificate.status === 'active' || certificate.status === 'disabled') &&
        !isBeforeTimestamp(certificate.expiry_date)
    )
    ?.map(certificate => ({ ...certificate, sorting_date: formatTimestamp(certificate.expiry_date, 'YYYY-MM-DD') }))
    .sort(compareDate('sorting_date', 'asc'))

  const isPending = useActionState('customer.request.pending')
  const requestName = useActionState('customer.request.meta.method.name')
  const isFetchPending =
    (isPending && requestName === 'fetchGiftCertificatesByEmail') || (isPending && requestName === 'fetchStoreCredits')

  const onMount = () => {
    const fetchCredits = async () => {
      await dispatch(customer.actions.fetchGiftCertificatesByEmail())

      if (getRemoteConfigBoolean('store_credit_enabled')) {
        const credits = await dispatch(customer.actions.fetchStoreCredits())
        if (credits) {
          await dispatch(cart.actions.updateStoreCredits(credits))
        }
      }
    }
    if (isLoggedIn) {
      fetchCredits()
    }
  }

  useScreenFocusEffect(onMount, [isLoggedIn])

  return { storeCredits, giftCertificates, activeGiftCertificates, availableGiftCertificates, isFetchPending }
}

export default useCustomerCredits
