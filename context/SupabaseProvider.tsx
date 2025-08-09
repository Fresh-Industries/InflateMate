'use client';
import { createContext, useContext, useMemo, useRef, useEffect, useCallback } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Sentry from "@sentry/nextjs";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const { user } = useUser();
  const lastTokenRef = useRef<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Validate JWT token before using it
  const validateToken = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token has valid expiration and hasn't expired
      if (!payload.exp || typeof payload.exp !== 'number') {
        const error = new Error(`Token missing or invalid exp claim: ${payload.exp}`);
        console.error('[SupabaseProvider] Token missing or invalid exp claim:', payload.exp);
        
        Sentry.captureException(error, {
          tags: { component: 'SupabaseProvider', issue: 'invalid_jwt_exp' },
          extra: { 
            expClaim: payload.exp, 
            payload: payload,
            userId: user?.id 
          }
        });
        
        return false;
      }
      
      if (payload.exp <= now) {
        const error = new Error(`Token has expired: exp=${payload.exp}, now=${now}`);
        console.error('[SupabaseProvider] Token has expired:', { exp: payload.exp, now });
        
        Sentry.captureException(error, {
          tags: { component: 'SupabaseProvider', issue: 'jwt_expired' },
          extra: { 
            exp: payload.exp, 
            now: now,
            userId: user?.id 
          }
        });
        
        return false;
      }
      
      // Check if exp is reasonable (not too far in the future)
      const maxFutureTime = now + (24 * 60 * 60); // 24 hours from now
      if (payload.exp > maxFutureTime) {
        const error = new Error(`Token exp is too far in future: exp=${payload.exp}, maxFutureTime=${maxFutureTime}`);
        console.error('[SupabaseProvider] Token exp is too far in future:', { exp: payload.exp, maxFutureTime });
        
        Sentry.captureException(error, {
          tags: { component: 'SupabaseProvider', issue: 'jwt_exp_future' },
          extra: { 
            exp: payload.exp, 
            maxFutureTime: maxFutureTime,
            userId: user?.id 
          }
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[SupabaseProvider] Error validating token:', error);
      
      Sentry.captureException(error, {
        tags: { component: 'SupabaseProvider', issue: 'jwt_validation_error' },
        extra: { 
          tokenLength: token?.length,
          userId: user?.id 
        }
      });
      
      return false;
    }
  }, [user?.id]);

  // Get token with retry logic and validation
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!session) {
      console.log('[SupabaseProvider] No session available');
      return null;
    }

    try {
      const token = await session.getToken();
      
      if (!token) {
        console.log('[SupabaseProvider] No token received from session');
        return null;
      }

      if (!validateToken(token)) {
        console.error('[SupabaseProvider] Token validation failed');
        return null;
      }

      retryCountRef.current = 0; // Reset retry count on success
      return token;
    } catch (error) {
      console.error('[SupabaseProvider] Error getting token:', error);
      
      // Capture network and token fetch errors
      Sentry.captureException(error, {
        tags: { component: 'SupabaseProvider', issue: 'token_fetch_error' },
        extra: { 
          retryCount: retryCountRef.current,
          userId: user?.id,
          hasSession: !!session
        }
      });
      
      // Retry logic for network issues
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`[SupabaseProvider] Retrying token fetch (${retryCountRef.current}/${maxRetries})`);
        
        // Exponential backoff
        const delay = Math.pow(2, retryCountRef.current) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return getValidToken();
      }
      
      return null;
    }
  }, [session, validateToken, user?.id]);

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
          return Sentry.startSpan(
            {
              op: "auth.token",
              name: "Get Supabase Access Token",
            },
            async (span) => {
              try {
                const token = await getValidToken();
                
                span.setAttribute("hasSession", !!session);
                span.setAttribute("hasToken", !!token);
                span.setAttribute("userId", user?.id || "unknown");
                
                // Only log in development or when there are issues
                if (process.env.NODE_ENV === 'development' || !token) {
                  console.log('[SupabaseProvider] Access token requested:', { 
                    hasSession: !!session, 
                    hasToken: !!token,
                    tokenLength: token?.length,
                    userId: user?.id
                  });
                }
                
                return token;
              } catch (error) {
                console.error('[SupabaseProvider] Error in accessToken function:', error);
                
                Sentry.captureException(error, {
                  tags: { component: 'SupabaseProvider', issue: 'access_token_error' },
                  extra: { userId: user?.id }
                });
                
                return null;
              }
            }
          );
        },
      }
    );
  }, [session, user?.id, getValidToken]);

  // Handle token refresh for realtime connections
  useEffect(() => {
    if (!session || !supabase) return;

    let isActive = true;
    let refreshTimeout: NodeJS.Timeout;

    const refreshRealtimeAuth = async () => {
      if (!isActive) return;
      
      try {
        const token = await getValidToken();
        
        if (token && isActive && token !== lastTokenRef.current) {
          console.log('[SupabaseProvider] Refreshing realtime auth with new token');
          lastTokenRef.current = token;
          await supabase.realtime.setAuth(token);
        }
      } catch (error) {
        console.error('[SupabaseProvider] Error refreshing realtime auth:', error);
        
        Sentry.captureException(error, {
          tags: { component: 'SupabaseProvider', issue: 'realtime_auth_refresh_error' },
          extra: { 
            userId: user?.id,
            retryCount: retryCountRef.current
          }
        });
        
        // Schedule retry if there was an error
        if (isActive && retryCountRef.current < maxRetries) {
          const retryDelay = Math.pow(2, retryCountRef.current + 1) * 1000;
          refreshTimeout = setTimeout(refreshRealtimeAuth, retryDelay);
        }
      }
    };

    // Initial auth refresh
    refreshRealtimeAuth();

    // Set up periodic refresh (every 45 minutes - tokens expire after 60 minutes)
    const refreshInterval = setInterval(() => {
      if (isActive) {
        refreshRealtimeAuth();
      }
    }, 45 * 60 * 1000);

    return () => {
      isActive = false;
      clearInterval(refreshInterval);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [session, supabase, user?.id, getValidToken]);

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