/**
 * Adds a domain to the Vercel project.
 *
 * @param domain The domain name to add (e.g., "tenant.inflatemate.co" or "theircompany.com").
 * @throws {Error} If the Vercel API request fails.
 */
export async function addDomainToVercel(domain: string): Promise<void> {
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

  if (!VERCEL_PROJECT_ID) {
    throw new Error("VERCEL_PROJECT_ID environment variable is not set.");
  }
  if (!VERCEL_API_TOKEN) {
    throw new Error("VERCEL_API_TOKEN environment variable is not set.");
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData?.error?.message || "Unknown Vercel API error";
    throw new Error(`Failed to add domain to Vercel: ${errorMessage}`);
  }

  // No return value needed on success
}

/**
 * Removes a domain from the Vercel project.
 *
 * @param domain The domain name to remove.
 * @throws {Error} If the Vercel API request fails.
 */
export async function removeDomainFromVercel(domain: string): Promise<void> {
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

  if (!VERCEL_PROJECT_ID) {
    throw new Error("VERCEL_PROJECT_ID environment variable is not set.");
  }
  if (!VERCEL_API_TOKEN) {
    throw new Error("VERCEL_API_TOKEN environment variable is not set.");
  }

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData?.error?.message || "Unknown Vercel API error";
    throw new Error(`Failed to remove domain from Vercel: ${errorMessage}`);
  }

  // No return value needed on success
} 