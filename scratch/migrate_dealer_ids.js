import { pool } from '../server/db.js';

async function migrateNullDealerIds() {
  console.log('====================================================');
  console.log('🛠️ MIGRATING LEGACY NULL DEALER_ID RECORDS IN NEON DB');
  console.log('====================================================');

  // 1. Inspect total properties & null count
  const totalRes = await pool.query('SELECT COUNT(*) FROM properties');
  const totalProps = parseInt(totalRes.rows[0].count, 10);

  const nullRes = await pool.query('SELECT COUNT(*) FROM properties WHERE dealer_id IS NULL');
  const nullProps = parseInt(nullRes.rows[0].count, 10);

  console.log(`📊 Total Properties in DB: ${totalProps}`);
  console.log(`🔍 Properties with NULL dealer_id: ${nullProps}`);

  if (nullProps === 0) {
    console.log('✅ All property records already have a valid dealer_id!');
    process.exit(0);
  }

  // 2. Perform safe migration matching agent_name, agency_name, or agent_phone with users table
  const updateSql = `
    UPDATE properties p
    SET dealer_id = u.id
    FROM users u
    WHERE p.dealer_id IS NULL
      AND (
        LOWER(TRIM(p.agent_name)) = LOWER(TRIM(u.full_name)) OR
        LOWER(TRIM(p.agency_name)) = LOWER(TRIM(u.agency_name)) OR
        REGEXP_REPLACE(p.agent_phone, '[^0-9]', '', 'g') = REGEXP_REPLACE(u.phone, '[^0-9]', '', 'g')
      )
    RETURNING p.id, p.title, p.dealer_id;
  `;

  const updateRes = await pool.query(updateSql);
  console.log(`✅ Successfully updated ${updateRes.rows.length} legacy listing(s) with matched user dealer_id!`);

  // 3. Check for any remaining orphan listings without matching users
  const remainingNullRes = await pool.query('SELECT COUNT(*) FROM properties WHERE dealer_id IS NULL');
  const remainingNull = parseInt(remainingNullRes.rows[0].count, 10);

  if (remainingNull > 0) {
    console.log(`⚠️ ${remainingNull} orphan property record(s) remained unmatched.`);
    // Get or create fallback dealer account
    let fallbackUserRes = await pool.query("SELECT id FROM users WHERE role = 'DEALER' OR role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    if (fallbackUserRes.rows.length === 0) {
      console.log('Creating default dealer account for orphan properties...');
      fallbackUserRes = await pool.query(`
        INSERT INTO users (full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified)
        VALUES ('Apex Real Estate Agency', 'dealer@agency.com', '$2a$10$P1...fallback', '+92 300 1234567', 'DEALER', 'Apex Real Estate Agency', 'Lahore', 'VERIFIED', true)
        RETURNING id
      `);
    }
    const fallbackId = fallbackUserRes.rows[0].id;
    const fallbackRes = await pool.query('UPDATE properties SET dealer_id = $1 WHERE dealer_id IS NULL RETURNING id', [fallbackId]);
    console.log(`✅ Assigned remaining ${fallbackRes.rows.length} orphan listing(s) to primary agency account (${fallbackId}).`);
  }

  // 4. Final verification
  const finalCheck = await pool.query('SELECT COUNT(*) FROM properties WHERE dealer_id IS NULL');
  console.log(`🎉 Migration Completed! Remaining NULL dealer_id count: ${finalCheck.rows[0].count}`);
  console.log('====================================================');
  process.exit(0);
}

migrateNullDealerIds().catch((err) => {
  console.error('❌ Migration Error:', err);
  process.exit(1);
});
