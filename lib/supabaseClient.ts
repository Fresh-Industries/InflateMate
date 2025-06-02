import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create authenticated client with Clerk session token (Third-Party Auth)
export function createSupabaseClient(session?: { getToken: () => Promise<string | null> }) {
  return createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    // Use accessToken callback for automatic token refresh (NO TEMPLATE!)
    accessToken: async () => {
      if (!session?.getToken) return null
      try {
        // Get raw Clerk session token (NOT template)
        const token = await session.getToken()
        console.log('[Supabase] Got fresh Clerk token:', token ? 'valid' : 'null')
        return token
      } catch (error) {
        console.error('[Supabase] Error getting token:', error)
        return null
      }
    },
  })
}

// Default client for non-authenticated requests
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// TEMPORARY: Service role client for testing (DO NOT USE IN PRODUCTION)
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

// Debug connection
if (typeof window !== 'undefined') {
  console.log('[Supabase] Client initialized with URL:', supabaseUrl)
  
  // Test the connection
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('[Supabase] Auth state changed:', event, session?.user?.id)
  })
}
