
import pool from './config/database.js';

async function testRoutes() {
    const user = { id: 1, rol: 'admin', edificio_id: 1 };

    try {
        console.log('--- Testing /api/usuarios/pendientes (Simulated context) ---');
        // Admin path
        const resPendientes = await pool.query(
            `SELECT u.id, u.nombre, u.email, u.telefono, u.rol, u.apartamento, u.created_at, e.nombre as edificio_nombre
       FROM usuarios u
       LEFT JOIN edificios e ON u.edificio_id = e.id
       WHERE u.aprobado = false
       ORDER BY u.created_at DESC`
        );
        console.log('Pendientes count:', resPendientes.rows.length);
        console.log('Sample row:', resPendientes.rows[0]);

        console.log('\n--- Testing /api/usuarios/aprobados (Simulated context) ---');
        const resAprobados = await pool.query(
            `SELECT u.id, u.nombre, u.email, u.rol, u.apartamento, u.created_at, e.nombre as edificio_nombre
       FROM usuarios u
       LEFT JOIN edificios e ON u.edificio_id = e.id
       WHERE u.aprobado = true AND u.rol != 'admin'
       ORDER BY u.created_at DESC`
        );
        console.log('Aprobados count:', resAprobados.rows.length);

        // Check for any potential serialization issue (JSON.stringify)
        const jsonStr = JSON.stringify(resAprobados.rows);
        console.log('Serialization successful. Length:', jsonStr.length);

    } catch (e) {
        console.error('CRITICAL ERROR IN ROUTE LOGIC:', e);
    } finally {
        process.exit();
    }
}

testRoutes();
