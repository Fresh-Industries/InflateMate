'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSupabase } from '@/context/SupabaseProvider'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RealtimeEvent {
  timestamp: string
  channel: string
  event: string
  status?: string
  payload?: unknown
  error?: string
}

interface JWTInfo {
  hasRole: boolean
  role: string
  hasAud: boolean
  aud: string
  hasOrgId: boolean
  orgId: string
  issuer: string
  expires: string
  raw: string
}

export default function RealtimeDebugger({ businessId }: { businessId?: string }) {
  const { getToken } = useAuth()
  const supabase = useSupabase() // Authenticated client
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [testing, setTesting] = useState(false)
  const [jwtInfo, setJwtInfo] = useState<JWTInfo | null>(null)

  const addEvent = (event: Omit<RealtimeEvent, 'timestamp'>) => {
    setEvents(prev => [{
      ...event,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 20)) // Keep last 20 events
  }

  const testJWT = async () => {
    try {
      const token = await getToken()
      if (token) {
        const [, payload] = token.split('.')
        const decoded = JSON.parse(atob(payload))
        setJwtInfo({
          hasRole: !!decoded.role,
          role: decoded.role,
          hasAud: !!decoded.aud,
          aud: decoded.aud,
          hasOrgId: !!(decoded.o?.id || decoded.org_id),
          orgId: decoded.o?.id || decoded.org_id,
          issuer: decoded.iss,
          expires: new Date(decoded.exp * 1000).toLocaleString(),
          raw: `${token.substring(0, 50)}...`
        })
        addEvent({ 
          channel: 'jwt', 
          event: 'success', 
          payload: 'JWT decoded successfully' 
        })
      } else {
        addEvent({ 
          channel: 'jwt', 
          event: 'error', 
          error: 'No token received from Clerk' 
        })
      }
    } catch (error) {
      addEvent({ 
        channel: 'jwt', 
        event: 'error', 
        error: error instanceof Error ? error.message : 'JWT decode failed' 
      })
    }
  }

  const testRealtimeConnections = async () => {
    setTesting(true)
    setEvents([])
    
    try {
      // Test 1: JWT verification
      await testJWT()

      // Test 2: Anonymous realtime connection
      addEvent({ channel: 'test', event: 'info', payload: 'Testing anonymous connection...' })
      
      const anonSupabase = createSupabaseClient()
      const anonChannel = anonSupabase
        .channel('debug-anon-test')
        .subscribe((status) => {
          addEvent({ 
            channel: 'anonymous', 
            event: 'status', 
            status: status 
          })
        })

      // Test 3: Authenticated realtime connection
      if (supabase) {
        addEvent({ channel: 'test', event: 'info', payload: 'Testing authenticated connection...' })
        
        const authChannel = supabase
          .channel('debug-auth-test')
          .subscribe((status) => {
            addEvent({ 
              channel: 'authenticated', 
              event: 'status', 
              status: status 
            })
          })

        // Test 4: Database access with authenticated client
        if (businessId) {
          addEvent({ channel: 'test', event: 'info', payload: 'Testing database access...' })
          
          const { data, error } = await supabase
            .from('Booking')
            .select('id, status, businessId')
            .eq('businessId', businessId)
            .limit(1)
          
          if (error) {
            addEvent({ 
              channel: 'database', 
              event: 'error', 
              error: `Database access failed: ${error.message}` 
            })
          } else {
            addEvent({ 
              channel: 'database', 
              event: 'success', 
              payload: `Database access successful. Found ${data?.length || 0} bookings` 
            })
          }

          // Test 5: Realtime subscription to actual table
          addEvent({ channel: 'test', event: 'info', payload: 'Testing realtime subscription...' })
          
          const realtimeChannel = supabase
            .channel(`debug-booking-${businessId}`)
            .on(
              'postgres_changes',
              { 
                event: '*', 
                schema: 'public', 
                table: 'Booking',
                filter: `businessId=eq.${businessId}`
              },
              (payload) => {
                addEvent({ 
                  channel: 'realtime', 
                  event: 'postgres_change', 
                  payload: `Received ${payload.eventType} event for booking` 
                })
              }
            )
            .subscribe((status) => {
              addEvent({ 
                channel: 'realtime', 
                event: 'status', 
                status: status 
              })
            })

          // Clean up after 10 seconds
          setTimeout(() => {
            anonChannel.unsubscribe()
            authChannel.unsubscribe()
            realtimeChannel.unsubscribe()
            setTesting(false)
          }, 10000)
        } else {
          addEvent({ 
            channel: 'test', 
            event: 'warning', 
            payload: 'No businessId provided, skipping database tests' 
          })
          setTimeout(() => {
            anonChannel.unsubscribe()
            authChannel.unsubscribe()
            setTesting(false)
          }, 5000)
        }
      } else {
        addEvent({ 
          channel: 'authenticated', 
          event: 'error', 
          error: 'No authenticated Supabase client available' 
        })
        setTimeout(() => {
          anonChannel.unsubscribe()
          setTesting(false)
        }, 5000)
      }

    } catch (error) {
      addEvent({ 
        channel: 'test', 
        event: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      setTesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Realtime Connection Debugger</CardTitle>
          <CardDescription>
            Test anonymous and authenticated realtime connections
            {businessId && ` for business: ${businessId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={testRealtimeConnections}
              disabled={testing}
            >
              {testing ? 'Testing...' : 'Test Realtime Connections'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setEvents([])}
            >
              Clear Events
            </Button>
          </div>

          {/* JWT Info */}
          {jwtInfo && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <h4 className="font-medium">JWT Analysis</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Has Role: <Badge variant={jwtInfo.hasRole ? "default" : "destructive"}>{jwtInfo.hasRole ? 'Yes' : 'No'}</Badge></div>
                <div>Role: <code>{jwtInfo.role || 'None'}</code></div>
                <div>Has Aud: <Badge variant={jwtInfo.hasAud ? "default" : "destructive"}>{jwtInfo.hasAud ? 'Yes' : 'No'}</Badge></div>
                <div>Aud: <code>{jwtInfo.aud || 'None'}</code></div>
                <div>Org ID: <code>{jwtInfo.orgId || 'None'}</code></div>
                <div>Expires: <code>{jwtInfo.expires}</code></div>
              </div>
            </div>
          )}

          {/* Events */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events yet. Click &quot;Test Realtime Connections&quot; to start.</p>
            ) : (
              events.map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-white border rounded text-sm">
                  <span className="text-gray-500 font-mono">{event.timestamp}</span>
                  <Badge variant="outline">{event.channel}</Badge>
                  <span className="font-medium">{event.event}</span>
                  {event.status && <Badge variant={event.status === 'SUBSCRIBED' ? 'default' : 'secondary'}>{event.status}</Badge>}
                  {event.error && <span className="text-red-600">{event.error}</span>}
                  {event.payload && (
                    <span className="text-blue-600">
                      {String(typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload))}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 