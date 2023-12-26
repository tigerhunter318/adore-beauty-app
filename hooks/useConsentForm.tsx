import React from 'react'
import ConsentForm from '../components/consent/ConsentForm'
import { useActionState } from '../store/utils/stateHook'

const useConsentForm = isConsentRequired => {
  const isConsentGiven = useActionState('customer.isConsentGiven')

  if (isConsentRequired && !isConsentGiven) return <ConsentForm />

  return null
}

export default useConsentForm
