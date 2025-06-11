import { createClient } from '@supabase/supabase-js';
import { expect, test } from 'vitest';
import 'dotenv/config';

test('Booking realtime smoke', async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const events: string[] = [];
  const businessId = 'cmb5lnorg000bcvbcwbpxii0p'; // <-- Replace with a real businessId for your test DB

  const channel = supabase
    .channel('test-booking')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Booking',
      filter: `business_id=eq.${businessId}`,
    }, (payload) => {
      events.push(payload.eventType);
    })
    .subscribe();

  // Insert, update, delete
  const { data: inserted } = await supabase.from('Booking').insert({ business_id: businessId, status: 'HOLD', event_date: new Date().toISOString(), start_time: '10:00', end_time: '11:00', total_amount: 0 }).select().single();
  await supabase.from('Booking').update({ status: 'CONFIRMED' }).eq('id', inserted.id);
  await supabase.from('Booking').delete().eq('id', inserted.id);

  // Wait for events
  await new Promise((resolve) => setTimeout(resolve, 5000));
  channel.unsubscribe();

  expect(events).toEqual(expect.arrayContaining(['INSERT', 'UPDATE', 'DELETE']));
}); 