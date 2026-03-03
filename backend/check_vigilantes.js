import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function checkVigilantes() {
    try {
        const res = await pool.query('SELECT id, nombre, email, rol, edificio_id, activo, aprobado FROM usuarios WHERE rol = \'vigilante\'');
        console.log('--- Vigilantes ---');
        console.table(res.rows);

        const resBuildings = await pool.query('SELECT id, nombre FROM edificios');
        console.log('\n--- Edificios ---');
        console.table(resBuildings.rows);

        const resAll = await pool.query('SELECT id, nombre, email, rol, edificio_id FROM usuarios LIMIT 10');
        console.log('\n--- Últimos 10 usuarios ---');
        console.table(resAll.rows);

    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await pool.end();
    }
}

checkVigilantes();
