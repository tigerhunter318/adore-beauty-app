import { useEffect } from 'react'
import qs from 'qs'

const dispatchMessage = object => {
  window.ReactNativeWebView.postMessage(JSON.stringify(object))
}

const addScript = ({ onload }) => {
  const script = document.createElement('script')
  script.src = 'https://portal.afterpay.com/afterpay-async.js'

  if (window.location.host.includes('staging.adorebeauty')) {
    script.src = 'https://portal.sandbox.afterpay.com/afterpay-async.js'
  }

  script.async = true
  script.defer = true
  script.onload = onload
  document.body.appendChild(script)
}

const initAfterPay = () => {
  const params = qs.parse(window.location.search.slice(1))
  window.AfterPay.initialize({ countryCode: 'AU' })
  window.AfterPay.redirect({ token: params.token })
}

const Afterpay = () => {
  const onMount = () => {
    const params = qs.parse(window.location.search.slice(1))

    if (params.status === 'SUCCESS') {
      dispatchMessage({
        type: 'ready',
        result: {
          orderToken: params.orderToken,
          checkoutId: params.checkout_id,
          type: 'Afterpay'
        }
      })
    } else {
      addScript({ onload: initAfterPay })
    }
  }

  useEffect(onMount, [])

  return null
}

export default Afterpay
