import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type AppProviderProps = {
  cacheKeys?: [object, Dispatch<SetStateAction<object>>]
  recentProductState?: [any[], Dispatch<SetStateAction<any[]>>]
}

const AppContext = createContext<AppProviderProps>({})

const AppProvider = ({ children }) => (
  <AppContext.Provider
    value={{
      cacheKeys: useState<object>({}),
      recentProductState: useState<any[]>([])
    }}
  >
    {children}
  </AppContext.Provider>
)

export const useAppContext = () => useContext(AppContext)

export default AppProvider
