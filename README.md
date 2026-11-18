# Seravita Travelling Agency

A responsive travel-booking website where customers can search, compare and reserve every part of a trip in one place.

---

## What the site handles

- **Hotels & Homes** — stays from hotels to holiday homes
- **Flights** — one-way and return fares
- **Trains** — scenic rail routes and fares
- **Cars** — vehicle hire with pick-up and drop-off dates
- **Buses** — coach routes and intercity tickets
- **Attractions & Tours** — tickets and guided experiences
- **Flight + Hotel** — bundled packages
- **Events** — concerts, festivals, sport and conferences
- **Private Tours** — tailor-made itineraries with a dedicated guide
- **Group Tours** — small-group departures
- **Cruises** — coastal and ocean sailings
- **Trip.Planner** — an interactive day-by-day itinerary builder
- **Travel Inspiration** — guides and stories from the Seravita team
- **Map** — an interactive map of featured destinations and starting prices
- **Deals** — all offers with category and destination filters

## Brand colours

| Name                | Hex       |
| ------------------- | --------- |
| Cocoa Brown         | `#2E1A1B` |
| Tender Rose Gold    | `#FFE1CB` |
| Brusque Orange      | `#CB6116` |

## Tech stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Frontend    | React 19, Vite 7, MUI 7, React Router 7, Tabler icons  |
| Backend     | Express, PostgreSQL, JWT                               |
| Styling     | MUI theming (brand palette), Sass, Poppins/Inter fonts |
| Tooling     | ESLint, Prettier, Yarn 4                               |

The UI is built on the [Berry Material React](https://github.com/codedthemes/berry-free-react-admin-template) template, re-themed for Seravita.

## Project structure

```
src/
├── api/              # data hooks and HTTP client
├── contexts/         # auth and configuration providers
├── hooks/            # reusable hooks
├── layout/           # TravelLayout (site header/footer), auth layouts
├── routes/           # TravelRoutes and authentication routes
├── themes/           # Seravita brand palette and MUI theme
├── ui-component/     # shared components (Logo, Loadable, auth cards, ...)
└── views/
    ├── travel/       # public travel site pages and data
    └── auth/         # sign-in / sign-up screens
```

## Getting started

### Prerequisites

- Node.js 20.6+ (required by Vite 7)
- Yarn 4 (via Corepack) or npm

### Install and run

```bash
yarn install        # or npm install
yarn start          # http://localhost:3000
```

### Database and login

The API lives in `server/` (Express + PostgreSQL, raw SQL via `pg`). It uses a dedicated `seravita` database. To run it locally:

```bash
createdb seravita                               # or: psql -c "CREATE DATABASE seravita;"
cp server/.env.example server/.env              # set DATABASE_URL and JWT_SECRET
cd server && npm install && cd ..
node --env-file=server/.env server/migrate.js   # create tables
node --env-file=server/.env server/seed.js      # create travel content and the demo user
npm run server                                  # API on http://localhost:5000
```

With the API running, start the site with `yarn start`. The Vite dev server proxies `/api` to port 5000.

Demo account (created by `seed.js`):

| Role     | Email                 | Password | Lands on   |
| -------- | --------------------- | -------- | ---------- |
| Customer | guest@seravita.travel | guest123 | `/account` |

Customers can also self-register at `/register`.

### Production build

```bash
yarn build          # output in dist/
yarn preview        # preview the production build
```

### Docker demo

The quickest way to run the full stack (frontend, API and PostgreSQL) is Docker Compose:

```bash
docker compose up --build      # open http://localhost:8080
```

Set `JWT_SECRET`, `POSTGRES_PASSWORD` or `WEB_PORT` in the environment to override the demo defaults. The API
container runs the migration and seed scripts on start, so the demo account and travel content are created
automatically.

## Available scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `yarn start`    | Start the dev server on `:3000` |
| `yarn build`    | Production build to `dist/`     |
| `yarn preview`  | Preview the production build    |
| `yarn lint`     | Run ESLint                      |
| `yarn test`     | Run the Vitest test suite       |
| `yarn prettier` | Format source files             |

## Routes

| Path                  | Page                      |
| --------------------- | ------------------------- |
| `/`                   | Home                      |
| `/hotels-homes`       | Hotels & Homes            |
| `/flights`            | Flights                   |
| `/trains`             | Trains                    |
| `/cars`                | Cars                      |
| `/buses`               | Buses                     |
| `/attractions-tours`  | Attractions & Tours       |
| `/flight-hotel`       | Flight + Hotel            |
| `/events`             | Events                    |
| `/privatetours`       | Private Tours             |
| `/grouptours`         | Group Tours               |
| `/cruises`            | Cruises                   |
| `/tripplanner`        | Trip.Planner              |
| `/travelinspiration`  | Travel Inspiration        |
| `/tripmap`            | Map                       |
| `/deals`              | Deals                     |
| `/deal/:dealId`       | Deal detail and checkout  |
| `/login`              | Sign in                   |
| `/register`           | Create a customer account |
| `/account`            | Customer account (protected) |

Legacy paths `/pages/login` and `/pages/register` still open the sign-in and sign-up pages.
Hyphenated aliases such as `/private-tours` redirect to the canonical paths above.

## Notes

Travel content is stored in PostgreSQL and seeded from `server/seed-content.json`; run `server/migrate.js` and
`server/seed.js` after changing it. Search is scoped to the current category or experience, supports a no-results
state, and uses URL query parameters so searches are shareable.

For demos, the frontend falls back to the bundled `server/seed-content.json` when the content API is unreachable, so
the site stays browsable without the database running. Sign-in, registration and bookings still require the API.

Deal cards open `/deal/:dealId`, a stepper covering deal details, seat selection for flights, trains and buses,
and a demo card payment. Completed bookings are stored in the `bookings` table and listed on `/account`. No real
payment is processed — any 16-digit card number, future MM/YY expiry and 3-digit CVC work. Login, registration and
bookings are backed by the same Express/PostgreSQL API in `server/`.
