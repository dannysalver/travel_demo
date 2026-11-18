import { randomBytes } from 'crypto';
import { Router } from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

async function fieldsFor(sectionId) {
  const result = await pool.query(
    `SELECT f.name, f.label, f.placeholder, f.field_type AS type,
            COALESCE(jsonb_agg(o.label ORDER BY o.sort_order) FILTER (WHERE o.id IS NOT NULL), '[]'::jsonb) AS options
     FROM search_fields f
     LEFT JOIN field_options o ON o.field_id = f.id
     WHERE f.section_id = $1
     GROUP BY f.id, f.sort_order
     ORDER BY f.sort_order`,
    [sectionId]
  );
  return result.rows;
}

router.get('/content', async (req, res) => {
  try {
    const [nav, categories, deals, destinations, perks, articles, mapPins, experiences] = await Promise.all([
      pool.query('SELECT id, title, path, icon_name, nav_group FROM nav_items ORDER BY sort_order'),
      pool.query('SELECT id, title, caption, path, scene, icon_name FROM categories ORDER BY sort_order'),
      pool.query(
        `SELECT id, title, location, category_id, destination_id, price::float8 AS price, old_price::float8 AS old_price,
                rating::float8 AS rating, duration_label, badge, scene, icon_name, summary, provider, highlights, includes,
                vehicle_type, seat_rows, seat_columns, seat_aisle_after
         FROM deals ORDER BY sort_order`
      ),
      pool.query('SELECT id, name, country, scene, trips, icon_name FROM destinations ORDER BY sort_order'),
      pool.query('SELECT id, title, body, icon_name FROM perks ORDER BY sort_order, id'),
      pool.query('SELECT id, title, excerpt, tag, read_time, scene, is_featured FROM articles ORDER BY sort_order'),
      pool.query('SELECT id, name, x_pct::float8 AS x, y_pct::float8 AS y, price::float8 AS price, scene FROM map_pins ORDER BY sort_order, id'),
      pool.query('SELECT kind, title, eyebrow, subtitle, scene, icon_name, tagline, intro FROM experiences ORDER BY sort_order')
    ]);

    const categoriesWithFields = await Promise.all(
      categories.rows.map(async (category) => ({ ...category, fields: await fieldsFor(category.id) }))
    );
    const experiencesWithDetails = await Promise.all(
      experiences.rows.map(async (experience) => {
        const [highlights, fields] = await Promise.all([
          pool.query('SELECT body FROM experience_highlights WHERE kind = $1 ORDER BY sort_order', [experience.kind]),
          fieldsFor(experience.kind)
        ]);
        return { ...experience, highlights: highlights.rows.map((row) => row.body), fields };
      })
    );

    res.json({
      navItems: nav.rows,
      primaryNavIds: nav.rows.filter((item) => item.nav_group === 'primary').map((item) => item.id),
      moreNavIds: nav.rows.filter((item) => item.nav_group === 'more').map((item) => item.id),
      categories: categoriesWithFields,
      deals: deals.rows,
      destinations: destinations.rows,
      perks: perks.rows,
      articles: articles.rows,
      mapPins: mapPins.rows,
      experiences: experiencesWithDetails
    });
  } catch (err) {
    console.error('Content error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/saved-deals', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.title, d.location, d.price::float8 AS price, d.old_price::float8 AS old_price, d.scene, d.badge, d.duration_label
       FROM saved_deals s JOIN deals d ON d.id = s.deal_id
       WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Saved deals error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/saved-deals', auth, async (req, res) => {
  try {
    const dealId = Number(req.body.dealId);
    if (!dealId) return res.status(400).json({ message: 'dealId is required' });
    await pool.query('INSERT INTO saved_deals (user_id, deal_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.user.id, dealId]);
    res.status(201).json({ saved: true });
  } catch (err) {
    console.error('Save deal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/saved-deals/:dealId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM saved_deals WHERE user_id = $1 AND deal_id = $2', [req.user.id, req.params.dealId]);
    res.status(204).send();
  } catch (err) {
    console.error('Unsave deal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const bookingFields = `b.id, b.reference, b.status, b.travellers, b.seats, b.seat_charge::float8 AS seat_charge,
  b.total::float8 AS total, b.payment_last4, b.trip_details, b.created_at,
  d.id AS deal_id, d.title, d.location, d.scene, d.category_id, d.duration_label, d.icon_name`;

router.get('/bookings', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${bookingFields} FROM bookings b JOIN deals d ON d.id = b.deal_id
       WHERE b.user_id = $1 ORDER BY b.created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/bookings', auth, async (req, res) => {
  try {
    const dealId = Number(req.body.dealId);
    const travellers = Number(req.body.travellers);
    const total = Number(req.body.total);
    const seatCharge = Number(req.body.seatCharge) || 0;
    const seats = Array.isArray(req.body.seats) ? req.body.seats : [];
    const paymentLast4 = String(req.body.paymentLast4 || '').replace(/\D/g, '').slice(-4);
    const tripDetails = req.body.tripDetails && typeof req.body.tripDetails === 'object' ? req.body.tripDetails : {};

    if (!Number.isInteger(dealId) || !Number.isInteger(travellers) || travellers < 1 || travellers > 8) {
      return res.status(400).json({ message: 'A valid deal and number of travellers is required' });
    }
    if (!Number.isFinite(total) || total <= 0 || seatCharge < 0) {
      return res.status(400).json({ message: 'A valid payment total is required' });
    }
    if (seats.length > travellers || seats.some((seat) => !seat || typeof seat.label !== 'string')) {
      return res.status(400).json({ message: 'Invalid seat selection' });
    }

    const deal = await pool.query('SELECT id, vehicle_type FROM deals WHERE id = $1', [dealId]);
    if (!deal.rows.length) return res.status(404).json({ message: 'Deal not found' });
    if (deal.rows[0].vehicle_type && seats.length !== travellers) {
      return res.status(400).json({ message: 'Choose one seat for every traveller' });
    }

    const reference = `SVT-${randomBytes(3).toString('hex').toUpperCase()}`;
    const result = await pool.query(
      `INSERT INTO bookings (user_id, deal_id, reference, travellers, seats, seat_charge, total, payment_last4, trip_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [req.user.id, dealId, reference, travellers, JSON.stringify(seats), seatCharge, total, paymentLast4, JSON.stringify(tripDetails)]
    );
    const booking = await pool.query(`SELECT ${bookingFields} FROM bookings b JOIN deals d ON d.id = b.deal_id WHERE b.id = $1`, [
      result.rows[0].id
    ]);
    res.status(201).json({ booking: booking.rows[0] });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/enquiries', async (req, res) => {
  try {
    const kind = String(req.body.kind || 'general').slice(0, 50);
    const payload = req.body.payload && typeof req.body.payload === 'object' ? req.body.payload : {};
    const userId = req.user?.id || null;
    await pool.query('INSERT INTO enquiries (user_id, kind, payload) VALUES ($1, $2, $3)', [userId, kind, payload]);
    res.status(201).json({ sent: true });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/newsletter', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    await pool.query('INSERT INTO newsletter_subscriptions (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);
    res.status(201).json({ subscribed: true });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
