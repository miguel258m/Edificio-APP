
import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function resetDoctorPasswords() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        await pool.query(
            "UPDATE usuarios SET password = $1, activo = true, aprobado = true WHERE email IN ('doctor@edificio.com', 'loro@email.com')",
            [hashedPassword]
        );

        console.log('✅ Passwords for doctor@edificio.com and loro@email.com have been reset to: password123');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

resetDoctorPasswords();
