
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol, edificio_id FROM usuarios WHERE edificio_id = 2");
        console.log('Users in Building 2:');
        console.log(JSON.stringify(res.rows, null, 2));

        const resJuana = await pool.query("SELECT * FROM usuarios WHERE nombre ILIKE '%juana%'");
        console.log('Juana details:');
        console.log(JSON.stringify(resJuana.rows, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

check();
