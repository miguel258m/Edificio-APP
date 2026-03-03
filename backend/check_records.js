
import pool from './config/database.js';

async function check() {
    try {
        console.log('--- EMERGENCIAS RESUELTAS ---');
        const resE = await pool.query(`
            SELECT id, atendido_por, estado 
            FROM emergencias 
            WHERE estado = 'resuelta'
        `);
        console.table(resE.rows);

        console.log('\n--- SOLICITUDES COMPLETADAS ---');
        const resS = await pool.query(`
            SELECT id, atendido_por, estado, tipo
            FROM solicitudes 
            WHERE estado = 'completada'
        `);
        console.table(resS.rows);

        console.log('\n--- MÉDICOS ---');
        const resM = await pool.query(`
            SELECT id, nombre, email FROM usuarios WHERE rol = 'medico'
        `);
        console.table(resM.rows);
    } catch (e) {
        console.error('Error checking data:', e);
    } finally {
        process.exit();
    }
}

check();
