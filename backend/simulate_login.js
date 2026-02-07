
import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function simulateLogin(email, password) {
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
            [email]
        );

        if (result.rows.length === 0) {
            console.log(`❌ User ${email} not found or not active.`);
            return;
        }

        const user = result.rows[0];
        console.log(`User found: ${user.email}, Rol: ${user.rol}, Aprobado: ${user.aprobado}`);

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            console.log(`✅ Password for ${email} is CORRECT.`);
        } else {
            console.log(`❌ Password for ${email} is INCORRECT.`);
            // Show hash length for debugging
            console.log(`Hash in DB: ${user.password.substring(0, 10)}... (Length: ${user.password.length})`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

const email = process.argv[2] || 'doctor@edificio.com';
const password = process.argv[3] || 'password123';

simulateLogin(email, password);
