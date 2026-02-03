import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function resetManager() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query(
            "UPDATE usuarios SET password = $1 WHERE email = 'rosa@email.com'",
            [hashedPassword]
        );
        console.log('✅ Password reset for rosa@email.com to password123');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
}

resetManager();
