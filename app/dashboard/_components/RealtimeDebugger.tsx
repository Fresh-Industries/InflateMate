'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, X, Wifi, WifiOff } from 'lucide-react';

interface RealtimeEvent {
  timestamp: Date;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'Booking' | 'Waiver' | 'Payment';
  bookingId: string;
  status?: string;
  data: any;
  source: string;
}

interface WebhookEvent {
  timestamp: Date;
  type: string;
  bookingId?: string;
  status: 'received' | 'processing' | 'completed' | 'failed';
  details: string;
}

interface ConnectionEvent {
  timestamp: Date;
  channel: string;
  status: 'CONNECTING' | 'SUBSCRIBED' | 'CLOSED' | 'ERROR';
  details?: string;
}

export default function RealtimeDebugger({ businessId }: { businessId: string }) {
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const eventCountRef = useRef(0);

  // Monitor realtime events by overriding console.log temporarily
  useEffect(() => {
    const originalLog = console.log;
    
    console.log = (...args) => {
      const message = args.join(' ');
      
      // Track realtime booking events
      if (message.includes('[Realtime] Booking event received:')) {
        const eventType = args[2] as 'INSERT' | 'UPDATE' | 'DELETE';
        const data = args[3];
        
        setRealtimeEvents(prev => [{
          timestamp: new Date(),
          type: eventType,
          table: 'Booking',
          bookingId: data?.id || 'unknown',
          status: data?.status,
          data: null, // Don't store the actual data to avoid rendering issues
          source: 'Supabase Realtime'
        }, ...prev.slice(0, 19)]);
        
        eventCountRef.current++;
      }
      
      // Track channel status
      if (message.includes('[Realtime] Channel') && message.includes('status:')) {
        const channel = args[1]?.split(' ')[2] || 'unknown';
        const status = args[2] as any;
        
        setConnectionEvents(prev => [{
          timestamp: new Date(),
          channel,
          status,
          details: message
        }, ...prev.slice(0, 9)]);
        
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CLOSED' || status === 'ERROR') {
          setConnectionStatus('error');
        }
      }
      
      // Track webhook events (if we can detect them)
      if (message.includes('PaymentIntent succeeded:') || message.includes('Booking updated successfully:')) {
        setWebhookEvents(prev => [{
          timestamp: new Date(),
          type: message.includes('PaymentIntent') ? 'payment_intent.succeeded' : 'booking_update',
          bookingId: args[1] || 'unknown',
          status: 'completed',
          details: message
        }, ...prev.slice(0, 9)]);
      }
      
      // Track Supabase realtime update attempts
      if (message.includes('Booking PENDING->CONFIRMED: real-time update sent via Supabase')) {
        setWebhookEvents(prev => [{
          timestamp: new Date(),
          type: 'supabase_manual_update',
          bookingId: args[args.length - 1] || 'unknown',
          status: 'completed',
          details: 'Manual Supabase update sent from webhook'
        }, ...prev.slice(0, 9)]);
      }
      
      if (message.includes('Supabase real-time update failed:')) {
        setWebhookEvents(prev => [{
          timestamp: new Date(),
          type: 'supabase_update_failed',
          status: 'failed',
          details: `Supabase update failed: ${args[1]?.message || 'unknown error'}`
        }, ...prev.slice(0, 9)]);
      }
      
      // Call original console.log
      originalLog.apply(console, args);
    };
    
    return () => {
      console.log = originalLog;
    };
  }, []);

  // Simulate webhook events for testing
  const simulateWebhookEvent = () => {
    setWebhookEvents(prev => [{
      timestamp: new Date(),
      type: 'test_webhook',
      bookingId: 'test-booking-id',
      status: 'completed',
      details: 'Simulated webhook event for testing'
    }, ...prev.slice(0, 9)]);
  };

  const clearEvents = () => {
    setRealtimeEvents([]);
    setWebhookEvents([]);
    setConnectionEvents([]);
    eventCountRef.current = 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBSCRIBED':
      case 'connected':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CLOSED':
      case 'ERROR':
      case 'error':
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'CONNECTING':
      case 'connecting':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
        variant="outline"
      >
        <Wifi className="h-4 w-4 mr-2" />
        Show Debugger ({eventCountRef.current})
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[80vh] overflow-hidden z-50 bg-white shadow-lg border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getStatusIcon(connectionStatus)}
            Realtime Debugger
            <Badge variant="outline" className="text-xs">
              {eventCountRef.current} events
            </Badge>
          </CardTitle>
          <div className="flex gap-1">
            <Button
              onClick={simulateWebhookEvent}
              size="sm"
              variant="outline"
              className="text-xs h-7"
            >
              Test
            </Button>
            <Button
              onClick={clearEvents}
              size="sm"
              variant="outline"
              className="text-xs h-7"
            >
              Clear
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 text-xs overflow-y-auto max-h-[60vh]">
        {/* Connection Status */}
        <div>
          <h4 className="font-medium mb-1">Connection Status</h4>
          <div className="space-y-1">
            {connectionEvents.slice(0, 3).map((event, i) => (
              <div key={i} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
                {getStatusIcon(event.status)}
                <span className="flex-1 truncate">{event.channel}</span>
                <span className="text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Realtime Events */}
        <div>
          <h4 className="font-medium mb-1">Realtime Events ({realtimeEvents.length})</h4>
          <div className="space-y-1">
            {realtimeEvents.slice(0, 5).map((event, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={event.type === 'INSERT' ? 'default' : event.type === 'UPDATE' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {event.type}
                  </Badge>
                  <span className="text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                </div>
                                 <div className="text-xs">
                   <div>Booking: {event.bookingId?.slice(0, 8)}...</div>
                   {event.status && <div>Status: {event.status}</div>}
                   <div>Source: {event.source}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Webhook Events */}
        <div>
          <h4 className="font-medium mb-1">Webhook Events ({webhookEvents.length})</h4>
          <div className="space-y-1">
            {webhookEvents.slice(0, 5).map((event, i) => (
              <div key={i} className="p-2 bg-blue-50 rounded space-y-1">
                <div className="flex items-center justify-between">
                  {getStatusIcon(event.status)}
                  <span className="text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                </div>
                                 <div className="text-xs">
                   <div>Type: {event.type}</div>
                   {event.bookingId && <div>Booking: {event.bookingId?.slice(0, 8)}...</div>}
                   <div className="truncate">{event.details}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        <Separator />
                 <div className="text-xs text-gray-600">
           <div>Business: {businessId?.slice(0, 8)}...</div>
           <div>Status: {connectionStatus}</div>
           <div>Total Events: {eventCountRef.current}</div>
         </div>
      </CardContent>
    </Card>
  );
} 