import pool from './config/database.js';

async function checkRoles() {
    try {
        const result = await pool.query('SELECT id, nombre, email, rol, edificio_id FROM usuarios');
        console.table(result.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkRoles();
