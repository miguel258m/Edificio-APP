import pool from './config/database.js';

async function diagnose() {
    try {
        console.log('--- USUARIOS ---');
        const users = await pool.query('SELECT id, nombre, email, rol, edificio_id FROM usuarios');
        console.log(JSON.stringify(users.rows, null, 2));

        console.log('\n--- ALERTAS ---');
        const alerts = await pool.query('SELECT id, edificio_id, creada_por, titulo FROM alertas ORDER BY created_at DESC LIMIT 5');
        console.log(JSON.stringify(alerts.rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

diagnose();
