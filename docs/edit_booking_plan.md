

### Step 3: Implement Logic for Adding Items to Confirmed Bookings (Frontend & Backend)

1.  **Frontend (`EditBookingForm.tsx`):**
    *   Implement logic to detect if the currently `selectedItems` in the form differ from the original `bookingDetails.bookingItems` when the booking `status` is `CONFIRMED`. This could involve comparing IDs and quantities.
    *   If the booking is `CONFIRMED` and items *have* changed (specifically, new items added or quantities increased), modify the primary action button (currently "Save Changes" for confirmed) to indicate a different action, e.g., "Update & Pay Difference".
    *   This button will call a modified handler (e.g., `handleUpdateAndPayDifference` or enhance `handleUpdateAndProceedToPayment`). This handler will prepare a payload including the `items` array (representing the *new* state of items) and potentially a new `intent` like `'prepare_for_payment_difference'`.
2.  **Backend (`app/api/businesses/[businessId]/bookings/[bookingId]/route.ts` PATCH or New Endpoint & `lib/updateBookingSafely.ts`):**
    *   **Backend PATCH Modification (Simplified):** Enhance the existing PATCH handler. If the booking is `CONFIRMED` AND the payload includes an `items` array AND an `intent` like `'prepare_for_payment_difference'`:
        *   Fetch the existing booking and its items.
        *   Compare the incoming `items` list with the existing `bookingItems` to identify *new* items being added. (Removing/reducing quantity of existing items in a confirmed booking is complex and might be out of scope for this step, focus on additions).
        *   Perform availability checks ONLY for the newly added items.
        *   Calculate the price *difference* based on the newly added items. Apply tax and consider existing coupon if applicable.
        *   Add the new `BookingItem` records to the database (e.g., with status `PENDING_PAYMENT_ADDITION`).
        *   Initiate a new Stripe PaymentIntent for the calculated *difference amount*. The metadata must link back to the original booking ID and indicate it's a difference payment.
        *   Return the `clientSecret` for this difference payment.
    *   **`lib/updateBookingSafely.ts` Adjustments:** Modify this function to handle the 'prepare_for_payment_difference' intent for `CONFIRMED` bookings. This involves selective item insertion/status update and difference amount calculation.
3.  **Stripe Webhook Handling (`app/api/webhook/stripe/route.ts`):**
    *   Modify the `handlePaymentIntentSucceeded` handler.
    *   Check the metadata of the successful PaymentIntent to identify if it's a 'difference' payment (e.g., using a metadata key like `paymentType: 'difference_addition'`).
    *   If it's a difference payment, find the original booking using the `prismaBookingId` metadata.
    *   Update the status of the `BookingItem`s that were added with the `PENDING_PAYMENT_ADDITION` status to `CONFIRMED`.
    *   Update the main booking's `totalAmount` by adding the amount of this difference payment.
    *   Trigger any post-confirmation steps relevant to the updated booking (e.g., sending an updated summary, though potentially not a full waiver re-send unless participants changed significantly).

### Step 4: Refine UI Button States and UX

1.  **Loading States:** Ensure all buttons accurately reflect loading states (`isSavingDraft`, `isProcessingQuote`, `isProcessingPayment`).
2.  **Button Text:** Update button text dynamically (e.g., "Save Changes", "Update & Pay", "Update & Pay Difference").
3.  **Disable/Enable:** Correctly disable buttons based on form validity, loading states, and booking status/item changes.
4.  **User Feedback:** Provide toasts or other feedback for successful saves, quote sends, payment initiations, and errors.
5.  **Payment Form Integration:** If "Update & Pay Difference" is clicked, show the payment form component for the difference amount, similar to the initial payment flow, passing the new client secret.

## Implementation Order

1.  Complete Step 1 (Relocate Buttons).
2.  Implement Step 2 (Refine "Save Changes" for Confirmed - Frontend & Backend). Test saving non-item changes on confirmed bookings.
3.  Implement Step 3 (Add Items to Confirmed Bookings - Frontend & Backend, including webhook updates). Test adding items and paying the difference.
4.  Implement Step 4 (Refine UI/UX).

This plan provides a structured approach to tackling this complex feature. We'll address these steps sequentially, starting with the UI refactoring.

## Implementation Progress

### Completed Steps

#### Step 1: Relocate Action Buttons ✅
- Moved buttons from EditSummaryCard.tsx to EditBookingForm.tsx
- Added persistent buttons at the bottom of EditBookingForm.tsx
- Implemented conditional rendering based on booking status
- Added clear indication that buttons are always visible

#### Step 2: Refine "Save Changes" for Confirmed Bookings ✅
- Frontend: Modified handleSaveDraft to create a simplified payload without items for CONFIRMED bookings
- Backend: Modified PATCH handler to directly update booking and customer fields for CONFIRMED bookings without items
- Backend: Added safeguard in updateBookingSafely.ts to prevent attempting to update items for CONFIRMED bookings without proper handling

### Next Steps

- Implement Step 3: Adding items to confirmed bookings
- Implement Step 4: Refine UI/UX 