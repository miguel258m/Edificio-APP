// Script para actualizar contraseñas con bcrypt
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function updatePasswords() {
    try {
        console.log('🔐 Generando hash de contraseña...');

        // Generar hash para "password123"
        const hashedPassword = await bcrypt.hash('password123', 10);

        console.log('Hash generado:', hashedPassword);
        console.log('Longitud:', hashedPassword.length);

        // Actualizar todos los usuarios
        const result = await pool.query(
            'UPDATE usuarios SET password = $1',
            [hashedPassword]
        );

        console.log(`✅ ${result.rowCount} contraseñas actualizadas correctamente`);
        console.log('');
        console.log('🔑 Credenciales de prueba:');
        console.log('   Email: maria@email.com');
        console.log('   Password: password123');

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updatePasswords();
