const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'edificio_db',
    password: 'admin123', // Actualizado desde .env
    port: 5432,
});

async function fixUsers() {
    try {
        const res = await pool.query("SELECT id, nombre, email, rol, aprobado FROM usuarios ORDER BY id DESC LIMIT 20");
        res.rows.forEach(u => console.log(`${u.id}: ${u.nombre} (${u.email}) - Rol: ${u.rol} - Aprobado: ${u.aprobado}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixUsers();
