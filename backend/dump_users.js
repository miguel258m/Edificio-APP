
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol, aprobado FROM usuarios ORDER BY id ASC");
        console.log(`Total users: ${res.rows.length}`);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
