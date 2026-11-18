import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-content.json'), 'utf8'));

async function insertContent(client) {
  for (const [index, item] of content.navItems.entries()) {
    await client.query(
      `INSERT INTO nav_items (id, title, path, icon_name, nav_group, sort_order) VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, path = EXCLUDED.path, icon_name = EXCLUDED.icon_name, nav_group = EXCLUDED.nav_group, sort_order = EXCLUDED.sort_order`,
      [item.id, item.title, item.path, item.icon_name, item.nav_group, index]
    );
  }

  for (const [index, category] of content.categories.entries()) {
    await client.query(
      `INSERT INTO categories (id, title, caption, path, scene, icon_name, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, caption = EXCLUDED.caption, path = EXCLUDED.path, scene = EXCLUDED.scene, icon_name = EXCLUDED.icon_name, sort_order = EXCLUDED.sort_order`,
      [category.id, category.title, category.caption, category.path, category.scene, category.icon_name, index]
    );

    for (const [fieldIndex, field] of category.fields.entries()) {
      const result = await client.query(
        `INSERT INTO search_fields (section_id, name, label, placeholder, field_type, sort_order) VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (section_id, name) DO UPDATE SET label = EXCLUDED.label, placeholder = EXCLUDED.placeholder, field_type = EXCLUDED.field_type, sort_order = EXCLUDED.sort_order
         RETURNING id`,
        [category.id, field.name, field.label, field.placeholder || null, field.type, fieldIndex]
      );
      await client.query('DELETE FROM field_options WHERE field_id = $1', [result.rows[0].id]);
      for (const [optionIndex, option] of (field.options || []).entries()) {
        await client.query('INSERT INTO field_options (field_id, label, sort_order) VALUES ($1, $2, $3)', [result.rows[0].id, option, optionIndex]);
      }
    }
  }

  for (const [index, destination] of content.destinations.entries()) {
    await client.query(
      `INSERT INTO destinations (id, name, country, scene, trips, icon_name, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, country = EXCLUDED.country, scene = EXCLUDED.scene, trips = EXCLUDED.trips, icon_name = EXCLUDED.icon_name, sort_order = EXCLUDED.sort_order`,
      [destination.id, destination.name, destination.country, destination.scene, destination.trips, destination.icon_name, index]
    );
  }

  for (const [index, deal] of content.deals.entries()) {
    const match = content.destinations.find((destination) => deal.location.toLowerCase().includes(destination.name.toLowerCase()));
    await client.query(
      `INSERT INTO deals (id, title, location, category_id, destination_id, price, old_price, rating, duration_label, badge, scene, icon_name,
         summary, provider, highlights, includes, vehicle_type, seat_rows, seat_columns, seat_aisle_after, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, location = EXCLUDED.location, category_id = EXCLUDED.category_id, destination_id = EXCLUDED.destination_id,
         price = EXCLUDED.price, old_price = EXCLUDED.old_price, rating = EXCLUDED.rating, duration_label = EXCLUDED.duration_label, badge = EXCLUDED.badge,
         scene = EXCLUDED.scene, icon_name = EXCLUDED.icon_name, summary = EXCLUDED.summary, provider = EXCLUDED.provider,
         highlights = EXCLUDED.highlights, includes = EXCLUDED.includes, vehicle_type = EXCLUDED.vehicle_type,
         seat_rows = EXCLUDED.seat_rows, seat_columns = EXCLUDED.seat_columns, seat_aisle_after = EXCLUDED.seat_aisle_after, sort_order = EXCLUDED.sort_order`,
      [
        deal.id,
        deal.title,
        deal.location,
        deal.category,
        match?.id || null,
        deal.price,
        deal.oldPrice,
        deal.rating,
        deal.duration_label,
        deal.badge,
        deal.scene,
        deal.icon_name,
        deal.summary || '',
        deal.provider || 'Seravita',
        JSON.stringify(deal.highlights || []),
        JSON.stringify(deal.includes || []),
        deal.vehicle_type || null,
        deal.seat_rows || null,
        deal.seat_columns || null,
        deal.seat_aisle_after || null,
        index
      ]
    );
  }

  for (const perk of content.perks) {
    await client.query(
      `INSERT INTO perks (id, title, body, icon_name, sort_order) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, icon_name = EXCLUDED.icon_name, sort_order = EXCLUDED.sort_order`,
      [perk.id, perk.title, perk.body, perk.icon_name, perk.sort_order ?? 0]
    );
  }

  for (const article of content.articles) {
    await client.query(
      `INSERT INTO articles (id, title, excerpt, tag, read_time, scene, is_featured, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, tag = EXCLUDED.tag, read_time = EXCLUDED.read_time,
         scene = EXCLUDED.scene, is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order`,
      [article.id, article.title, article.excerpt, article.tag, article.read_time, article.scene, article.is_featured, article.id]
    );
  }

  for (const pin of content.mapPins) {
    await client.query(
      `INSERT INTO map_pins (id, name, x_pct, y_pct, price, scene, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, x_pct = EXCLUDED.x_pct, y_pct = EXCLUDED.y_pct, price = EXCLUDED.price, scene = EXCLUDED.scene, sort_order = EXCLUDED.sort_order`,
      [pin.id, pin.name, pin.x_pct, pin.y_pct, pin.price, pin.scene, pin.sort_order ?? 0]
    );
  }

  for (const [index, experience] of content.experiences.entries()) {
    await client.query(
      `INSERT INTO experiences (kind, title, eyebrow, subtitle, scene, icon_name, tagline, intro, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (kind) DO UPDATE SET title = EXCLUDED.title, eyebrow = EXCLUDED.eyebrow, subtitle = EXCLUDED.subtitle, scene = EXCLUDED.scene,
         icon_name = EXCLUDED.icon_name, tagline = EXCLUDED.tagline, intro = EXCLUDED.intro, sort_order = EXCLUDED.sort_order`,
      [experience.kind, experience.title, experience.eyebrow, experience.subtitle, experience.scene, experience.icon_name, experience.tagline, experience.intro, index]
    );

    await client.query('DELETE FROM experience_highlights WHERE kind = $1', [experience.kind]);
    for (const [highlightIndex, body] of experience.highlights.entries()) {
      await client.query('INSERT INTO experience_highlights (kind, body, sort_order) VALUES ($1, $2, $3)', [experience.kind, body, highlightIndex]);
    }

    for (const [fieldIndex, field] of content.experienceSearchFields[0].entries()) {
      const result = await client.query(
        `INSERT INTO search_fields (section_id, name, label, placeholder, field_type, sort_order) VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (section_id, name) DO UPDATE SET label = EXCLUDED.label, placeholder = EXCLUDED.placeholder, field_type = EXCLUDED.field_type, sort_order = EXCLUDED.sort_order
         RETURNING id`,
        [experience.kind, field.name, field.label, field.placeholder || null, field.type, fieldIndex]
      );
      await client.query('DELETE FROM field_options WHERE field_id = $1', [result.rows[0].id]);
      for (const [optionIndex, option] of (field.options || []).entries()) {
        await client.query('INSERT INTO field_options (field_id, label, sort_order) VALUES ($1, $2, $3)', [result.rows[0].id, option, optionIndex]);
      }
    }
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await insertContent(client);
    console.log('Travel content seeded');

    const hash = await bcrypt.hash('guest123', 10);
    await client.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password`,
      ['Seravita Guest', 'guest@seravita.travel', hash]
    );
    await client.query('COMMIT');
    console.log('Demo account: guest@seravita.travel / guest123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
