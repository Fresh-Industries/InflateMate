'use client';
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState
} from 'react'
import { useNotifications, Notification } from '@/hooks/useNotifications' 

type Value = {
  notifications: Notification[]
  dismiss: (id: string) => void
}

const NotificationsContext = createContext<Value | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessId = async () => {
      const user = await fetch('/api/me')
      const data = await user.json()
      console.log(data)
      setCurrentBusinessId(data.business.id)
    };
    fetchBusinessId();
  }, []);

  const { notifications, dismiss } = useNotifications(currentBusinessId);

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
