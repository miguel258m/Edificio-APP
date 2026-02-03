
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query(`SELECT id, nombre, email, rol, aprobado, edificio_id FROM usuarios WHERE aprobado = false`);
        console.log('Pending users (aprobado = false):', JSON.stringify(res.rows, null, 2));

        const res2 = await pool.query(`SELECT id, nombre, email, rol, aprobado, edificio_id FROM usuarios WHERE aprobado = true`);
        console.log('Approved users (aprobado = true):', res2.rows.length);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

check();
