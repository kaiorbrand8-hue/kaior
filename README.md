# KAIOR — Men's Wear

Full-stack e-commerce site (Next.js + Express/MongoDB), styled after the KAIOR
brand (navy & gold, serif branding) with the ANWAA reference site's page
structure (hero, essence, shop by category, featured collection, lookbook,
testimonials, newsletter).

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind v4 — `frontend/`
- **Backend**: Express + MongoDB (Mongoose) + JWT auth — `backend/`
- **Payment**: Cash on Delivery only (no gateway wired up yet)
- **Dev database**: local `mongodb-memory-server` instance (real mongod binary,
  data persisted to `backend/data/mongo`) — no separate MongoDB install needed
  for development. Swap `MONGO_URI` in `backend/.env` for MongoDB Atlas (or a
  real mongod) in production.

## Running locally

```bash
# 1. Backend — starts both the dev MongoDB and the API together
cd backend
npm install
cp .env.example .env      # already done; edit if needed
npm run dev                # starts MongoDB (27117) + API (5000)

# First time only, in a second terminal once the DB is up:
npm run seed                # wipes & seeds categories/products/admin user

# 2. Frontend
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

- Storefront: http://localhost:3000
- API: http://localhost:5000/api
- Admin dashboard: http://localhost:3000/admin

**Admin login**: `admin@kaior.com` / `Admin@12345` (set in `backend/.env`,
change before going live).

## Deployment

Both `frontend` and `backend` deploy as **separate Vercel projects** from the
same GitHub repo (Root Directory set to `frontend` and `backend`
respectively) — no other host needed, and no credit card required on
Vercel's free Hobby tier.

- `backend/src/app.js` holds the Express app (routes/middleware) with no
  `listen()` call. `backend/src/server.js` is the local-dev entrypoint
  (imports `app.js`, connects to Mongo, calls `.listen()`).
  `backend/api/[...path].js` is the Vercel entrypoint: same `app.js`, wrapped
  in a handler that lazily connects to MongoDB once and reuses that
  connection across warm invocations. Vercel's file-based routing maps every
  `/api/*` request straight to it — no `vercel.json` needed.
- Database: MongoDB Atlas (the free M0 tier). If `mongodb+srv://` connection
  fails to resolve (some networks block DNS SRV lookups), use the equivalent
  non-SRV `mongodb://host1,host2,host3/...` form instead — get the three
  shard hostnames and `replicaSet` name via `nslookup -type=SRV` /
  `-type=TXT` on the cluster hostname.
- Image uploads go straight to Cloudinary from the backend (see
  `CLOUDINARY_*` env vars below) — the frontend uploads **one file per
  request** specifically to stay under the ~4.5MB request body cap Vercel
  enforces on Node serverless functions.
- Required env vars on the backend Vercel project: `MONGO_URI`, `JWT_SECRET`,
  `JWT_EXPIRES_IN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_URL` (the deployed
  frontend's URL, for CORS).
- Required env vars on the frontend Vercel project: `NEXT_PUBLIC_API_URL`
  (the deployed backend's URL + `/api`), plus the `NEXT_PUBLIC_*` social
  links from `.env.local`.

## Arabic / English

The storefront has an AR/EN toggle in the navbar (top right). It's a
client-side toggle (saved to `localStorage`, no `/ar` `/en` URLs) that flips
`dir`/`lang` on `<html>` and swaps in the Cairo Arabic typeface. Product and
category names/descriptions/fabric come from `nameAr`/`descriptionAr`/
`fabricAr` fields on those models — the admin product/category forms have
matching Arabic input fields. If a translation is left blank, the storefront
falls back to the English value. Colors use a small static translation table
(`frontend/src/lib/i18n/colors.ts`) rather than a DB field.

Known limitation: this is a client-only toggle, not per-locale routing, so
there's no separate `/ar` URL for SEO and a returning Arabic-preference
visitor sees a brief flash of English text before the client re-renders
(the page direction itself is set immediately via a blocking script, so only
the text flashes, not the layout).

## What's included

- Product catalog with categories, variants (color/size/stock), reviews
- Shop page with filters (category, size, sort) + pagination, search
- Product detail page with gallery, color/size selection, add to cart
- Cart (localStorage) + checkout (COD) + order confirmation
- Customer accounts: register/login (JWT) or **Sign in with Google**, plus
  order history. Google sign-in needs a Google OAuth 2.0 Web Client ID (from
  https://console.cloud.google.com/apis/credentials, Authorized JavaScript
  origins = your site's URL(s)) set as `GOOGLE_CLIENT_ID` on the backend and
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on the frontend (same value). The backend
  verifies the Google ID token server-side and links/creates the account by
  email; if unset, the Google button just doesn't render.
- Admin dashboard: stats, product CRUD (with variant/stock table), category
  CRUD, order management (status updates), customer list (`/admin/customers`
  — searchable by name/email/phone, shows whether each account signed up via
  email or Google)
- Admin image upload: product/category/homepage images are uploaded from disk
  (not pasted as URLs) and stored on **Cloudinary** — set
  `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in
  `backend/.env` (from https://cloudinary.com/console). JPG/PNG/WEBP/GIF, 5MB
  max, up to 8 images per product.
- Social hub floating button: a gold-ring toggle with a share/network icon
  (bottom-right, on every page) that expands into WhatsApp, Instagram,
  Facebook and TikTok icons. Instagram/Facebook/TikTok links are placeholders
  in `frontend/.env.local` (`NEXT_PUBLIC_INSTAGRAM_URL`,
  `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_TIKTOK_URL`) — swap in the real
  profile URLs when ready.
- Homepage image control: `/admin/homepage` lets the admin upload the hero
  banner and all four lookbook photos shown on the homepage (including the
  top-right "KAIOR / Tailored Confidence" panel, which now has a background
  image + gradient overlay instead of a flat color) — no code changes needed
  to update them.
- Product gallery: left/right arrow buttons, dot indicators, and touch swipe
  (mobile) to move between a product's images.
- Live search: typing in the navbar search box shows matching products
  (partial match on name, in either language) in a dropdown after a short
  debounce, with a link to the full results page.
- Review moderation: customer reviews are `pending` by default and stay
  invisible to the public until an admin approves them from `/admin/reviews`
  (filter by status, approve/reject/reset/delete). The product rating and
  review count are computed from approved reviews only.
- Shipping waybill (AWB): "Print Waybill" button on each order in
  `/admin/orders` opens `/admin/orders/[id]/waybill` in a new tab — a clean
  printable page (sender/receiver, items, COD amount to collect, signature
  line) that auto-triggers the browser print dialog on load.

## Known placeholders (swap before launch)

- Seeded product/category images are `placehold.co` placeholders — replace
  with real photography via the admin panel's upload button (or re-seed).
- Uploaded files aren't deleted from Cloudinary when a product/category is
  deleted (no cleanup job yet) — a minor housekeeping gap, not a functional
  bug.
- Waybill "Ship From" is a static placeholder (`KAIOR Men's Wear`,
  01507175754, Cairo, Egypt) — hardcoded in
  `frontend/src/app/admin/orders/[id]/waybill/page.tsx`, edit if your return
  address changes.
- WhatsApp number in `frontend/.env.local` (`NEXT_PUBLIC_WHATSAPP_NUMBER`) is
  a placeholder.
- No payment gateway integrated (COD only, per current scope). Paymob is the
  natural next step for card payments in Egypt.
- Admin credentials are seed defaults — rotate `ADMIN_PASSWORD` in
  `backend/.env` and re-seed, or change the password from the app once real
  data is in place.
