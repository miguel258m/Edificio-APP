
import pool from './config/database.js';

async function checkDoctor() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol, activo, aprobado FROM usuarios WHERE email = 'doctor@edificio.com' OR rol = 'medico'");
        console.log('--- Doctor accounts found ---');
        console.table(res.rows);

        if (res.rows.length === 0) {
            console.log('No doctor account found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkDoctor();
