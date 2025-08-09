# Real-time Booking Updates

This document explains how real-time updates work for the booking list using Supabase realtime.

## Overview

The booking list component automatically updates when:
- New bookings are created
- Booking statuses change (HOLD → PENDING → CONFIRMED → COMPLETED, etc.)
- Waiver statuses change (PENDING → SIGNED, etc.)
- Bookings are cancelled or deleted

## Implementation

### Components Updated
- `app/dashboard/[businessId]/bookings/_components/bookings-list.tsx`
- `app/dashboard/[businessId]/bookings/_components/bookings-calendar-view.tsx`
- `app/api/businesses/[businessId]/bookings/[bookingId]/route.ts`

### How It Works

1. **Supabase Realtime Subscriptions**: When the booking list component mounts, it creates two Supabase realtime subscriptions:
   - **Bookings Channel**: Listens for INSERT, UPDATE, DELETE events on the `Booking` table, filtered by `businessId`
   - **Waivers Channel**: Listens for UPDATE events on the `Waiver` table

2. **Event Handling**:
   - **New Bookings (INSERT)**: Fetches complete booking data and adds to the list with a toast notification
   - **Booking Updates (UPDATE)**: Refreshes the booking data and shows status change notifications
   - **Booking Deletion (DELETE)**: Removes the booking from the list
   - **Waiver Updates**: Updates the waiver status and `hasSignedWaiver` flag for affected bookings

3. **Data Synchronization**: When realtime events are received, the component:
   - Calls the individual booking API endpoint to get complete data with relations
   - Updates the local state with the fresh data
   - Shows appropriate toast notifications to the user

### Key Features

- **Business-Scoped**: Only receives updates for bookings belonging to the current business
- **Authentication**: Uses Clerk session tokens for Supabase authentication
- **Error Handling**: Logs connection issues and shows user-friendly error messages
- **Performance**: Efficient updates that only refresh affected bookings
- **UI Feedback**: Toast notifications for important changes (new bookings, status changes, signed waivers)

### Configuration Required

To use realtime updates, ensure:

1. **Supabase Realtime is enabled** for the tables:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE "Booking";
   ALTER PUBLICATION supabase_realtime ADD TABLE "Waiver";
   ```

2. **Row Level Security (RLS)** is properly configured to filter data by business access

3. **Clerk Integration** is set up with Supabase for authentication

### Debugging

- Check browser console for `[Realtime]` logs
- Monitor subscription status (should show 'SUBSCRIBED')
- Verify network connectivity to Supabase realtime endpoint
- Test with the included `test-realtime.js` script

### Benefits

- **Instant Updates**: No need to refresh the page to see new bookings or status changes
- **Better UX**: Users see changes immediately when bookings are made through other channels
- **Team Collaboration**: Multiple team members can see updates in real-time
- **Status Tracking**: Immediate notification when waivers are signed or bookings change status 