import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
    try {
        console.log('🔧 Verificando/Inicializando base de datos...');

        // Leer y ejecutar init.sql
        const initSQL = fs.readFileSync(
            path.join(__dirname, '../database/init.sql'),
            'utf8'
        );

        console.log('📋 Creando tablas si no existen...');
        await pool.query(initSQL);

        // Insertar datos iniciales
        console.log('📝 Insertando datos iniciales...');

        // Edificios
        await pool.query(`
            INSERT INTO edificios (nombre, direccion, ciudad, codigo_postal, telefono) VALUES
            ('Torre del Sol', 'Av. Principal 123', 'Lima', '15001', '555-0100'),
            ('Residencial Los Pinos', 'Calle Las Flores 456', 'Lima', '15002', '555-0200')
            ON CONFLICT DO NOTHING
        `);

        // Generar hash de contraseña
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Usuarios
        await pool.query(`
            INSERT INTO usuarios (edificio_id, nombre, email, password, rol, apartamento, telefono) VALUES
            (1, 'Admin Principal', 'admin@edificio.com', $1, 'admin', NULL, '555-1001'),
            (1, 'Juan Pérez', 'vigilante@edificio.com', $1, 'vigilante', 'Caseta', '555-1002'),
            (1, 'María García', 'maria@email.com', $1, 'residente', '101', '555-1101'),
            (1, 'Carlos López', 'carlos@email.com', $1, 'residente', '102', '555-1102'),
            (1, 'Ana Martínez', 'ana@email.com', $1, 'residente', '201', '555-1201'),
            (1, 'Pedro Rodríguez', 'pedro@email.com', $1, 'residente', '202', '555-1202'),
            (2, 'Luis Fernández', 'vigilante2@edificio.com', $1, 'vigilante', 'Caseta', '555-2002'),
            (2, 'Laura Sánchez', 'laura@email.com', $1, 'residente', '301', '555-2101'),
            (2, 'Roberto Torres', 'roberto@email.com', $1, 'residente', '302', '555-2102')
            ON CONFLICT (email) DO NOTHING
        `, [hashedPassword]);

        console.log('✅ Verificación de base de datos completada');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        return false;
    }
}
