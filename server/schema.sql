CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nav_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  path TEXT NOT NULL,
  icon_name TEXT,
  nav_group TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  path TEXT NOT NULL,
  scene TEXT,
  icon_name TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS search_fields (
  id SERIAL PRIMARY KEY,
  section_id TEXT NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  placeholder TEXT,
  field_type TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (section_id, name)
);

CREATE TABLE IF NOT EXISTS field_options (
  id SERIAL PRIMARY KEY,
  field_id INT NOT NULL REFERENCES search_fields(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  scene TEXT,
  trips INT NOT NULL DEFAULT 0,
  icon_name TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS deals (
  id INT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  category_id TEXT NOT NULL,
  destination_id TEXT REFERENCES destinations(id),
  price NUMERIC(10, 2) NOT NULL,
  old_price NUMERIC(10, 2) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  duration_label TEXT NOT NULL,
  badge TEXT,
  scene TEXT,
  icon_name TEXT,
  summary TEXT NOT NULL DEFAULT '',
  provider TEXT NOT NULL DEFAULT 'Seravita',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  vehicle_type TEXT,
  seat_rows INT,
  seat_columns INT,
  seat_aisle_after INT,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE deals ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'Seravita';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS highlights JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS includes JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS seat_rows INT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS seat_columns INT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS seat_aisle_after INT;

CREATE TABLE IF NOT EXISTS perks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon_name TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  tag TEXT NOT NULL,
  read_time TEXT NOT NULL,
  scene TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS map_pins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  x_pct NUMERIC(5, 2) NOT NULL,
  y_pct NUMERIC(5, 2) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  scene TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experiences (
  kind TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  eyebrow TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  scene TEXT,
  icon_name TEXT,
  tagline TEXT NOT NULL,
  intro TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience_highlights (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL REFERENCES experiences(kind) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS saved_deals (
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, deal_id)
);

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id INT NOT NULL REFERENCES deals(id),
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  travellers INT NOT NULL DEFAULT 1,
  seats JSONB NOT NULL DEFAULT '[]'::jsonb,
  seat_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_last4 TEXT NOT NULL DEFAULT '',
  trip_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
