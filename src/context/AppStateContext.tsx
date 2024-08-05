'use client'

import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react'

interface AppStateContextProps {
  isIUXModalVisible: boolean
  setIsIUXModalVisible: (visible: boolean) => void
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined)

export const AppStateProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isIUXModalVisible, setIsIUXModalVisible] = useState<boolean>(false)

  useEffect(() => {
    const isModalClosed = localStorage.getItem('isIUXModalClosed')
    if (!isModalClosed) {
      setIsIUXModalVisible(true)
    }
  }, [])

  const handleIUXModalClose = () => {
    localStorage.setItem('isIUXModalClosed', 'true')
    setIsIUXModalVisible(false)
  }

  const handleIUXModalOpen = () => {
    localStorage.removeItem('isIUXModalClosed')
    setIsIUXModalVisible(true)
  }

  return (
    <AppStateContext.Provider value={{ isIUXModalVisible, setIsIUXModalVisible }}>{children}</AppStateContext.Provider>
  )
}

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
