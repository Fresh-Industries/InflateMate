# API Security Review Summary

This document outlines potential security vulnerabilities and areas for improvement found during a review of the API routes in `/app/api`.

**Critical Issues:** These should be addressed with high priority.

*   **Missing Authorization in Stripe Connect (`/api/stripe/connect/route.ts`)**:
    *   **Issue:** The endpoint takes a Stripe `account` ID from the request body but does not verify that the *authenticated user* owns this account. Any authenticated user could potentially initiate the onboarding flow for *another* user's Stripe account by providing their `account` ID.
    *   **Recommendation:** Before calling `stripe.accountSessions.create`, fetch the business associated with the authenticated user from your database and verify that its `stripeAccountId` matches the `account` ID provided in the request body.

*   **Missing Authorization for UploadThing Deletes (`/api/uploadthing/route.ts`)**:
    *   **Issue:** The `DELETE` endpoint authenticates the user but does not verify if that user is authorized to delete the file specified by the `fileKey` query parameter. Any authenticated user can delete *any* file uploaded by *any* user if they know the `fileKey`.
    *   **Recommendation:** Implement an authorization check. Store the relationship between `fileKey` (or file URL) and the owning entity (e.g., Business logo, Inventory image) in your database upon upload completion. In the `DELETE` handler, retrieve the resource associated with the file, verify the authenticated user owns that resource, confirm the `fileKey` matches the stored one, and only then proceed with `utapi.deleteFiles`.

*   **Missing Authentication/Authorization in User Registration (`/api/auth/register/route.ts`)**:
    *   **Issue:** This endpoint accepts `name`, `email`, and `clerkUserId` and creates a user in the database without verifying that the request comes from an authenticated source *or* that the `clerkUserId` corresponds to the session making the request. It could potentially be called by unauthenticated users or used to create users with arbitrary `clerkUserId`s.
    *   **Recommendation:** This user creation logic should likely be handled *only* by the verified Clerk webhook (`/api/webhook/clerk/route.ts`) upon receiving a `user.created` event. If it must remain a separate endpoint callable from the client, it *must* use Clerk's `auth()` to get the *server-verified* `userId` of the requester and use *that* ID, ignoring any `clerkUserId` passed in the body. The client should not dictate the `clerkUserId`.

**Medium Priority Issues:**

*   **Insufficient Server-Side Validation in Stripe Webhook (`/api/webhook/stripe/route.ts`)**:
    *   **Issue:** The `payment_intent.succeeded` handler relies heavily on data within `paymentIntent.metadata` (e.g., `businessId`, amounts, `selectedItems`). Metadata can potentially be manipulated client-side before payment intent confirmation. Using these values directly without server-side re-validation is risky.
    *   **Recommendation:** When creating the Payment Intent server-side, ensure critical data is stored securely. In the webhook handler, re-validate crucial metadata: verify `businessId` exists and belongs to the expected entity, re-calculate totals based on validated `inventoryItems` looked up by ID from your database, rather than trusting amounts directly from metadata.

*   **Public Data Exposure in Dynamic Business Route (`/api/businesses/[businessId]/route.ts`)**:
    *   **Issue:** The unauthenticated `GET` request for a specific business exposes the business's `stripeAccountId` and full `inventory` list publicly.
    *   **Recommendation:** Limit the data exposed in the public `select` statement. Exclude `stripeAccountId` unless absolutely necessary. Consider summarizing or omitting `inventory` details for the public view.

*   **Insufficient Input Validation in Dynamic Business Update (`/api/businesses/[businessId]/route.ts`)**:
    *   **Issue:** The `PATCH`/`POST` handler parses `FormData` but performs minimal validation beyond checking field existence and basic `parseFloat`/`JSON.parse`.
    *   **Recommendation:** After parsing `FormData` into an object, use a Zod schema (similar to `/api/businesses` POST) to rigorously validate all incoming fields (types, formats, ranges, etc.) before updating the database.

