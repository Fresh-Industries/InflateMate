'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface DebugResult {
  success: boolean
  data?: any
  error?: string
}

export default function DebugClerkSupabase() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [jwtPayload, setJwtPayload] = useState<any>(null)
  const [supabaseTest, setSupabaseTest] = useState<DebugResult | null>(null)
  const [rlsTest, setRlsTest] = useState<DebugResult | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<string>('Not tested')
  const [businessData, setBusinessData] = useState<any>(null)
  const [loading, setLoading] = useState('')

  // Auto-test JWT on mount
  useEffect(() => {
    if (isSignedIn) {
      testJwtStructure()
    }
  }, [isSignedIn])

  const testJwtStructure = async () => {
    setLoading('jwt')
    try {
      const token = await auth().getToken()
      if (token) {
        // Decode JWT
        const [header, payload, signature] = token.split('.')
        const decodedHeader = JSON.parse(atob(header))
        const decodedPayload = JSON.parse(atob(payload))
        
        setJwtPayload({
          header: decodedHeader,
          payload: decodedPayload,
          raw: token.substring(0, 50) + '...',
          hasRole: !!decodedPayload.role,
          hasAud: !!decodedPayload.aud,
          hasOrgId: !!(decodedPayload.o?.id || decodedPayload.org_id),
          orgId: decodedPayload.o?.id || decodedPayload.org_id,
          role: decodedPayload.role,
          aud: decodedPayload.aud,
          iss: decodedPayload.iss
        })
      } else {
        setJwtPayload({ error: 'No token received' })
      }
    } catch (error) {
      setJwtPayload({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading('')
  }

  const testSupabaseConnection = async () => {
    setLoading('supabase')
    try {
      const supabase = createSupabaseClient()
      
      // Test basic query
      const { data, error } = await supabase
        .from('Organization')
        .select('*')
        .limit(1)
      
      if (error) {
        setSupabaseTest({ success: false, error: error.message })
      } else {
        setSupabaseTest({ success: true, data: { rowCount: data?.length || 0, sample: data?.[0] } })
      }
    } catch (error) {
      setSupabaseTest({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading('')
  }

  const testRLSPolicies = async () => {
    setLoading('rls')
    try {
      const supabase = createSupabaseClient()
      
      // Test the debug function we created
      const { data, error } = await supabase.rpc('debug_clerk_auth')
      
      if (error) {
        setRlsTest({ success: false, error: error.message })
      } else {
        setRlsTest({ success: true, data })
      }
    } catch (error) {
      setRlsTest({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading('')
  }

  const testRealtime = async () => {
    setLoading('realtime')
    setRealtimeStatus('Testing...')
    
    try {
      const supabase = createSupabaseClient()
      
      // Test multiple channels to see which ones work
      const results: string[] = []
      
      // Test 1: Basic presence channel (no RLS)
      const presenceChannel = supabase
        .channel('debug-presence')
        .on('presence', { event: 'sync' }, () => {
          results.push('✅ Presence channel works')
        })
        .subscribe((status) => {
          results.push(`Presence: ${status}`)
          setRealtimeStatus(results.join(' | '))
        })
      
      // Test 2: Postgres changes without filter (should work if RLS is correct)
      const basicChannel = supabase
        .channel('debug-basic')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'Organization'
        }, (payload) => {
          results.push(`✅ Org event: ${payload.eventType}`)
          setRealtimeStatus(results.join(' | '))
        })
        .subscribe((status) => {
          results.push(`Basic: ${status}`)
          setRealtimeStatus(results.join(' | '))
        })
      
      // Test 3: Booking table (the problematic one)
      const bookingChannel = supabase
        .channel('debug-booking')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'Booking'
        }, (payload) => {
          results.push(`✅ Booking event: ${payload.eventType}`)
          setRealtimeStatus(results.join(' | '))
        })
        .subscribe((status) => {
          results.push(`Booking: ${status}`)
          setRealtimeStatus(results.join(' | '))
          
          // If it closes, show the reason
          if (status === 'CLOSED') {
            results.push('❌ Booking channel closed!')
            setRealtimeStatus(results.join(' | '))
          }
        })
      
      // Test 4: Waiver table
      const waiverChannel = supabase
        .channel('debug-waiver')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'Waiver'
        }, (payload) => {
          results.push(`✅ Waiver event: ${payload.eventType}`)
          setRealtimeStatus(results.join(' | '))
        })
        .subscribe((status) => {
          results.push(`Waiver: ${status}`)
          setRealtimeStatus(results.join(' | '))
        })
      
      
    } catch (error) {
      setRealtimeStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    setLoading('')
  }

  const fetchBusinessData = async () => {
    setLoading('business')
    try {
      const response = await fetch('/api/me')
      const data = await response.json()
      setBusinessData(data)
    } catch (error) {
      setBusinessData({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading('')
  }

  const testDatabaseDirectly = async () => {
    setLoading('database')
    try {
      const supabase = createSupabaseClient()
      
      // Test multiple queries
      const [orgTest, businessTest, bookingTest] = await Promise.all([
        supabase.from('Organization').select('count').limit(1).single(),
        supabase.from('Business').select('count').limit(1).single(),
        supabase.from('Booking').select('count').limit(1).single()
      ])
      
      setRlsTest({
        success: true,
        data: {
          organization: orgTest.error ? `Error: ${orgTest.error.message}` : 'Success',
          business: businessTest.error ? `Error: ${businessTest.error.message}` : 'Success',
          booking: bookingTest.error ? `Error: ${bookingTest.error.message}` : 'Success'
        }
      })
    } catch (error) {
      setRlsTest({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading('')
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clerk + Supabase Debug Panel</h1>
        <Badge variant={isSignedIn ? "default" : "destructive"}>
          {isSignedIn ? 'Signed In' : 'Not Signed In'}
        </Badge>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Clerk User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>User ID: {user?.id || 'N/A'}</div>
            <div>Email: {user?.primaryEmailAddress?.emailAddress || 'N/A'}</div>
            <div>Org ID: {user?.organizationMemberships?.[0]?.organization?.id || 'N/A'}</div>
            <div>Org Role: {user?.organizationMemberships?.[0]?.role || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>

      {/* JWT Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            JWT Structure
            <Button 
              size="sm" 
              onClick={testJwtStructure}
              disabled={loading === 'jwt'}
            >
              {loading === 'jwt' ? 'Testing...' : 'Test JWT'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jwtPayload ? (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>Has Role Claim: <Badge variant={jwtPayload.hasRole ? "default" : "destructive"}>{jwtPayload.hasRole ? 'Yes' : 'No'}</Badge></div>
                <div>Role Value: <code>{jwtPayload.role || 'N/A'}</code></div>
                <div>Has Aud Claim: <Badge variant={jwtPayload.hasAud ? "default" : "destructive"}>{jwtPayload.hasAud ? 'Yes' : 'No'}</Badge></div>
                <div>Aud Value: <code>{jwtPayload.aud || 'N/A'}</code></div>
                <div>Has Org ID: <Badge variant={jwtPayload.hasOrgId ? "default" : "destructive"}>{jwtPayload.hasOrgId ? 'Yes' : 'No'}</Badge></div>
                <div>Org ID: <code>{jwtPayload.orgId || 'N/A'}</code></div>
              </div>
              <Separator />
              <div>
                <strong>Issuer:</strong> <code>{jwtPayload.iss}</code>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Full JWT Payload</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(jwtPayload.payload, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div>Click &quot;Test JWT&quot; to analyze token structure</div>
          )}
        </CardContent>
      </Card>

      {/* Supabase Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Supabase Connection
            <Button 
              size="sm" 
              onClick={testSupabaseConnection}
              disabled={loading === 'supabase'}
            >
              {loading === 'supabase' ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supabaseTest ? (
            <div>
              <Badge variant={supabaseTest.success ? "default" : "destructive"}>
                {supabaseTest.success ? 'Success' : 'Failed'}
              </Badge>
              {supabaseTest.error && (
                <div className="mt-2 text-red-600 text-sm">{supabaseTest.error}</div>
              )}
              {supabaseTest.data && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(supabaseTest.data, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div>Click &quot;Test Connection&quot; to verify Supabase access</div>
          )}
        </CardContent>
      </Card>

      {/* RLS Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            RLS Policies
            <Button 
              size="sm" 
              onClick={testRLSPolicies}
              disabled={loading === 'rls'}
            >
              {loading === 'rls' ? 'Testing...' : 'Test RLS'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={testDatabaseDirectly}
              disabled={loading === 'database'}
            >
              {loading === 'database' ? 'Testing...' : 'Test DB Access'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rlsTest ? (
            <div>
              <Badge variant={rlsTest.success ? "default" : "destructive"}>
                {rlsTest.success ? 'Success' : 'Failed'}
              </Badge>
              {rlsTest.error && (
                <div className="mt-2 text-red-600 text-sm">{rlsTest.error}</div>
              )}
              {rlsTest.data && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(rlsTest.data, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div>Click &quot;Test RLS&quot; to check Row Level Security policies</div>
          )}
        </CardContent>
      </Card>

      {/* Realtime Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Realtime Connection
            <Button 
              size="sm" 
              onClick={testRealtime}
              disabled={loading === 'realtime'}
            >
              {loading === 'realtime' ? 'Testing...' : 'Test Realtime'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Status: <code>{realtimeStatus}</code></div>
        </CardContent>
      </Card>

      {/* Business Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Business API Data
            <Button 
              size="sm" 
              onClick={fetchBusinessData}
              disabled={loading === 'business'}
            >
              {loading === 'business' ? 'Loading...' : 'Fetch Business'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businessData ? (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(businessData, null, 2)}
            </pre>
          ) : (
            <div>Click &quot;Fetch Business&quot; to load business data from API</div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test All</CardTitle>
          <CardDescription>Run all tests in sequence</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={async () => {
              await testJwtStructure()
              await testSupabaseConnection()
              await testRLSPolicies()
              await testRealtime()
              await fetchBusinessData()
            }}
            disabled={!!loading}
            className="w-full"
          >
            {loading ? `Testing ${loading}...` : 'Run All Tests'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 