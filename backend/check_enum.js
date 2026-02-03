
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query(`
      SELECT enumlabel 
      FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE typname = 'rol_usuario'
    `);
        console.log('ENUM values for rol_usuario:');
        console.table(res.rows);
    } catch (e) {
        console.error('Error checking enum:', e);
    } finally {
        process.exit();
    }
}

check();
