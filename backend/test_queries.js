
import pool from './config/database.js';

async function test() {
    const adminQuery = `
    SELECT u.id, u.nombre, u.email, u.telefono, u.rol, u.apartamento, u.created_at, e.nombre as edificio_nombre
    FROM usuarios u
    LEFT JOIN edificios e ON u.edificio_id = e.id
    WHERE u.aprobado = false
    ORDER BY u.created_at DESC
  `;

    const otherQuery = `
    SELECT id, nombre, email, telefono, rol, apartamento, created_at
    FROM usuarios 
    WHERE edificio_id = $1 AND aprobado = false
    ORDER BY created_at DESC
  `;

    try {
        console.log('Testing Admin Query...');
        const res1 = await pool.query(adminQuery);
        console.log('Admin Query Success. Rows:', res1.rows.length);

        console.log('Testing Other Query (building 1)...');
        const res2 = await pool.query(otherQuery, [1]);
        console.log('Other Query Success. Rows:', res2.rows.length);

    } catch (e) {
        console.error('SQL Error detected:', e);
    } finally {
        process.exit();
    }
}

test();
