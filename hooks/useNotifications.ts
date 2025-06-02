// lib/useNotifications.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@clerk/nextjs'
import { createSupabaseClient } from '@/lib/supabaseClient'

export interface Notification {
  id: string
  title: string
  description: string
  createdAt: string
}

interface BookingPayload {
  businessId: string;
  id: string;
  eventDate: string;
  status: string;
  [key: string]: unknown;
}

function isBookingPayload(obj: unknown): obj is BookingPayload {
  return typeof obj === 'object' && obj !== null && 'businessId' in obj;
}

export function useNotifications(currentBusinessId: string | null) {
  const { toast } = useToast()
  const { session, isLoaded } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!currentBusinessId || !isLoaded || !session) {
      console.warn("[Notifications] Not ready:", { currentBusinessId, isLoaded, hasSession: !!session })
      return
    }

    // Create authenticated Supabase client with Clerk session
    const supabase = createSupabaseClient(session)
    
    console.log(`[Notifications] Setting up authenticated real-time subscriptions for business: ${currentBusinessId}`)

    const push = (n: Notification) => {
      console.log('[Notifications] New notification:', n)
      setNotifications((prev) => [n, ...prev])
      // immediate toast
      toast({ title: n.title, description: n.description })
    }

    // Test connection with authenticated client
    const testChannel = supabase
      .channel('test-connection-auth')
      .on('presence', { event: 'sync' }, () => {
        console.log('[Notifications] Authenticated Supabase connection established')
      })
      .subscribe((status) => {
        console.log('[Notifications] Test channel status:', status)
      })

    // Test a simple subscription to all booking changes first
    const debugBookingChannel = supabase
      .channel(`debug-bookings-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', // Listen to all events
          schema: 'public', 
          table: 'Booking'
        },
        (payload) => {
          console.log('[DEBUG] Any Booking change detected (authenticated):', payload)
          console.log('[DEBUG] Event type:', payload.eventType)
          console.log('[DEBUG] New data:', payload.new)
          console.log('[DEBUG] Old data:', payload.old)
          
          // Check if this booking belongs to our business
          const booking = payload.new || payload.old
          if (isBookingPayload(booking)) {
            console.log('[DEBUG] Booking businessId:', booking.businessId)
            console.log('[DEBUG] Our businessId:', currentBusinessId)
            console.log('[DEBUG] Match:', booking.businessId === currentBusinessId)
          }
        }
      )
      .subscribe((status) => {
        console.log('[DEBUG] Debug booking channel status:', status)
      })

    // DocuSeal Waivers - Listen for waiver status updates
    const docusealCh = supabase
      .channel(`docuseal-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Waiver'
          // No filter needed - RLS will handle access control
        },
        (payload) => {
          console.log('[Notifications] Waiver update received:', payload)
          console.log('[Notifications] Waiver payload.new:', payload.new)
          console.log('[Notifications] Waiver payload.old:', payload.old)
          
          const waiver = payload.new
          if (waiver) {
            console.log('[Notifications] Waiver status:', waiver.status)
            console.log('[Notifications] Checking if status === SIGNED:', waiver.status === 'SIGNED')
            
            if (waiver.status === 'SIGNED') {
              console.log('[Notifications] Creating waiver signed notification')
              push({
                id: `waiver-${waiver.id}-${Date.now()}`,
                title: 'Waiver Signed',
                description: `A waiver has been signed for your business`,
                createdAt: new Date().toISOString(),
              })
            } else {
              console.log('[Notifications] Waiver status is not SIGNED, current status:', waiver.status)
            }
          } else {
            console.log('[Notifications] No waiver data in payload.new')
          }
        }
      )
      .subscribe((status) => {
        console.log('[Notifications] DocuSeal channel status:', status)
      })

    // Also listen for waiver INSERTs in case that's how they're created
    const waiverInsertCh = supabase
      .channel(`waiver-inserts-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Waiver'
        },
        (payload) => {
          console.log('[Notifications] Waiver INSERT received:', payload)
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
      .subscribe((status) => {
        console.log('[Notifications] Waiver INSERT channel status:', status)
      })

    // Listen for ALL waiver events for debugging
    const waiverDebugCh = supabase
      .channel(`waiver-debug-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', // All events
          schema: 'public', 
          table: 'Waiver'
        },
        (payload) => {
          console.log('[DEBUG] ANY Waiver event detected:', payload.eventType, payload)
        }
      )
      .subscribe((status) => {
        console.log('[DEBUG] Waiver debug channel status:', status)
      })

    // Leads - Listen for new customer sign-ups
    const leadCh = supabase
      .channel(`leads-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Customer'
          // No filter needed - RLS will handle access control
        },
        (payload) => {
          console.log('[Notifications] Customer insert received:', payload)
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
      .subscribe((status) => {
        console.log('[Notifications] Lead channel status:', status)
      })

    // Bookings - Listen for new bookings (with debug)
    const bookCh = supabase
      .channel(`bookings-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'Booking'
          // No filter needed - RLS will handle access control
        },
        (payload) => {
          console.log('[Notifications] Booking INSERT received:', payload)
          const booking = payload.new
          if (booking) {
            console.log('[Notifications] Creating booking notification for:', booking.id)
            push({
              id: `booking-${booking.id}-${Date.now()}`,
              title: 'New Booking',
              description: `New booking received for ${new Date(booking.eventDate).toLocaleDateString()}`,
              createdAt: new Date().toISOString(),
            })
          }
        }
      )
      .subscribe((status) => {
        console.log('[Notifications] Booking channel status:', status)
      })

    // Also listen for booking updates (status changes)
    const bookingUpdateCh = supabase
      .channel(`booking-updates-auth-${currentBusinessId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Booking'
          // No filter needed - RLS will handle access control
        },
        (payload) => {
          console.log('[Notifications] Booking UPDATE received:', payload)
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
      .subscribe((status) => {
        console.log('[Notifications] Booking update channel status:', status)
      })

    // Cleanup function
    return () => {
      console.log('[Notifications] Cleaning up authenticated subscriptions')
      supabase.removeChannel(testChannel)
      supabase.removeChannel(debugBookingChannel)
      supabase.removeChannel(leadCh)
      supabase.removeChannel(bookCh)
      supabase.removeChannel(bookingUpdateCh)
      supabase.removeChannel(docusealCh)
      supabase.removeChannel(waiverInsertCh)
      supabase.removeChannel(waiverDebugCh)
    }
  }, [toast, currentBusinessId, session, isLoaded])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, dismiss }
}
