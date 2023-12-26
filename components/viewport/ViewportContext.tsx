import React, { createContext } from 'react'
// @ts-ignore
import { Viewport } from '@skele/components'

const initialState = { lazyLoadImage: false, debugImage: false }
export const ViewportContext = createContext(initialState)
/**
 * Viewport Context & Provider
 * https://reactjs.org/docs/hooks-reference.html#usecontext
 *
 * This Provider conflicts with the native lazy loading from Carousel (onViewableItemsChanged). So the ViewportProvider lazy loading has been set to false to those components by adding the tag:
 *
 *     <ViewportProvider lazyLoadImage={false}>
 *
 */

type ViewportProviderProps = {
  children: JSX.Element
  lazyLoadImage: boolean
  debugImage?: boolean
}

export const ViewportProvider = ({ children, lazyLoadImage = false, debugImage = false }: ViewportProviderProps) => (
  <ViewportContext.Provider value={{ lazyLoadImage, debugImage }}>
    {lazyLoadImage && <Viewport.Tracker>{children}</Viewport.Tracker>}
    {!lazyLoadImage && children}
  </ViewportContext.Provider>
)
