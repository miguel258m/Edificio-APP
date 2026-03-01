import bcrypt from 'bcrypt';
import pool from './config/database.js';

const hash = await bcrypt.hash('password123', 10);
const result = await pool.query(
    "UPDATE usuarios SET password = $1 WHERE email IN ($2, $3) RETURNING email, rol, nombre",
    [hash, 'doctor@edificio.com', 'loro@email.com']
);
console.log('Contrasenas actualizadas:');
result.rows.forEach(u => console.log(`  ${u.email} (${u.rol}) - ${u.nombre}`));
if (result.rows.length === 0) console.log('  Ninguna fila actualizada');
await pool.end();
