
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query(`SELECT id, nombre, email, rol, aprobado, edificio_id FROM usuarios`);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error('Error fetching users:', e);
    } finally {
        process.exit();
    }
}

check();
