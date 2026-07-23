# Cloudbound Guides

Cloudbound is a responsive storefront for selling cloud-certification ebooks covering AWS, Microsoft Azure, and Google Cloud. It includes catalog filtering, a client-side cart, bundle pricing, and a server-side Stripe Checkout integration.

## Sample deployment

A sample deployment can be found at [https://cloudbound-guides.lsantos2000.workers.dev/](https://cloudbound-guides.lsantos2000.workers.dev/).

## Features

- Responsive certification-guide catalog
- AWS, Azure, and GCP filters
- Interactive shopping cart with quantity support
- Discounted multi-cloud bundle
- Server-validated product IDs and prices
- Stripe-hosted checkout redirect
- Payment success page
- Sites hosting configuration

## Tech stack

- Next.js 15
- React 19
- Stripe Checkout API
- Plain CSS

## Local setup

Install the dependencies:

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

Add a Stripe test secret key to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Stripe checkout

The cart posts product codes to `POST /api/checkout`. The server validates every code against its own product catalog, calculates prices in cents, creates a Stripe Checkout Session, and returns the hosted Checkout URL.

Never expose `STRIPE_SECRET_KEY` in client-side code or commit `.env.local`.

Use Stripe test mode while developing. A successful test checkout redirects to `/success`.

## Digital fulfillment

Checkout is implemented, but automatic ebook delivery still requires a webhook. Before accepting live payments:

1. Create a Stripe webhook endpoint.
2. Handle `checkout.session.completed` idempotently.
3. Verify Stripe's webhook signature using `STRIPE_WEBHOOK_SECRET`.
4. Email expiring or authenticated download links to the purchaser.
5. Test successful, failed, delayed, and repeated webhook deliveries.

Do not rely on the success-page redirect for fulfillment because a customer can pay without returning to the site.

## Project structure

```text
app/
  api/checkout/route.js  Stripe Checkout Session endpoint
  success/page.js        Post-payment confirmation page
  layout.js              Site metadata and global styles
  page.js                Storefront and cart
  styles.css             Main visual system
  stripe.css             Checkout and success-page styles
.openai/hosting.json     Sites project configuration
.env.example             Environment-variable template
```

## Production checklist

- Configure `STRIPE_SECRET_KEY` in the hosting environment.
- Implement and configure the fulfillment webhook.
- Add the real PDF and EPUB delivery system.
- Replace test mode with Stripe live mode only after end-to-end testing.
- Confirm pricing, refund policy, support details, tax settings, and terms.

## Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production build
```
