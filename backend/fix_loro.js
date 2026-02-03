
import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function fixUser() {
    try {
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 10);

        const res = await pool.query(
            "UPDATE usuarios SET email = 'loro@email.com', password = $1 WHERE email = 'loroemail.com' RETURNING *",
            [hashedPassword]
        );

        if (res.rows.length > 0) {
            console.log('User fixed successfully:', JSON.stringify(res.rows[0], null, 2));
            console.log('New Password: ' + password);
        } else {
            console.log('User not found with email loroemail.com');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

fixUser();
