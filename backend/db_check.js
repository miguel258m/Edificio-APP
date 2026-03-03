
import pool from './config/database.js';

async function check() {
    try {
        console.log('--- TABLES ---');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.table(tables.rows);

        console.log('\n--- PAYMENT METHODS DATA ---');
        const metodos = await pool.query("SELECT * FROM metodos_pago");
        console.log(JSON.stringify(metodos.rows, null, 2));

        console.log('\n--- CITAS DATA ---');
        const citas = await pool.query("SELECT * FROM citas LIMIT 5");
        console.log(JSON.stringify(citas.rows, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
