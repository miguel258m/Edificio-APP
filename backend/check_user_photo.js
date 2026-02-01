import pool from './config/database.js';

async function checkUserPhoto() {
    try {
        const result = await pool.query(`
            SELECT id, nombre, email, foto_perfil 
            FROM usuarios;
        `);
        console.log('Total users:', result.rows.length);
        result.rows.forEach(u => {
            if (u.foto_perfil) {
                console.log(`User ${u.id}: ${u.nombre} - Photo: ${u.foto_perfil}`);
            }
        });
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUserPhoto();
