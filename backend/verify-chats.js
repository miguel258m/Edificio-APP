import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: 'postgresql://postgres:ZqItlqOKqTzMhIuowFpBvKROzKxNlVAn@autorack.proxy.rlwy.net:18659/railway' });

async function check() {
    const res = await pool.query(`
    SELECT m.id, u1.rol as FromRole, u1.nombre as FromName, 
           u2.rol as ToRole, u2.nombre as ToName, 
           m.contenido, m.created_at
    FROM mensajes m
    JOIN usuarios u1 ON m.remitente_id = u1.id
    JOIN usuarios u2 ON m.destinatario_id = u2.id
    ORDER BY m.created_at DESC LIMIT 15
  `);
    console.log('Mensajes recientes:');
    console.table(res.rows);
    pool.end();
}
check();
