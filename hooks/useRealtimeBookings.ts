// lib/hooks/useRealtimeBookings.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useSession } from "@clerk/nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useSupabase } from "@/context/SupabaseProvider";

// PostgreSQL payload interface
interface PostgresPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
  errors?: unknown;
}

// ... (interfaces remain the same) ...
export interface RealtimeBooking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "HOLD";
  totalAmount: number;
  businessId: string;
  customerId?: string;
}

export interface RealtimeWaiver {
  id: string;
  status: "PENDING" | "SIGNED" | "REJECTED" | "EXPIRED";
  bookingId: string;
  businessId: string;
}

export interface RealtimeNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface UseRealtimeBookingsOptions {
  businessId: string | null;
  onBookingChange?: (
    event: "INSERT" | "UPDATE" | "DELETE",
    booking: RealtimeBooking,
    oldBooking?: RealtimeBooking
  ) => void;
  onWaiverChange?: (
    event: "INSERT" | "UPDATE" | "DELETE",
    waiver: RealtimeWaiver
  ) => void;
  enableNotifications?: boolean;
}

export function useRealtimeBookings(options: UseRealtimeBookingsOptions) {
  const {
    businessId,
    onBookingChange,
    onWaiverChange,
    enableNotifications = false,
  } = options;
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const supabase = useSupabase();
  
  // Use refs to avoid re-subscriptions when callbacks change
  const onBookingChangeRef = useRef(onBookingChange);
  const onWaiverChangeRef = useRef(onWaiverChange);
  
  useEffect(() => {
    onBookingChangeRef.current = onBookingChange;
    onWaiverChangeRef.current = onWaiverChange;
  }, [onBookingChange, onWaiverChange]);

  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setupInProgressRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 5;

  // Notifications functionality
  const addNotification = useCallback(
    (notification: RealtimeNotification) => {
      if (!enableNotifications) return;

      console.log("[Realtime] New notification:", notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 20)); // Keep last 20
      toast({
        title: notification.title,
        description: notification.description,
      });
    },
    [enableNotifications, toast]
  );

  const cleanupChannels = useCallback(() => {
    console.log("[Realtime] Cleaning up channels...");
    if (supabase && channelsRef.current.length > 0) {
      for (const channel of channelsRef.current) {
        try {
          console.log(`[Realtime] Removing channel: ${channel.topic}`);
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn("Error removing channel:", error);
        }
      }
    }

    channelsRef.current = [];
    setConnectionStatus("disconnected");
    setupInProgressRef.current = false;
  }, [supabase]);

  const setupRealtimeSubscriptions = useCallback(async () => {
    // Comprehensive checks for setup requirements
    if (
      !businessId || 
      !user || 
      !isLoaded ||
      !supabase || 
      !session ||
      setupInProgressRef.current
    ) {
      console.log("[Realtime] Setup skipped - missing requirements:", { 
        businessId: !!businessId, 
        user: !!user, 
        isLoaded,
        supabase: !!supabase, 
        session: !!session,
        inProgress: setupInProgressRef.current 
      });
      return;
    }

    console.log(`[Realtime] Setting up subscriptions for business: ${businessId}, user: ${user.id}`);
    setupInProgressRef.current = true;
    setConnectionStatus("connecting");
    
    // Clean up any existing channels
    cleanupChannels();

    try {
      // Get fresh token for realtime auth
      const token = await session.getToken();
      if (!token) {
        console.error('[Realtime] No session token available');
        setConnectionStatus("error");
        setupInProgressRef.current = false;
        return;
      }

      // Set realtime auth with fresh token
      console.log('[Realtime] Setting realtime auth with fresh token');
      await supabase.realtime.setAuth(token);

      // Small delay to ensure auth is set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check again after delay in case component unmounted
      if (!businessId || !user || !isLoaded) {
        setupInProgressRef.current = false;
        return;
      }

      const newChannels: RealtimeChannel[] = [];

      // Channel 1: Booking changes - Filter by businessId
      const bookingChannel = supabase
        .channel(`bookings-realtime-${businessId}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Booking",
            filter: `businessId=eq.${businessId}`,
          },
          (payload: PostgresPayload) => {
            console.log("[Realtime] Booking event received:", {
              eventType: payload.eventType,
              bookingId: payload.new?.id || payload.old?.id,
              status: payload.new?.status || payload.old?.status
            });
            setLastActivity(new Date());
            
            const booking = payload.new as unknown as RealtimeBooking;
            const oldBooking = payload.old as unknown as RealtimeBooking;
            const eventType = payload.eventType;
            
            if (onBookingChangeRef.current) {
              try {
                onBookingChangeRef.current(eventType, booking || oldBooking, oldBooking);
              } catch (error) {
                console.error(`Booking handler error:`, error);
              }
            }
          }
        );
      newChannels.push(bookingChannel);

      // Channel 2: Waiver changes - Filter by businessId
      const waiverChannel = supabase
        .channel(`waivers-realtime-${businessId}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Waiver",
            filter: `businessId=eq.${businessId}`,
          },
          (payload: PostgresPayload) => {
            console.log("[Realtime] Waiver event received:", {
              eventType: payload.eventType,
              waiverId: payload.new?.id || payload.old?.id,
              status: payload.new?.status || payload.old?.status
            });
            setLastActivity(new Date());
            
            const waiver = payload.new as unknown as RealtimeWaiver;
            const eventType = payload.eventType;

            if (onWaiverChangeRef.current) {
              try {
                onWaiverChangeRef.current(
                  eventType,
                  waiver || (payload.old as unknown as RealtimeWaiver)
                );
              } catch (error) {
                console.error(`Waiver handler error:`, error);
              }
            }
          }
        );
      newChannels.push(waiverChannel);

      // Subscribe to all channels
      channelsRef.current = newChannels;
      let subscribedCount = 0;
      
      for (const channel of newChannels) {
        channel.subscribe((status, err) => {
          console.log(`[Realtime] Channel ${channel.topic} status: ${status}`);
          
          if (status === "SUBSCRIBED") {
            subscribedCount++;
            setLastActivity(new Date());
            retryCountRef.current = 0; // Reset retry count on success
            
            // If all channels are subscribed, mark as connected
            if (subscribedCount === newChannels.length) {
              setConnectionStatus("connected");
              setupInProgressRef.current = false;
              console.log('[Realtime] All channels subscribed successfully');
            }
          } else if (status === "CHANNEL_ERROR") {
            console.error(`[Realtime] Channel ${channel.topic} subscription failed:`, { 
              status, 
              error: err,
              userId: user?.id,
              businessId,
              retryCount: retryCountRef.current
            });
            
            setConnectionStatus("error");
            setupInProgressRef.current = false;
            
            // Implement exponential backoff retry
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
              
              console.log(`[Realtime] Retrying connection in ${retryDelay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
              
              reconnectTimeoutRef.current = setTimeout(() => {
                if (!setupInProgressRef.current) {
                  setupRealtimeSubscriptions();
                }
              }, retryDelay);
            } else {
              console.error('[Realtime] Max retries reached, giving up');
            }
          } else if (status === "CLOSED") {
            console.log(`[Realtime] Channel ${channel.topic} closed`);
            setupInProgressRef.current = false;
          }
        });
      }
    } catch (error) {
      console.error("[Realtime] Setup error:", error);
      setConnectionStatus("error");
      setupInProgressRef.current = false;
      
      // Retry on setup error
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!setupInProgressRef.current) {
            setupRealtimeSubscriptions();
          }
        }, retryDelay);
      }
    }
  }, [businessId, user, isLoaded, supabase, session, cleanupChannels]);

  useEffect(() => {
    // Only set up subscriptions when all requirements are met
    if (businessId && user && isLoaded && supabase && session) {
      console.log('[Realtime] All requirements met, setting up subscriptions');
      
      // Small delay to allow authentication to settle
      const setupTimeout = setTimeout(() => {
        setupRealtimeSubscriptions();
      }, 1000);

      return () => {
        clearTimeout(setupTimeout);
        cleanupChannels();
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    } else {
      console.log('[Realtime] Requirements not met, skipping setup:', {
        businessId: !!businessId,
        user: !!user,
        isLoaded,
        supabase: !!supabase,
        session: !!session
      });
      
      // Clean up if requirements are no longer met
      cleanupChannels();
    }
  }, [businessId, user?.id, isLoaded, supabase, session, setupRealtimeSubscriptions, cleanupChannels]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const reconnect = useCallback(() => {
    console.log('[Realtime] Manual reconnect requested');
    retryCountRef.current = 0; // Reset retry count
    if (!setupInProgressRef.current) {
      setupRealtimeSubscriptions();
    }
  }, [setupRealtimeSubscriptions]);

  return {
    notifications,
    dismissNotification,
    connectionStatus,
    lastActivity,
    reconnect,
    activeChannels: channelsRef.current.length,
  };
}