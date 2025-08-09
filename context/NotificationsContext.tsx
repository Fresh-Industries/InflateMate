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
  isLoading: boolean
}

const NotificationsContext = createContext<Value | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchBusinessId = async () => {
      try {
        const response = await fetch('/api/me')
        
        if (!response.ok) {
          return
        }
        
        const data = await response.json()
        
        if (data.business?.id) {
          setCurrentBusinessId(data.business.id)
        }
      } catch (error) {
        console.error('Error fetching business ID:', error)
      } finally {
        setIsLoading(false)
      }
    };
    
    fetchBusinessId();
  }, [mounted]);

  const { notifications, dismiss } = useNotifications(currentBusinessId);

  // Provide default values while loading or if context fails
  const value: Value = {
    notifications: notifications || [],
    dismiss: dismiss || (() => {}),
    isLoading
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotificationsContext(): Value {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    // Instead of throwing, return safe defaults
    return {
      notifications: [],
      dismiss: () => {},
      isLoading: true
    }
  }
  return ctx
}
