/**
 * Creates a CNAME record in Cloudflare pointing to Vercel's DNS.
 *
 * @param sub The subdomain to create (e.g., "tenant" for "tenant.inflatemate.co").
 *            Use empty string or "@" to target the root domain.
 * @throws {Error} If the Cloudflare API request fails.
 */
export async function createCnameInCloudflare(sub: string): Promise<void> {
  const CF_ZONE_ID = process.env.CF_ZONE_ID;
  const CF_API_TOKEN = process.env.CF_API_TOKEN;

  if (!CF_ZONE_ID) {
    throw new Error("CF_ZONE_ID environment variable is not set.");
  }
  if (!CF_API_TOKEN) {
    throw new Error("CF_API_TOKEN environment variable is not set.");
  }

  // For root domain, Cloudflare expects "@" as the name
  const recordName = !sub || sub === "@" ? "@" : sub;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "CNAME",
        name: recordName,
        content: "cname.vercel-dns.com", // Vercel's required CNAME target for custom domains
        ttl: 1, // 1 = Automatic
        proxied: false, // Must be false for Vercel to verify
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json(); // Cloudflare usually returns JSON errors
    const errorMessage = errorData?.errors?.[0]?.message || "Unknown Cloudflare API error";
    throw new Error(`Failed to create CNAME in Cloudflare: ${errorMessage}`);
  }

  // No return value needed on success
} 