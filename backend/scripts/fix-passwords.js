import bcrypt from 'bcrypt';
import pool from '../config/database.js';

async function fixPasswords() {
    try {
        console.log('🔧 Arreglando contraseñas...');

        // Generar hash de "password123"
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('✅ Hash generado:', hashedPassword);

        // Actualizar todas las contraseñas
        const result = await pool.query(
            `UPDATE usuarios 
             SET password = $1 
             WHERE email IN (
                 'admin@edificio.com', 
                 'vigilante@edificio.com', 
                 'maria@email.com', 
                 'carlos@email.com', 
                 'ana@email.com', 
                 'pedro@email.com', 
                 'vigilante2@edificio.com', 
                 'laura@email.com', 
                 'roberto@email.com'
             )`,
            [hashedPassword]
        );

        console.log(`✅ ${result.rowCount} contraseñas actualizadas`);
        console.log('');
        console.log('📝 Credenciales de prueba:');
        console.log('   Admin: admin@edificio.com / password123');
        console.log('   Vigilante: vigilante@edificio.com / password123');
        console.log('   Residente: maria@email.com / password123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixPasswords();
