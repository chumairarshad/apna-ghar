import dotenv from 'dotenv';
import { pool } from '../server/db.js';

dotenv.config();

async function auditDatabase() {
  console.log('====================================================');
  console.log('🔍 AUDITING POSTGRESQL DEALER ACCOUNTS & SUBSCRIPTIONS');
  console.log('====================================================');

  const usersRes = await pool.query(`SELECT * FROM users ORDER BY created_at DESC`);
  console.log(`Found ${usersRes.rows.length} total user(s) in Database:\n`);
  for (const u of usersRes.rows) {
    console.log(`- User ID: ${u.id}`);
    console.log(`  Name: ${u.full_name || u.name}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Agency: ${u.agency_name}`);
    console.log(`  Plan: ${u.subscription_plan || u.plan_name}`);
    console.log(`  Quota: ${u.listing_quota}`);
    console.log(`  Created At: ${u.created_at}\n`);
  }

  const subsRes = await pool.query(`SELECT * FROM dealer_subscriptions`);
  console.log(`Found ${subsRes.rows.length} dealer_subscription record(s):\n`);
  for (const s of subsRes.rows) {
    console.log(s);
  }

  const propertiesRes = await pool.query(`
    SELECT p.id, p.title, p.price, p.dealer_id, u.email AS dealer_email, u.role AS dealer_role
    FROM properties p
    LEFT JOIN users u ON p.dealer_id = u.id
  `);

  console.log(`Found ${propertiesRes.rows.length} Property listing(s) in Database:\n`);
  for (const p of propertiesRes.rows) {
    console.log(`- Property ID: ${p.id}`);
    console.log(`  Title: ${p.title}`);
    console.log(`  Price: ${p.price}`);
    console.log(`  Dealer ID: ${p.dealer_id}`);
    console.log(`  Owner Email: ${p.dealer_email || 'ORPHAN / UNMAPPED'}\n`);
  }

  console.log('====================================================');
  process.exit(0);
}

auditDatabase().catch(err => {
  console.error('Audit DB error:', err);
  process.exit(1);
});
