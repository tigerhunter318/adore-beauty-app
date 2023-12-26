import React, { useState, createContext, useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { DrawerActions } from '@react-navigation/native'
import { updateState } from '../../utils/updateState'

const initialState = { name: 'SidebarContext', title: null, contentComponent: null }

export const SidebarContext = createContext()

export const useSidebarContext = () => useContext(SidebarContext)
/**
 * Sidebar Context & Provider
 *
 * @usage
 * <SidebarProvider>
 *   <Container></Container>
 * </SidebarProvider>
 *
 * const Component = () => {
 *   const {setContextState, contextState : {name}} = React.useContext(SidebarContext)
 * }
 *
 * @param children
 */
export const SidebarProvider = ({ children }) => {
  const [drawerStyle, setDrawerStyle] = useState(undefined)
  const [swipeEnabled, setSwipeEnabled] = useState(false)
  const [contextState, setState] = useState(initialState)
  const [rightState, setRightState] = useState({})
  const [containerComponent, setContainerComponent] = useState(null)
  const setContextState = updateState(contextState, setState) // setStateOnChange(contextState, setState)

  const mountSidebar = (params = {}) => {
    setContextState({
      ...params
    })
    setSwipeEnabled(true)
  }
  const unMountSidebar = (params = {}) => {
    setContextState({
      ...params
    })
    setSwipeEnabled(false)
  }

  return (
    <SidebarContext.Provider
      value={{
        contextState,
        setContextState,
        setState,
        setRightState,
        rightState,
        swipeEnabled,
        setSwipeEnabled,
        mountSidebar,
        unMountSidebar,
        containerComponent,
        setContainerComponent,
        drawerStyle,
        setDrawerStyle
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContent = (component, deps = []) => {
  const { setContainerComponent } = useContext(SidebarContext)
  useEffect(() => {
    setContainerComponent(component)
    return () => {
      setContainerComponent(undefined)
    }
  }, deps)
}

export const useSidebar = () => {
  const { mountSidebar, unMountSidebar, setDrawerStyle } = useContext(SidebarContext)
  const navigation = useNavigation()

  const openDrawer = () => {
    // popSheet()
    navigation.dispatch(DrawerActions.openDrawer())
  }
  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer())
  }
  const setWidth = precentage => {
    setDrawerStyle({ width: `${precentage}%` })
  }
  const resetWidth = () => {
    setDrawerStyle(undefined)
  }

  return { mountSidebar, unMountSidebar, openDrawer, closeDrawer, setWidth, resetWidth }
}
