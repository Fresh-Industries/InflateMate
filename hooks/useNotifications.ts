// lib/useNotifications.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@clerk/nextjs'  // CHANGED: Use useAuth instead of useSession
import { useSupabase } from '@/context/SupabaseProvider'  // ADDED: Use authenticated client

export interface Notification {
  id: string
  title: string
  description: string
  createdAt: string
}





export function useNotifications(currentBusinessId: string | null) {
  const { toast } = useToast()
  const { getToken } = useAuth()
  const supabase = useSupabase()  // Use authenticated client from context
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!currentBusinessId || !supabase) {
      return
    }

    // Add delay in development to handle Fast Refresh
    const setupTimeout = setTimeout(() => {
      setupNotificationChannels();
    }, process.env.NODE_ENV === 'development' ? 1000 : 0);

    // Declare channels in outer scope for cleanup
    let testChannel: ReturnType<typeof supabase.channel>, 
        docusealCh: ReturnType<typeof supabase.channel>, 
        waiverInsertCh: ReturnType<typeof supabase.channel>, 
        leadCh: ReturnType<typeof supabase.channel>, 
        bookCh: ReturnType<typeof supabase.channel>, 
        bookingUpdateCh: ReturnType<typeof supabase.channel>;

    function setupNotificationChannels() {
      const push = (n: Notification) => {
        setNotifications((prev) => [n, ...prev])
        // immediate toast
        toast({ title: n.title, description: n.description })
      }

      // Test connection with authenticated client
      testChannel = supabase
      .channel('test-notifications-connection')
      .on('presence', { event: 'sync' }, () => {
        // Connection established
      })
      .subscribe()

      // DocuSeal Waivers - Listen for waiver status updates
      docusealCh = supabase
      .channel(`notifications-waivers-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Waiver',
          filter: `businessId=eq.${currentBusinessId}`
        },
        (payload) => {
          const waiver = payload.new
          if (waiver && waiver.status === 'SIGNED') {
            push({
              id: `waiver-${waiver.id}-${Date.now()}`,
              title: 'Waiver Signed',
              description: `A waiver has been signed for your business`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe()

      // Also listen for waiver INSERTs in case that's how they're created
      waiverInsertCh = supabase
      .channel(`notifications-waiver-inserts-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Waiver',
          filter: `businessId=eq.${currentBusinessId}`
        },
        (payload) => {
          const waiver = payload.new
          if (waiver && waiver.status === 'SIGNED') {
            push({
              id: `waiver-insert-${waiver.id}-${Date.now()}`,
              title: 'New Waiver Signed',
              description: `A new waiver has been signed for your business`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe()

      // Leads - Listen for new customer sign-ups
      leadCh = supabase
      .channel(`notifications-leads-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Customer',
          filter: `businessId=eq.${currentBusinessId}`
        },
        (payload) => {
          const customer = payload.new
          if (customer && customer.isLead) {
            push({
              id: `lead-${customer.id}-${Date.now()}`,
              title: 'New Lead',
              description: `${customer.name || 'Someone'} just signed up as a lead!`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe()

      // Bookings - Listen for new bookings 
      bookCh = supabase
      .channel(`notifications-bookings-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Booking',
          filter: `businessId=eq.${currentBusinessId}`
        },
        (payload) => {
          const booking = payload.new
          if (booking) {
            push({
              id: `booking-${booking.id}-${Date.now()}`,
              title: 'New Booking',
              description: `New booking received for ${new Date(booking.eventDate).toLocaleDateString()}`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe()

      // Also listen for booking updates (status changes)
      bookingUpdateCh = supabase
      .channel(`notifications-booking-updates-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Booking',
          filter: `businessId=eq.${currentBusinessId}`
        },
        (payload) => {
          const oldBooking = payload.old
          const newBooking = payload.new
          
          if (oldBooking && newBooking) {
            // Check if status changed to CONFIRMED
            if (oldBooking.status !== 'CONFIRMED' && newBooking.status === 'CONFIRMED') {
              push({
                id: `booking-confirmed-${newBooking.id}-${Date.now()}`,
                title: 'Booking Confirmed',
                description: `A booking has been confirmed for ${new Date(newBooking.eventDate).toLocaleDateString()}`,
                createdAt: new Date().toISOString(),
              })
            }
          }
        }
      )
      .subscribe()

    }

    // Cleanup function
    return () => {
      clearTimeout(setupTimeout);
      if (testChannel) supabase.removeChannel(testChannel)
      if (leadCh) supabase.removeChannel(leadCh)
      if (bookCh) supabase.removeChannel(bookCh)
      if (bookingUpdateCh) supabase.removeChannel(bookingUpdateCh)
      if (docusealCh) supabase.removeChannel(docusealCh)
      if (waiverInsertCh) supabase.removeChannel(waiverInsertCh)
    }
  }, [toast, currentBusinessId, getToken, supabase])  // CHANGED: Use supabase in dependency array

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, dismiss }
}