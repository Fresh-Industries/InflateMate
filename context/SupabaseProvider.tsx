'use client';
import { createContext, useContext, useMemo, useRef, useEffect } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const { user } = useUser();
  const lastTokenRef = useRef<string | null>(null);

  // Create authenticated Supabase client with Clerk session token
  const supabase = useMemo(() => {
    console.log('[SupabaseProvider] Creating Supabase client:', { 
      hasSession: !!session, 
      hasUser: !!user,
      userId: user?.id
    });

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
          heartbeatIntervalMs: 30000,
        },
        global: {
          headers: {
            'x-client-info': 'clerk-supabase-integration',
          },
        },
        async accessToken() {
          try {
            const token = await session?.getToken() ?? null;
            
            if (token && token !== lastTokenRef.current) {
              console.log('[SupabaseProvider] Token updated, refreshing realtime auth');
              lastTokenRef.current = token;
              // Small delay to ensure realtime connection is ready
              setTimeout(() => {
                if (token) {
                  supabase?.realtime?.setAuth(token);
                }
              }, 100);
            }
            
            console.log('[SupabaseProvider] Getting access token:', { 
              hasSession: !!session, 
              hasToken: !!token,
              tokenLength: token?.length,
              userId: user?.id
            });
            
            return token;
          } catch (error) {
            console.error('[SupabaseProvider] Error getting access token:', error);
            return null;
          }
        },
      }
    );
  }, [session, user?.id]);

  // Handle token refresh for realtime connections
  useEffect(() => {
    if (!session || !supabase) return;

    let isActive = true;

    const refreshRealtimeAuth = async () => {
      try {
        const token = await session.getToken();
        if (token && isActive && token !== lastTokenRef.current) {
          console.log('[SupabaseProvider] Refreshing realtime auth with new token');
          lastTokenRef.current = token;
          await supabase.realtime.setAuth(token);
        }
      } catch (error) {
        console.error('[SupabaseProvider] Error refreshing realtime auth:', error);
      }
    };

    // Refresh auth immediately if we have a session
    refreshRealtimeAuth();

    // Set up periodic refresh (every 50 minutes - tokens expire after 60 minutes)
    const refreshInterval = setInterval(refreshRealtimeAuth, 50 * 60 * 1000);

    return () => {
      isActive = false;
      clearInterval(refreshInterval);
    };
  }, [session, supabase, user?.id]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 