import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import addressUtil from '../../../utils/addressUtil'
import customer from '../customer'
import { useRequestPending, useActionState, useIsLoggedIn } from '../../utils/stateHook'
import { isValidName } from '../../../utils/validation'

const useCustomerAddresses = () => {
  const dispatch = useDispatch()
  const [filteredAddresses, setFilteredAddresses] = useState([])
  const [defaultAddress, setDefaultAddress] = useState(null)
  const account = useActionState('customer.account')
  const customerAddresses = useActionState('customer.addresses')
  const isLoggedIn = useIsLoggedIn()
  const isPending = useRequestPending('fetchCustomerAddresses')

  const accountDefaults = {
    first_name: isValidName(account?.first_name) ? account.first_name : '',
    last_name: isValidName(account?.last_name) ? account.last_name : '',
    phone: account?.default_phone ?? '',
    email: account?.email ?? ''
  }

  const sortAndSaveAddresses = addresses => {
    const sortedAddresses = addressUtil.sortAddresses(addresses)
    const formattedAndSortedAddresses = sortedAddresses?.map(address =>
      addressUtil.formatSavedAddress(address, accountDefaults)
    )
    const addressList = formattedAndSortedAddresses?.map(address => address.addressMeta)
    const addressListFiltered = addressUtil.filterInvalidAddresses(addressList) || []
    let defaultShipping = addressListFiltered.find(address => address.is_default_shipping)
    if (!defaultShipping && addressListFiltered.length > 0) {
      defaultShipping = addressListFiltered?.[0]
    }

    setFilteredAddresses(addressListFiltered)
    setDefaultAddress(defaultShipping)

    return formattedAndSortedAddresses
  }

  const fetchCustomersAddresses = async () => {
    if (isLoggedIn) {
      const fetchedAddresses = await dispatch(customer.actions.fetchCustomerAddresses())

      if (fetchedAddresses) {
        return sortAndSaveAddresses(fetchedAddresses)
      }
    }
  }

  useEffect(() => {
    fetchCustomersAddresses()
  }, [])

  return { filteredAddresses, isPending, customerAddresses, defaultAddress, accountDefaults }
}

export default useCustomerAddresses
