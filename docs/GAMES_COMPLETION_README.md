# CRAudioVizAI — Games Module Completion

This pack adds:
- **Registry** (`content/games/registry.json`) for visibility + Game of the Month
- **Add-Ons Hub** at `/games-addons`
- **Server Entitlements** stub (`lib/entitlements.ts`) + `/api/entitlements`
- **Payments** scaffolds: `/api/payments/checkout`, `/api/webhooks/{stripe,paypal}`
- **Sitemap** including all registered games

## Configure

1) Copy `.env.example` → `.env` and set URLs/keys.
2) Set `NEXT_PUBLIC_SITE_URL` to your production URL.
3) Replace payments scaffolds with real Stripe/PayPal logic:
   - Stripe: create Checkout Session; verify webhook with `STRIPE_WEBHOOK_SECRET`.
   - PayPal: create order; verify webhook + capture.

## Registry
- `motm`: slug shown as Game of the Month (your hub can pin this).
- `groups[].slugs`: which routes to show.
- `hidden[]`: slugs to hide (e.g., assets/rights pending).
- Append your generated slugs to the "Generated Challenges" group.

## Entitlements
`getEntitlements()` currently returns FREE for everyone. Swap with your user session/DB and grants written by webhooks.

## Testing
- Hit `/api/entitlements` to see current plan/grants.
- POST `/api/payments/checkout` with `{ "productId":"pro_upgrade", "provider":"stripe" }` returns a mock URL (dev).
- Send a POST JSON to `/api/webhooks/stripe` or `/api/webhooks/paypal` to verify route wiring.

