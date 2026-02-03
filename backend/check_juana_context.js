
import pool from './config/database.js';

async function check() {
    try {
        const resEmergencia = await pool.query(
            "SELECT * FROM emergencias WHERE usuario_id = 23 AND tipo = 'medica' AND estado = 'activa'"
        );
        console.log('Juana active emergencias:', resEmergencia.rows.length);

        const resSolicitud = await pool.query(
            "SELECT * FROM solicitudes WHERE usuario_id = 23 AND tipo = 'medica' AND estado IN ('pendiente', 'en_proceso')"
        );
        console.log('Juana active requests:', resSolicitud.rows.length);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

check();
