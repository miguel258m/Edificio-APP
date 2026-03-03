
import pool from './config/database.js';

async function check() {
    try {
        console.log('--- Checking metodos_pago columns ---');
        const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'metodos_pago'");
        console.table(cols.rows);

        console.log('\n--- Checking metodos_pago data ---');
        const data = await pool.query("SELECT * FROM metodos_pago limit 5");
        console.log(JSON.stringify(data.rows, null, 2));

        console.log('\n--- Checking users edificio_id ---');
        const users = await pool.query("SELECT id, nombre, email, rol, edificio_id FROM usuarios WHERE email IN ('M1@email.com', 'A1@email.com', 'gerente@edificio.com') OR rol = 'gerente' LIMIT 10");
        console.table(users.rows);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
