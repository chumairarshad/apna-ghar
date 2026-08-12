import dotenv from 'dotenv';
import { pool } from '../server/db.js';

dotenv.config();

async function cleanupQAData() {
  console.log('====================================================');
  console.log('🧹 CLEANING UP TEMPORARY QA ACCOUNTS & TEST PROPERTIES');
  console.log('====================================================');

  // 1. Delete temporary QA properties (prop-audit-*)
  const delPropsRes = await pool.query(`
    DELETE FROM properties 
    WHERE id LIKE 'prop-audit-%' OR title LIKE 'Quota Test Property%'
  `);
  console.log(`- Deleted ${delPropsRes.rowCount} temporary QA test property/properties.`);

  // 2. Delete subscriptions assigned to QA test dealers
  const delSubsRes = await pool.query(`
    DELETE FROM dealer_subscriptions
    WHERE dealer_id IN (
      SELECT id FROM users WHERE email LIKE 'qa_user_%' OR email LIKE 'qa_dealer_%' OR email LIKE 'attacker_%' OR agency_name = 'QA Premier Properties'
    )
  `);
  console.log(`- Deleted ${delSubsRes.rowCount} temporary QA subscription record(s).`);

  // 3. Delete temporary QA users and dealers
  const delUsersRes = await pool.query(`
    DELETE FROM users
    WHERE email LIKE 'qa_user_%' 
       OR email LIKE 'qa_dealer_%' 
       OR email LIKE 'attacker_%'
       OR agency_name = 'QA Premier Properties'
  `);
  console.log(`- Deleted ${delUsersRes.rowCount} temporary QA user/dealer account(s).`);

  console.log('====================================================');
  console.log('✅ QA CLEANUP COMPLETE — PRODUCTION DATABASE SANITIZED');
  console.log('====================================================');
  process.exit(0);
}

cleanupQAData().catch(err => {
  console.error('QA Cleanup Error:', err);
  process.exit(1);
});
