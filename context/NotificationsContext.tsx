'use client'

import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useNotifications, Notification } from '@/hooks/useNotifications' 

type Value = {
  notifications: Notification[]
  dismiss: (id: string) => void
}

const NotificationsContext = createContext<Value | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { notifications, dismiss } = useNotifications()

  return (
    <NotificationsContext.Provider value={{ notifications, dismiss }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotificationsContext(): Value {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error('useNotificationsContext must be used inside NotificationsProvider')
  }
  return ctx
}
