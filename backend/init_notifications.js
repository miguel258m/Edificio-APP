
import pool from './config/database.js';

async function init() {
    try {
        console.log('--- Creating notificaciones table ---');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notificaciones (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                titulo VARCHAR(200) NOT NULL,
                mensaje TEXT NOT NULL,
                leida BOOLEAN DEFAULT false,
                tipo VARCHAR(50),
                data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table created or already exists.');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

init();
