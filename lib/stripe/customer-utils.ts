import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import Stripe from "stripe";

/**
 * Finds an existing Stripe Customer ID for a given customer email and business,
 * or creates a new Stripe Customer and links it via the CustomerStripeAccount table.
 *
 * Assumes the internal Prisma Customer record already exists for the given email/businessId pair.
 *
 * @param customerEmail The email of the customer.
 * @param customerName The name of the customer (used if creating a Stripe customer).
 * @param customerPhone The phone of the customer (used if creating a Stripe customer).
 * @param businessId The ID of the internal Business record.
 * @param stripeConnectedAccountId The Stripe Connected Account ID for the business.
 * @returns {Promise<string>} The Stripe Customer ID.
 * @throws {Error} If the internal customer record is not found, or if Stripe/DB operations fail.
 */
export async function findOrCreateStripeCustomer(
  customerEmail: string,
  customerName: string, 
  customerPhone: string,
  customerCity: string,
  customerState: string,
  customerAddress: string,
  customerZip: string,
  businessId: string,
  stripeConnectedAccountId: string
): Promise<string> {
  console.log(`findOrCreateStripeCustomer called for email: ${customerEmail}, business: ${businessId}`);

  // 1. Find the internal Prisma Customer record first.
  const customer = await prisma.customer.findUnique({
    where: {
      email_businessId: {
        email: customerEmail,
        businessId: businessId,
      },
    },
    include: {
      // Include the specific stripe account for this business if it exists
      customerStripeAccounts: {
        where: { businessId: businessId },
        select: { stripeCustomerId: true },
        take: 1, // Should only be one
      },
    },
  });

  if (!customer) {
    console.error(`Internal Customer record not found for email ${customerEmail} and business ${businessId}. This should exist before calling this function.`);
    // Depending on desired behavior, you might create the customer here, but the prompt assumes it exists.
    throw new Error(`Internal customer record not found for email ${customerEmail} / business ${businessId}`);
  }

  // 2. Check if a Stripe Customer ID already exists for this customer/business combo.
  if (customer.customerStripeAccounts && customer.customerStripeAccounts.length > 0 && customer.customerStripeAccounts[0].stripeCustomerId) {
    const existingStripeId = customer.customerStripeAccounts[0].stripeCustomerId;
    console.log(`Found existing Stripe Customer ID: ${existingStripeId} for customer ${customer.id}, business ${businessId}`);
    return existingStripeId;
  }

  // 3. If not found, create a new Stripe Customer.
  console.log(`No existing Stripe Customer ID found for customer ${customer.id}, business ${businessId}. Creating new Stripe Customer...`);
  let newStripeCustomer: Stripe.Customer;
  try {
    newStripeCustomer = await stripe.customers.create({
      email: customerEmail,
      name: customerName, // Use name passed to function
      phone: customerPhone, // Use phone passed to function
      address: {
        city: customerCity,
        country: 'US',
        line1: customerAddress,
        postal_code: customerZip,
        state: customerState,
      },
      description: `Customer for Business ID: ${businessId}`,
      tax: {
        validate_location: 'immediately',
      },
      metadata: {
        prismaCustomerId: customer.id,
        prismaBusinessId: businessId,
      }
    }, { 
      stripeAccount: stripeConnectedAccountId // Crucial: Specify the connected account
    });
    console.log(`Successfully created Stripe Customer: ${newStripeCustomer.id}`);
  } catch (stripeError) {
    console.error("Stripe Customer creation failed:", stripeError);
    if (stripeError instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API Error creating customer: ${stripeError.message}`);
    } else if (stripeError instanceof Error) {
         throw new Error(`Error creating Stripe customer: ${stripeError.message}`);
    } else {
        throw new Error("An unknown error occurred during Stripe customer creation.");
    }
  }

  // 4. Create the linking record in CustomerStripeAccount.
  try {
    await prisma.customerStripeAccount.create({
      data: {
        customerId: customer.id,
        businessId: businessId,
        stripeCustomerId: newStripeCustomer.id,
      },
    });
    console.log(`Successfully created CustomerStripeAccount link for customer ${customer.id}, business ${businessId}, stripeId ${newStripeCustomer.id}`);
  } catch (dbError) {
    console.error("Database error creating CustomerStripeAccount link:", dbError);
    // Attempt to clean up the created Stripe customer? Maybe not, could be used later.
    // Log the Stripe ID so it can potentially be manually linked or deleted.
    console.error(`Orphaned Stripe Customer ID may have been created: ${newStripeCustomer.id}`);
     if (dbError instanceof Error) {
        throw new Error(`Database error linking Stripe customer: ${dbError.message}`);
     } else {
        throw new Error("An unknown database error occurred while linking Stripe customer.");
     }
  }

  // 5. Return the newly created Stripe Customer ID.
  return newStripeCustomer.id;
} 