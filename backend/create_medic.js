import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function createMedic() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query(`
            INSERT INTO usuarios (edificio_id, nombre, email, password, rol, activo) 
            VALUES (1, 'Dr. Gregory House', 'doctor@edificio.com', $1, 'medico', true)
            ON CONFLICT (email) DO UPDATE SET rol = 'medico', activo = true
        `, [hashedPassword]);
        console.log('✅ Usuario médico creado: doctor@edificio.com / password123');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
}

createMedic();
