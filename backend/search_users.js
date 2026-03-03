
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE email ILIKE 'M1%' OR nombre ILIKE 'M1%'");
        console.log('Search results for M1:');
        console.table(res.rows);

        const res2 = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE email ILIKE 'A1%' OR nombre ILIKE 'A1%'");
        console.log('Search results for A1:');
        console.table(res2.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
