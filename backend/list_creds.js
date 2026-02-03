
import pool from './config/database.js';

async function listUsers() {
    try {
        const res = await pool.query("SELECT nombre, email, rol, 'password123' as password_comun FROM usuarios ORDER BY rol, nombre");
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

listUsers();
