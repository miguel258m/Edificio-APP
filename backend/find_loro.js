
import pool from './config/database.js';

async function check() {
    try {
        const res = await pool.query("SELECT * FROM usuarios WHERE email = 'loroemail.com'");
        if (res.rows.length > 0) {
            console.log('User found:', JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log('User not found.');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit();
    }
}

check();
