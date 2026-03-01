
import pool from './config/database.js';

async function check() {
    try {
        const result = await pool.query("SELECT id, nombre, foto_perfil FROM usuarios WHERE foto_perfil LIKE '%cloudinary%' ORDER BY id DESC");
        console.log('--- USUARIOS CON CLOUDINARY ---');
        console.table(result.rows);

        if (result.rows.length === 0) {
            console.log('No se encontraron fotos en Cloudinary aún.');
            const last = await pool.query("SELECT id, nombre, foto_perfil FROM usuarios WHERE foto_perfil IS NOT NULL ORDER BY id DESC LIMIT 3");
            console.log('Últimas 3 fotos subidas (posiblemente locales):');
            console.table(last.rows);
        } else {
            console.log('✅ ¡Confirmado! Se están subiendo fotos a Cloudinary.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

check();