*   **Missing Clerk Webhook Event Handlers (`/api/webhook/clerk/route.ts`)**:
    *   **Issue:** Only `user.created` is handled. `user.updated` and `user.deleted` events from Clerk are ignored.
    *   **Recommendation:** Implement handlers for `user.updated` (to update user details like name/email) and `user.deleted` (to deactivate/anonymize/delete users in your DB) to keep your user data synchronized with Clerk.

*   **Potential Idempotency Issues in Stripe Webhook (`/api/webhook/stripe/route.ts`)**:
    *   **Issue:** While booking creation uses `upsert`, payment record creation (`prisma.payment.create`) doesn't appear to check if a record for that `paymentIntent.id` already exists. If the webhook is delivered multiple times, duplicate payment records could be created.
    *   **Recommendation:** Before creating a payment record, check if one already exists for the `paymentIntent.id`. Alternatively, use `upsert` if appropriate or add a unique constraint on `stripePaymentId` in your schema.

*   **Insufficient Authorization for UploadThing Uploads (`/api/uploadthing/core.ts`)**:
    *   **Issue:** The upload middleware checks only for authentication, not authorization based on context. Any authenticated user can upload to any defined route (`imageUploader`, `logoUploader`, etc.).
    *   **Recommendation:** If uploads need restrictions (e.g., only business owner uploads logo), pass relevant IDs (e.g., `businessId`) from the client during upload initiation and add ownership verification logic within the `.middleware()` for the specific file routes.

**Low Priority Issues / Considerations:**

*   **Webhook Secret Verification (`/api/webhook/docuseal/route.ts`)**: Using a basic shared secret. Consider HMAC signature verification if DocuSeal supports it for improved security.
*   **Error Handling Consistency (`/api/webhook/stripe/route.ts`)**: Some errors are caught and logged, allowing processing to continue, while others are thrown. This could lead to partially processed events. Review if this behavior is intended; consider a more transactional approach or flagging mechanism for failed steps.
*   **Sensitive Data in Logs (`/api/webhook/stripe/route.ts`)**: Logging full PaymentIntent objects might expose sensitive data in production logs. Consider filtering or redacting fields.
*   **Webhook Handler Complexity (`/api/webhook/stripe/route.ts`)**: Including PDF generation/sending within the webhook handler increases complexity and potential failure points. Consider moving such side effects to background jobs.
*   **Data Exposure in GET Endpoints (`/api/businesses/`, `/api/businesses/[businessId]`)**: Both authenticated GET endpoints return related data (`inventory`, `bookings`, `customers`). Verify this level of detail is necessary and doesn't expose unintended sensitive information (especially the full customer list).
*   **CSRF Protection (`/api/businesses/[businessId]/route.ts`)**: If the `PATCH`/`POST` using `FormData` can be triggered from standard HTML forms, ensure adequate CSRF protection is in place (verify Clerk's default handling or implement tokens).
*   **External URL Fetching (`/api/webhook/docuseal/route.ts`)**: Fetching the PDF requires trusting DocuSeal URLs. Low risk, but worth noting.

**General Recommendations:**

1.  **Dependency Updates:** Keep frameworks (Next.js), libraries (Prisma, Clerk, Stripe, UploadThing, Zod), and Node.js runtime up-to-date with security patches.
2.  **Environment Variables:** Ensure all secrets (`STRIPE_WEBHOOK_SECRET`, `CLERK_WEBHOOK_SECRET`, `DOCUSEAL_WEBHOOK_SECRET`, API keys for Vercel/Cloudflare/Stripe/UploadThing) are stored securely as environment variables and not hardcoded or committed to version control. Check `.env.local` or similar files are in `.gitignore`.
3.  **Rate Limiting:** Consider applying rate limiting (e.g., at the Vercel edge or using a library) to API endpoints, especially public ones or those performing intensive operations, to mitigate DoS risks.
4.  **Security Headers:** Configure standard security headers (CSP, HSTS, X-Frame-Options, etc.) for your Next.js application.
5.  **Input Sanitization:** While Prisma helps prevent SQL injection, be mindful of potential XSS if data fetched from the API (especially user-provided fields like names, descriptions) is ever rendered directly in HTML without proper sanitization/encoding on the frontend.