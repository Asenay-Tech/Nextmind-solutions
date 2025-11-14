# Next.js Route Structure
## File System Organization

```
app/
├── (public)/
│   ├── page.tsx                          # Homepage
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── careers/
│       └── page.tsx
│
├── (products)/
│   ├── products/
│   │   ├── page.tsx                      # Products overview
│   │   ├── agent-platform/
│   │   │   └── page.tsx
│   │   ├── automation-studio/
│   │   │   └── page.tsx
│   │   ├── integrations/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── page.tsx
│   │
│   └── solutions/
│       ├── page.tsx                      # Solutions overview
│       ├── [slug]/
│       │   └── page.tsx                  # Dynamic solution pages
│       ├── ai-agents/
│       │   └── page.tsx
│       ├── inventory-logistics/
│       │   └── page.tsx
│       ├── finance-billing/
│       │   └── page.tsx
│       └── it-infrastructure/
│           └── page.tsx
│
├── (sales)/
│   ├── pricing/
│   │   ├── page.tsx                      # Pricing overview
│   │   └── enterprise/
│   │       └── page.tsx
│   ├── demo/
│   │   └── page.tsx
│   ├── trial/
│   │   └── page.tsx
│   ├── webinars/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── events/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
│
├── (enterprise)/
│   └── enterprise/
│       ├── page.tsx                      # Enterprise overview
│       ├── security/
│       │   └── page.tsx
│       ├── compliance/
│       │   └── page.tsx
│       ├── sla/
│       │   └── page.tsx
│       ├── support/
│       │   └── page.tsx
│       ├── architecture/
│       │   └── page.tsx
│       ├── data-residency/
│       │   └── page.tsx
│       ├── onboarding/
│       │   └── page.tsx
│       └── contracts/
│           └── page.tsx
│
├── (support)/
│   ├── support/
│   │   ├── page.tsx                      # Support center
│   │   ├── help-center/
│   │   │   └── page.tsx
│   │   ├── tickets/
│   │   │   └── page.tsx
│   │   ├── community/
│   │   │   └── page.tsx
│   │   ├── changelog/
│   │   │   └── page.tsx
│   │   └── status/
│   │       └── page.tsx
│   │
│   └── docs/
│       ├── page.tsx                      # Documentation hub
│       ├── getting-started/
│       │   └── page.tsx
│       ├── api/
│       │   ├── page.tsx
│       │   └── [endpoint]/
│       │       └── page.tsx
│       ├── guides/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       ├── sdks/
│       │   └── page.tsx
│       └── integrations/
│           ├── page.tsx
│           └── [slug]/
│               └── page.tsx
│
├── (legal)/
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── cookies/
│   │   └── page.tsx
│   ├── gdpr/
│   │   └── page.tsx
│   └── legal/
│       ├── page.tsx                      # Legal hub
│       ├── msa/
│       │   └── page.tsx
│       ├── dpa/
│       │   └── page.tsx
│       ├── baa/
│       │   └── page.tsx
│       ├── acceptable-use/
│       │   └── page.tsx
│       └── dmca/
│           └── page.tsx
│
├── (seo)/
│   ├── blog/
│   │   ├── page.tsx                      # Blog listing
│   │   ├── [slug]/
│   │   │   └── page.tsx                  # Blog posts
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx
│   │
│   ├── compare/
│   │   └── [competitor]/
│   │       └── page.tsx
│   │
│   ├── vs/
│   │   └── [competitor]/
│   │       └── page.tsx
│   │
│   ├── topics/
│   │   └── [topic]/
│   │       └── page.tsx
│   │
│   └── faq/
│       ├── page.tsx                      # General FAQ
│       ├── pricing/
│       │   └── page.tsx
│       ├── security/
│       │   └── page.tsx
│       ├── enterprise/
│       │   └── page.tsx
│       └── integrations/
│           └── page.tsx
│
├── (credibility)/
│   ├── case-studies/
│   │   ├── page.tsx                      # Case studies hub
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── testimonials/
│   │   └── page.tsx
│   │
│   ├── customers/
│   │   └── page.tsx
│   │
│   ├── trust/
│   │   └── page.tsx                      # Trust center
│   │
│   ├── security/
│   │   └── page.tsx                      # Security overview
│   │
│   ├── certifications/
│   │   └── page.tsx
│   │
│   ├── awards/
│   │   └── page.tsx
│   │
│   ├── research/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── press/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── analyst-reports/
│       └── page.tsx
│
├── (resources)/
│   └── resources/
│       ├── page.tsx                      # Resources hub
│       ├── whitepapers/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       ├── ebooks/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       ├── templates/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       └── videos/
│           ├── page.tsx
│           └── [slug]/
│               └── page.tsx
│
├── (industries)/
│   └── industries/
│       ├── page.tsx                      # Industries overview
│       ├── healthcare/
│       │   └── page.tsx
│       ├── financial-services/
│       │   └── page.tsx
│       ├── retail/
│       │   └── page.tsx
│       ├── manufacturing/
│       │   └── page.tsx
│       ├── logistics/
│       │   └── page.tsx
│       ├── real-estate/
│       │   └── page.tsx
│       ├── insurance/
│       │   └── page.tsx
│       └── telecommunications/
│           └── page.tsx
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx                      # Protected route
│   └── account/
│       ├── page.tsx                      # Account settings
│       ├── billing/
│       │   └── page.tsx
│       ├── team/
│       │   └── page.tsx
│       └── integrations/
│           └── page.tsx
│
├── (partners)/
│   └── partners/
│       └── page.tsx
│
├── layout.tsx                            # Root layout
├── globals.css                           # Global styles
├── not-found.tsx                         # 404 page
└── error.tsx                             # Error page
```

## Route Groups Explanation

- `(public)` - Public marketing pages
- `(products)` - Product and solution pages
- `(sales)` - Sales and conversion pages
- `(enterprise)` - Enterprise-specific pages
- `(support)` - Support and documentation
- `(legal)` - Legal and compliance pages
- `(seo)` - SEO-optimized content pages
- `(credibility)` - Social proof and trust pages
- `(resources)` - Marketing resources
- `(industries)` - Industry-specific pages
- `(auth)` - Authentication pages
- `(dashboard)` - Protected user pages
- `(partners)` - Partner program pages

## Notes

- Route groups `()` don't affect URL structure
- Use for organization and layout sharing
- Dynamic routes use `[param]` syntax
- Catch-all routes use `[...slug]` syntax
- Optional catch-all use `[[...slug]]` syntax

