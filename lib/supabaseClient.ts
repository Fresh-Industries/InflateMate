import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// DEPRECATED: Use useSupabase() hook instead for authenticated client
// This function is kept only for legacy compatibility
export function createSupabaseClient() {
  console.warn('[Supabase] ⚠️  createSupabaseClient is deprecated. Use useSupabase() hook for authenticated client.')
  return createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
      heartbeatIntervalMs: 30000,
    },
  })
} 

// TEMPORARY: Service role client for backend operations only (DO NOT USE IN FRONTEND)
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}) : null

// Server-side authenticated client with Clerk session token
export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
      heartbeatIntervalMs: 30000,
    },
    // Use accessToken callback for automatic token refresh
    accessToken: async () => {
      try {
        // Get raw Clerk session token
        const { getToken } = await auth()
        const token = await getToken()
        return token
      } catch (error) {
        console.error('[Supabase] Error getting token:', error)
        return null
      }
    },
  })
}

// NOTE: For frontend use, always use the authenticated client from SupabaseProvider
// Do not create additional clients as it causes "Multiple GoTrueClient instances" warnings
