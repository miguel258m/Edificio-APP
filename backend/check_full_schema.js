
import pool from './config/database.js';

async function check() {
    try {
        console.log('--- EMERGENCIAS ---');
        const resE = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'emergencias'
        `);
        console.table(resE.rows);

        console.log('\n--- SOLICITUDES ---');
        const resS = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'solicitudes'
        `);
        console.table(resS.rows);
    } catch (e) {
        console.error('Error checking schema:', e);
    } finally {
        process.exit();
    }
}

check();
