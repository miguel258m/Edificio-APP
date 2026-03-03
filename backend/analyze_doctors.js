
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE rol = 'medico'");
        console.log('--- DOCTORES EN DB ---');
        for (const user of res.rows) {
            console.log(`ID: ${user.id}, Nombre: ${user.nombre}, Email: ${user.email}`);

            const resE = await pool.query("SELECT id, estado FROM emergencias WHERE atendido_por = $1", [user.id]);
            console.log(`  - Emergencias atendidas: ${resE.rows.filter(e => e.estado === 'resuelta').length}`);

            const resS = await pool.query("SELECT id, estado, tipo FROM solicitudes WHERE atendido_por = $1 AND tipo = 'medica'", [user.id]);
            console.log(`  - Solicitudes médicas atendidas: ${resS.rows.filter(s => s.estado === 'completada').length}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
