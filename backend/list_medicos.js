
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE rol = 'medico'");
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
