
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'edificios'
    `);
        console.log('Columns in edificios table:');
        console.table(res.rows);
    } catch (e) {
        console.error('Error checking schema:', e);
    } finally {
        process.exit();
    }
}

check();
