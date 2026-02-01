import pool from './config/database.js';

async function addFotoPerfilColumn() {
    try {
        console.log('Adding foto_perfil column to usuarios table...');
        await pool.query(`
            ALTER TABLE usuarios 
            ADD COLUMN IF NOT EXISTS foto_perfil TEXT;
        `);
        console.log('✅ Column foto_perfil added successfully (or already existed).');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding column:', err);
        process.exit(1);
    }
}

addFotoPerfilColumn();
