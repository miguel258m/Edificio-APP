
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'solicitudes'");
        console.log('Columns in solicitudes table:');
        console.log(res.rows.map(r => r.column_name));

        // Also check emergencias just in case
        const res2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'emergencias'");
        console.log('Columns in emergencias table:');
        console.log(res2.rows.map(r => r.column_name));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

check();
