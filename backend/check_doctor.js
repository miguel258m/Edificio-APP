
import pool from './config/database.js';

async function check() {
    try {
        const email = 'M1@email.com';
        const res = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE email = $1", [email]);
        console.table(res.rows);

        if (res.rows.length > 0) {
            const medico_id = res.rows[0].id;
            console.log(`\n--- ATENCIONES PARA MÉDICO ID ${medico_id} ---`);

            const resE = await pool.query("SELECT id, estado FROM emergencias WHERE atendido_por = $1", [medico_id]);
            console.log('Emergencias:');
            console.table(resE.rows);

            const resS = await pool.query("SELECT id, estado, tipo FROM solicitudes WHERE atendido_por = $1", [medico_id]);
            console.log('Solicitudes:');
            console.table(resS.rows);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
