// lib/useNotifications.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast }   from '@/hooks/use-toast'

export interface Notification {
  id: string
  title: string
  description: string
  createdAt: string
}

export function useNotifications(currentBusinessId: string | null) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!currentBusinessId) {
      console.warn("No businessId provided for notification filtering.")
      return
    }

    const push = (n: Notification) => {
      setNotifications((prev) => [n, ...prev])
      // immediate toast
      toast({ title: n.title, description: n.description })
    }

    // DocuSeal
    const docusealCh = supabase
      .channel('docuseal')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Waiver', filter: `businessId=eq.${currentBusinessId}` },
        ({ new: waiverSigned }) => {
          push({
            id: waiverSigned.id,
            title: 'Waiver Signed',
            description: `Waiver signed by ${waiverSigned.customer?.name || 'a customer'}`,
            createdAt: new Date().toISOString(),
          })
        }
      )
      .subscribe()

    // Leads
    const leadCh = supabase
      .channel('leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Customer', filter: `businessId=eq.${currentBusinessId}` },
        ({ new: lead }) => {
          if (lead.isLead) {
            push({
              id: lead.id,
              title: 'New Lead',
              description: `${lead.name || 'Anonymous'} just signed up!`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe()

    // Bookings
    const bookCh = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Booking', filter: `businessId=eq.${currentBusinessId}` },
        ({ new: booking }) => {
          push({
            id: booking.id,
            title: 'New Booking',
            description: `Booking on ${new Date(booking.eventDate).toLocaleDateString()}`,
            createdAt: new Date().toISOString(),
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(leadCh)
      supabase.removeChannel(bookCh)
      supabase.removeChannel(docusealCh)
    }
  }, [toast, currentBusinessId])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, dismiss }
}
