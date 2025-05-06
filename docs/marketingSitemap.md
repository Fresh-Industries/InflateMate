InflateMate Website Sitemap & Design System (2025)

/(home)                         => Home (Landing)
/(home)/features                 => Features overview
/(home)/features/[feature]       => Individual feature details (dynamic)
/(home)/pricing                  => Plan breakdown (Solo vs Growth)
/(home)/resources                => Blog index
/(home)/resources/[slug]         => Blog post (markdown)
/(home)/about                    => Company story
/(home)/contact                  => Support form or email
/(home)/testimonials             => Customer reviews (optional)
/(home)/compare/[competitor]     => Comparison pages (InflatableOffice, Goodshuffle, etc.)
/(home)/legal/terms              => Terms of Service
/(home)/legal/privacy            => Privacy Policy
/(home)/legal/cookies            => Cookie Policy



🔗 Primary Marketing Pages

Home (Landing Page)

Hero section with clear value prop and visual impact

Explainer GIF or product demo embed

Highlight key metrics (bookings, revenue, customer stats)

Feature previews with icons

Pricing overview with CTA

Testimonials or trust logos

Footer with newsletter + social proof

Features

Modular subpages or anchored sections:

Smart Booking & Inventory

Automated Waivers & Receipts

CRM / Customer Profiles

Website Builder (custom themes, color presets)

Invoicing + Estimates

SMS Communication (coming soon)

Analytics Dashboard

Marketing Funnels (coupons, lead popups)

Pricing

Clear tier breakdown:

Solo Plan ($60) — 1 user, core features, no SMS/org switch

Growth Plan ($99) — 5 users, SMS, embedded components

Add-ons: extra users, extra waivers, SMS credits

FAQs about pricing limits and feature access

Resources

Blog: SEO-optimized posts ("Best Booking Software in 2025")

Help Center: Getting Started, Features, Troubleshooting

Guides: Printable PDF tutorials and videos

Login / Signup

Powered by Clerk (OAuth + email support)

About Us

Founder story (built by a bounce house owner)

Your mission and long-term vision

Contact / Support

Email contact, social media, support hours

Optional chatbot or contact form

Testimonials & Case Studies (post-launch priority)

Early adopters (your parents) with visuals and quotes

Comparison Pages

vs Inflatable Office

vs Goodshuffle Pro

vs Event Rental Systems

Include pricing comparison, feature matrix, screenshots

⚖️ Required Legal Pages

Terms of Service

Privacy Policy

Cookie Policy

Acceptable Use Policy

Data Processing Addendum (GDPR-friendly)

Subprocessor Disclosure (for Resend, Supabase, etc.)

🧩 Tenant Website Pages (for each customer)

Home Page (hero + CTA)

Inventory Page (search/filter by type)

Booking / Checkout Page

About Us / Business Info

Contact Page

Policies:

Cancellation Policy

Safety Guidelines

Terms of Rental

Embedded Waiver via DocuSeal




🎨 Tailwind Design System (UI Consistency)

🎨 Color Palette (Based on Current Site)
  primary: {
    DEFAULT: '#8B5CF6',   // Purple core
    light: '#C4B5FD',
    dark: '#6D28D9'
  },
  accent: {
    DEFAULT: '#6366F1',   // Indigo accent
    dark: '#4F46E5'
  },
  surface: '#FFFFFF',
  background: '#F9FAFB',
  muted: '#E5E7EB',
  text: {
    DEFAULT: '#111827',
    light: '#6B7280'
  }
}

📐 Typography

Headline: font-extrabold text-4xl md:text-5xl leading-tight

Subheading: text-xl text-gray-600

Body text: text-base text-gray-700

🎯 CTA Buttons

<button class="bg-primary text-white px-6 py-3 rounded-full shadow hover:bg-primary-dark transition-all">Start Free Trial</button>

🧠 Layout & Engagement Enhancers

Hero = 2-column layout (text + product UI screenshot)

Microinteractions (hover glow, animated icons)

CTA buttons fixed on scroll for mobile

Include quote carousel instead of static text

Use background gradients subtly (like your footer CTA block)