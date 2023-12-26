import FastImage from 'react-native-fast-image'
import { Viewport } from '@skele/components'
import React, { forwardRef } from 'react'

/**
 * @usage
 *
 * <ViewportProvider lazyLoadImage>
 *  <ViewportAwareImage source={{ uri, loadingUri }} />
 * </ViewportProvider>
 *
 * consider adding a unique key to image if cache issue presists
 * // https://github.com/facebook/react-native/issues/12606
 */
const ViewportAwareImage = forwardRef(({ source = {}, inViewport, ...rest }, ref) => {
  const uri = !inViewport && source.loadingUri ? source.loadingUri : source.uri
  return <FastImage resizeMode="contain" {...rest} source={{ uri }} key={uri} ref={ref} />
})

export default Viewport.Aware(ViewportAwareImage)
