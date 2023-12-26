import React from 'react'

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    // trackAllPureComponents: true
  })
}

// Component.whyDidYouRender = true

/* eslint-enable global-require */
