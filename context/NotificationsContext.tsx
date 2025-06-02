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
        console.log('[NotificationProvider] Fetching business ID...')
        const response = await fetch('/api/me')
        
        if (!response.ok) {
          console.error('[NotificationProvider] Failed to fetch business ID:', response.status)
          return
        }
        
        const data = await response.json()
        console.log('[NotificationProvider] API response:', data)
        
        if (data.business?.id) {
          console.log('[NotificationProvider] Setting business ID:', data.business.id)
          setCurrentBusinessId(data.business.id)
        } else {
          console.warn('[NotificationProvider] No business ID found in response')
        }
      } catch (error) {
        console.error('[NotificationProvider] Error fetching business ID:', error)
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
    console.warn('[useNotificationsContext] Context not available, returning defaults')
    return {
      notifications: [],
      dismiss: () => {},
      isLoading: true
    }
  }
  return ctx
}
