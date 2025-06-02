'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { useSession } from '@clerk/nextjs';
import { createSupabaseClient } from '@/lib/supabaseClient';

interface NotificationDebugProps {
  businessId: string | null;
}

export default function NotificationDebug({ businessId }: NotificationDebugProps) {
  const { session, isLoaded } = useSession();
  const { notifications } = useNotifications(businessId);
  const [isCreating, setIsCreating] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [result, ...prev.slice(0, 4)]);
  };

  const testCreateBooking = async () => {
    if (!businessId || !session) return;
    
    setIsCreating(true);
    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          customerPhone: '555-0123',
          eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          inventoryIds: [],
          notes: 'Test booking for notifications',
        }),
      });

      if (response.ok) {
        console.log('✅ Test booking created successfully');
      } else {
        console.error('❌ Failed to create test booking:', await response.text());
      }
    } catch (error) {
      console.error('❌ Error creating test booking:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const testSupabaseAuth = async () => {
    if (!session || !isLoaded) {
      console.log('❌ No session available');
      return;
    }

    console.log('Testing authenticated Supabase...');
    const supabase = createSupabaseClient(session);
    
    try {
      // Test a simple query
      const { data, error } = await supabase
        .from('Booking')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Auth query error:', error.message);
      } else {
        console.log('✅ Authenticated query successful:', data);
      }
    } catch (error) {
      console.error('❌ Supabase test failed:', error);
    }
  };

  const testClerkToken = async () => {
    try {
      addTestResult('Testing Clerk JWT token...');
      
      // Get raw Clerk session token (NO template for Third-Party Auth)
      const token = await session?.getToken();
      if (!token) {
        addTestResult('❌ No Clerk token available');
        return;
      }
      
      addTestResult('✅ Clerk token obtained');
      
      // Decode token to see claims (for debugging only)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        addTestResult(`✅ Org ID in token: ${payload.org_id || payload.o?.id || 'Not found'}`);
        addTestResult(`✅ User ID: ${payload.sub || 'Not found'}`);
      } catch (e) {
        addTestResult('⚠️ Could not decode token');
      }
    } catch (error) {
      addTestResult(`❌ Token error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const testSupabaseConnection = async () => {
    try {
      addTestResult('Testing authenticated Supabase...');
      
      if (!session || !isLoaded) {
        addTestResult('❌ No authenticated Supabase client');
        return;
      }
      
      // Test 1: Basic connection with authenticated client
      const supabase = createSupabaseClient(session);
      const { data, error } = await supabase.from('Booking').select('count').limit(1);
      if (error) {
        addTestResult(`❌ Auth query error: ${error.message}`);
        return;
      }
      addTestResult('✅ Authenticated connection successful');

      // Test 2: Can we read bookings for this business?
      const { data: bookings, error: bookingError } = await supabase
        .from('Booking')
        .select('id, businessId, status, createdAt')
        .eq('businessId', businessId)
        .limit(5);
      
      if (bookingError) {
        addTestResult(`❌ Booking query error: ${bookingError.message}`);
        return;
      }
      addTestResult(`✅ Found ${bookings?.length || 0} bookings for business`);

      // Test 3: Test real-time subscription manually
      const testChannel = supabase
        .channel('manual-test-auth')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'Booking' },
          (payload) => {
            addTestResult(`🔔 Real-time event: ${payload.eventType} on Booking`);
            console.log('Manual test received:', payload);
          }
        )
        .subscribe((status) => {
          addTestResult(`📡 Manual test channel: ${status}`);
        });

      // Clean up after 10 seconds
      setTimeout(() => {
        supabase.removeChannel(testChannel);
        addTestResult('🧹 Cleaned up test channel');
      }, 10000);

    } catch (error) {
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testRealTimeManual = async () => {
    try {
      addTestResult('Testing authenticated real-time insert...');
      
      if (!session || !isLoaded) {
        addTestResult('❌ No authenticated Supabase client');
        return;
      }
      
      // Insert directly via authenticated Supabase
      const supabase = createSupabaseClient(session);
      const { data, error } = await supabase
        .from('Booking')
        .insert({
          businessId: businessId,
          customerId: 'test-customer-id',
          eventDate: new Date().toISOString(),
          startTime: '10:00:00',
          endTime: '14:00:00',
          totalAmount: 100,
          status: 'PENDING'
        })
        .select();

      if (error) {
        addTestResult(`❌ Direct insert failed: ${error.message}`);
      } else {
        addTestResult(`✅ Direct insert successful: ${data?.[0]?.id}`);
      }
    } catch (error) {
      addTestResult(`❌ Manual test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testWaiverUpdate = async () => {
    if (!session || !isLoaded || !businessId) {
      console.log('❌ Not ready for waiver test')
      return
    }

    console.log('Testing waiver update...')
    const supabase = createSupabaseClient(session)
    
    try {
      // First, let's see what waivers exist
      const { data: waivers, error: fetchError } = await supabase
        .from('Waiver')
        .select('*')
        .eq('businessId', businessId)
        .limit(1)

      if (fetchError) {
        console.error('❌ Error fetching waivers:', fetchError.message)
        return
      }

      console.log('📋 Existing waivers:', waivers)

      if (waivers && waivers.length > 0) {
        // Update an existing waiver to SIGNED status
        const waiver = waivers[0]
        console.log('Updating waiver:', waiver.id, 'from status:', waiver.status)
        
        const { data: updated, error: updateError } = await supabase
          .from('Waiver')
          .update({ 
            status: 'SIGNED',
            updatedAt: new Date().toISOString()
          })
          .eq('id', waiver.id)
          .select()

        if (updateError) {
          console.error('❌ Error updating waiver:', updateError.message)
        } else {
          console.log('✅ Waiver updated successfully:', updated)
        }
      } else {
        // Create a test waiver if none exist
        console.log('Creating test waiver...')
        const { data: created, error: createError } = await supabase
          .from('Waiver')
          .insert({
            businessId: businessId,
            status: 'SIGNED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()

        if (createError) {
          console.error('❌ Error creating waiver:', createError.message)
        } else {
          console.log('✅ Test waiver created:', created)
        }
      }
    } catch (error) {
      console.error('❌ Waiver test failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth Notification Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Business ID: {businessId || 'Not found'}
          </p>
          <p className="text-sm text-muted-foreground">
            Active Notifications: {notifications.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Clerk Session: {session ? 'Ready' : 'Not available'}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={testClerkToken} 
            variant="outline"
            size="sm"
            className="w-full"
          >
            Test Clerk JWT
          </Button>
          
          <Button 
            onClick={testSupabaseAuth} 
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!session || !isLoaded}
          >
            Test Auth Connection
          </Button>
          
          <Button 
            onClick={testCreateBooking} 
            disabled={isCreating}
            size="sm"
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Test Booking (API)'}
          </Button>

          <Button 
            onClick={testRealTimeManual} 
            variant="secondary"
            size="sm"
            className="w-full"
            disabled={!session || !isLoaded}
          >
            Test Auth Insert
          </Button>

          <Button 
            onClick={testWaiverUpdate} 
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!session || !isLoaded}
          >
            Test Waiver Update
          </Button>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Test Results:</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {testResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tests run yet</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-xs p-2 bg-muted rounded font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Recent Notifications:</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            notifications.slice(0, 2).map((notif) => (
              <div key={notif.id} className="text-xs p-2 bg-muted rounded">
                <p className="font-medium">{notif.title}</p>
                <p>{notif.description}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 