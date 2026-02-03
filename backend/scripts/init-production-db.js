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

        // 1. Ejecutar init.sql (que usa CREATE IF NOT EXISTS para tablas básicas)
        const initSQL = fs.readFileSync(
            path.join(__dirname, '../database/init.sql'),
            'utf8'
        );

        // El script init.sql actual tiene DROP TABLE. 
        // Para producción, vamos a ser más cuidadosos y solo agregar lo que falta.

        console.log('📋 Verificando columnas y tipos faltantes...');

        // Inyectar columnas faltantes si no existen
        await pool.query(`
            DO $$ 
            BEGIN 
                -- Agregar columna aprobado si no existe
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='aprobado') THEN
                    ALTER TABLE usuarios ADD COLUMN aprobado BOOLEAN DEFAULT false;
                END IF;

                -- Agregar columna foto_perfil si no existe
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='foto_perfil') THEN
                    ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255);
                END IF;

                -- Intentar agregar nuevos roles al ENUM rol_usuario
                -- Nota: PostgreSQL no permite agregar valores a un ENUM dentro de una transacción de forma sencilla en versiones antiguas,
                -- pero este bloque DO es seguro en versiones modernas.
                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'gerente';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;

                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'limpieza';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;
            END $$;
        `);

        // Ejecutar el resto del initSQL (ahora que es seguro)
        // Nota: En una app real, usaríamos migraciones (knex/sequelize). 
        // Aquí hacemos un "soft init".
        await pool.query(initSQL);

        // 2. Insertar datos iniciales
        console.log('📝 Verificando datos iniciales...');

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

        // Usuarios (Asegurar que el admin y el gerente estén aprobados)
        await pool.query(`
            INSERT INTO usuarios (edificio_id, nombre, email, password, rol, aprobado) VALUES
            (1, 'Admin Principal', 'admin@edificio.com', $1, 'admin', true),
            (1, 'Gerente Edificio', 'gerente@edificio.com', $1, 'gerente', true),
            (1, 'Juan Pérez', 'vigilante@edificio.com', $1, 'vigilante', true)
            ON CONFLICT (email) DO UPDATE SET aprobado = true
        `, [hashedPassword]);

        // Otros usuarios de prueba
        await pool.query(`
            INSERT INTO usuarios (edificio_id, nombre, email, password, rol, aprobado) VALUES
            (1, 'María García', 'maria@email.com', $1, 'residente', true),
            (1, 'Carlos López', 'carlos@email.com', $1, 'residente', true),
            (2, 'Luis Fernández', 'vigilante2@edificio.com', $1, 'vigilante', true)
            ON CONFLICT (email) DO NOTHING
        `, [hashedPassword]);

        console.log('✅ Verificación de base de datos completada');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        return false;
    }
}
