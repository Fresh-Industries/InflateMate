# Realtime Booking Updates Debugging Guide

This guide helps debug realtime updates for booking status changes (HOLD → PENDING → CONFIRMED) and waiver updates.

## Problem Description

The booking list should update in real-time when:
- New bookings are created (HOLD status)
- Bookings transition from HOLD → PENDING
- Bookings transition from PENDING → CONFIRMED 
- Waivers are signed

Currently, only undefined → CONFIRMED transitions are working properly.

## Architecture Overview

```
Frontend (BookingsList) 
↓ Supabase Realtime Subscription
↓ RLS Policies (filters by organization)  
↓ Database Events (INSERT, UPDATE, DELETE)
↓ Booking/Waiver table changes
```

## Debugging Steps

### 1. Test Realtime Connection

Open browser console and run:
```javascript
window.testRealtime()
```

This will:
- Verify Clerk token is available
- Test Supabase connection
- Verify RLS is working
- Show subscription status

### 2. Check JWT Claims

In Supabase SQL Editor, run:
```sql
SELECT debug_jwt_claims();
```

Expected output should include:
- `has_jwt: true`
- `selected_org_id: "org_xxxxx"` (your Clerk org ID)
- `email: "your@email.com"`

### 3. Verify RLS Policies

```sql
-- Should return your bookings
SELECT id, status, "businessId" FROM "public"."Booking" LIMIT 5;

-- Should return your organization
SELECT id, "clerkOrgId", name FROM "public"."Organization";
```

### 4. Check Realtime Publication

```sql
-- Verify tables are published
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

Should include:
- `public.Booking`
- `public.Waiver`
- `public.BookingItem`

### 5. Monitor Console Logs

Look for these log patterns:

**Successful Connection:**
```
[Realtime] Setting up subscriptions for business: cmb5lnorg000bcvbcwbpxii0p
[Realtime] Bookings subscription status: SUBSCRIBED
[Realtime] Test function available: window.testRealtime()
```

**Status Change Detection:**
```
[DEBUG] All booking change detected: {
  eventType: "UPDATE",
  bookingId: "cmbh7je73000jya2zkqihic1k", 
  businessId: "cmb5lnorg000bcvbcwbpxii0p",
  status: "PENDING",
  isOurBusiness: true
}
[Realtime] Processing booking change: {
  eventType: "UPDATE",
  oldStatus: "HOLD",
  newStatus: "PENDING"
}
```

### 6. Test Status Transitions

Create a test booking and watch console:

1. **Create HOLD** (via booking form):
   - Should see INSERT event
   - Status should be "HOLD"

2. **Update to PENDING** (via edit/payment):
   - Should see UPDATE event  
   - oldStatus: "HOLD", newStatus: "PENDING"

3. **Confirm to CONFIRMED** (via payment):
   - Should see UPDATE event
   - oldStatus: "PENDING", newStatus: "CONFIRMED"

## Common Issues

### Issue 1: No Realtime Events Received

**Symptoms:** No logs showing `[Realtime] Booking change received`

**Causes:**
1. Authentication failure (no JWT token)
2. RLS blocking access
3. Subscription not filtering correctly

**Solutions:**
1. Run `window.testRealtime()` to verify auth
2. Check JWT claims with `SELECT debug_jwt_claims()`
3. Run the `sql/fix_realtime_rls.sql` script

### Issue 2: Events Received But Not Processed

**Symptoms:** Logs show events but UI doesn't update

**Causes:**
1. `fetchCompleteBookingData` failing
2. Business ID mismatch
3. Status not changing in database

**Solutions:**
1. Check for API errors in Network tab
2. Verify business ID matches in debug logs
3. Check database directly for status changes

### Issue 3: Only CONFIRMED Updates Work

**Symptoms:** HOLD → PENDING transitions ignored

**Causes:**
1. Webhook updating differently than manual updates
2. Different code paths for different status changes
3. Missing businessId in some updates

**Solutions:**
1. Compare manual vs webhook update patterns
2. Check if all updates include businessId
3. Add more logging to identify differences

## Configuration Files

### Required Clerk JWT Template
File: `docs/clerk-jwt-template-fixed.json`

Ensure this is configured in Clerk Dashboard:
```json
{
  "user_metadata": {
    "organization_id": "{{org.id}}"
  }
}
```

### Required RLS Policies
File: `sql/fix_realtime_rls.sql`

Run this script to ensure proper RLS setup.

## Testing Checklist

- [ ] `window.testRealtime()` shows successful connection
- [ ] `debug_jwt_claims()` returns valid org ID  
- [ ] Manual booking creation shows INSERT event
- [ ] Manual status updates show UPDATE events
- [ ] Webhook status updates show UPDATE events
- [ ] Status changes trigger toast notifications
- [ ] Waiver signature updates work

## Monitoring Commands

```bash
# Watch server logs for booking updates
tail -f logs/server.log | grep "Booking\|booking"

# Watch Supabase logs (if available)
supabase logs --follow

# Monitor network requests
# Open DevTools > Network > Filter by "supabase"
```

## Emergency Fallback

If realtime still doesn't work, add polling fallback:

```javascript
// In BookingsList component
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 30000); // Poll every 30 seconds

  return () => clearInterval(interval);
}, [businessId]);
```

This ensures updates are eventually reflected even if realtime fails. 