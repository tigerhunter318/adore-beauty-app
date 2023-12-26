import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Viewport } from '@skele/components'
import { ViewportContext } from './ViewportContext'

const ViewportAwareView = Viewport.Aware(View)

/**
 * ViewportAware Provider component. Provides viewport visibility props to any component
 *
 * @usage
 <ViewportProvider lazyLoadImage>
   <ScrollView>
     <ViewportAware>
      {({ inViewport, hasEnteredViewport }) => <MyComponent inViewport={inViewport} hasEnteredViewport={hasEnteredViewport} />}
     </ViewportAware>
   </ScrollView>
 </ViewportProvider>

 * @param children
 */
const ViewportAware = ({ children, preTriggerRatio = undefined, always = false }) => {
  const [inViewport, setInViewport] = useState(false)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
  const { lazyLoadImage } = useContext(ViewportContext)

  const handleViewportEnter = () => {
    setHasEnteredViewport(true)

    if (always) {
      setInViewport(true)
    }
  }

  const handleViewportLeave = () => {
    if (always) {
      setInViewport(false)
    }
  }
  if (!!children && lazyLoadImage) {
    return (
      <ViewportAwareView
        onViewportEnter={handleViewportEnter}
        onViewportLeave={handleViewportLeave}
        preTriggerRatio={preTriggerRatio}
      >
        {children({ inViewport, hasEnteredViewport })}
      </ViewportAwareView>
    )
  }
  return children
}

export default ViewportAware
