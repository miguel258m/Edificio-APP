import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: 'postgresql://postgres:ZqItlqOKqTzMhIuowFpBvKROzKxNlVAn@autorack.proxy.rlwy.net:18659/railway', ssl: { rejectUnauthorized: false } });

async function check() {
  // Check users and their edificio_ids
  const users = await pool.query("SELECT id, nombre, rol, edificio_id FROM usuarios WHERE rol IN ('medico','residente') ORDER BY rol");
  console.log('Usuarios medico/residente:');
  console.table(users.rows);

  // Check recent messages
  const msgs = await pool.query("SELECT m.id, m.remitente_id, m.destinatario_id, m.contenido, m.edificio_id, m.created_at FROM mensajes m ORDER BY m.created_at DESC LIMIT 10");
  console.log('Ultimos 10 mensajes:');
  console.table(msgs.rows);

  pool.end();
}
check();
