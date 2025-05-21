## Phase 3: Testing and Refinement

**Prompt for AI Coder (General Testing):**

```
Thoroughly test the following scenarios for the booking edit flow:
1.  Editing a 'HOLD' booking:
    *   Change items, then "Update & Send Quote". Verify booking becomes 'PENDING', quote is sent, expiry updated.
    *   Change customer info, then "Update & Proceed to Payment". Verify booking becomes 'PENDING', payment form appears, expiry updated.
2.  Editing a 'PENDING' booking (previously quoted):
    *   "Save Changes": Modify special instructions. Verify saved, status PENDING, expiry refreshed.
    *   "Update & Send Quote": Change items. Verify new quote sent, old one handled, expiry updated.
    *   "Update & Proceed to Payment": Verify payment form appears, uses latest details.
3.  Editing a 'PENDING' booking (payment intent existed but not paid):
    *   "Save Changes": Similar to above.
    *   "Update & Proceed to Payment": Verify new payment intent can be generated if the old one is no longer valid or if details changed significantly.
4.  Attempting to edit a 'CONFIRMED', 'COMPLETED', 'CANCELLED', or 'EXPIRED' booking: Verify UI elements are disabled and actions are blocked.
5.  Coupon application/removal during edits and ensuring it reflects in quote/payment.
6.  Expiration behavior:
    *   Let a 'HOLD' booking expire from the edit screen. Verify UI locks.
    *   Let a 'PENDING' booking's payment window expire from the edit screen.
7.  Edge cases: Removing all items and trying to save/quote/pay.
``` 