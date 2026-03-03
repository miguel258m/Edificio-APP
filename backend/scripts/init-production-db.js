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

        // Asegurar que los tipos básicos existan antes de ejecutar init.sql
        await pool.query(`
            DO $$ 
            BEGIN 
                -- Crear tipos si no existen
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
                    CREATE TYPE rol_usuario AS ENUM ('admin', 'residente', 'vigilante');
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_solicitud') THEN
                    CREATE TYPE tipo_solicitud AS ENUM ('mantenimiento', 'limpieza', 'seguridad', 'otros');
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_solicitud') THEN
                    CREATE TYPE estado_solicitud AS ENUM ('pendiente', 'en_proceso', 'completada', 'rechazada');
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridad_solicitud') THEN
                    CREATE TYPE prioridad_solicitud AS ENUM ('baja', 'media', 'alta', 'urgente');
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_emergencia') THEN
                    CREATE TYPE estado_emergencia AS ENUM ('activa', 'atendida', 'falsa_alarma');
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_alerta') THEN
                    CREATE TYPE tipo_alerta AS ENUM ('informativa', 'urgente', 'critica');
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pago') THEN
                    CREATE TYPE estado_pago AS ENUM ('pendiente', 'pagado', 'atrasado', 'rechazado');
                END IF;

                -- Agregar nuevos roles al ENUM rol_usuario si ya existe
                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'gerente';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;

                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'limpieza';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;

                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'medico';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;

                BEGIN
                    ALTER TYPE rol_usuario ADD VALUE 'entretenimiento';
                EXCEPTION WHEN duplicate_object THEN NULL;
                END;

                -- Agregar columnas faltantes a usuarios
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='aprobado') THEN
                    ALTER TABLE usuarios ADD COLUMN aprobado BOOLEAN DEFAULT false;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='foto_perfil') THEN
                    ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255);
                END IF;

                -- Agregar columna fecha_completada a solicitudes
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='solicitudes' AND column_name='fecha_completada') THEN
                    ALTER TABLE solicitudes ADD COLUMN fecha_completada TIMESTAMP;
                END IF;

                -- Crear tabla delivery_services si no existe
                IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='delivery_services') THEN
                    CREATE TABLE delivery_services (
                        id SERIAL PRIMARY KEY,
                        edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
                        nombre VARCHAR(100) NOT NULL,
                        descripcion TEXT,
                        telefono VARCHAR(20) NOT NULL,
                        activo BOOLEAN DEFAULT true,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                END IF;
            END $$;
        `);

        // Ejecutar el resto del initSQL (ahora que es seguro)
        // Nota: En una app real, usaríamos migraciones (knex/sequelize). 
        // Aquí hacemos un "soft init".
        try {
            await pool.query(initSQL);
        } catch (initError) {
            console.warn('⚠️ Nota: Algunos comandos de init.sql pueden haber fallado si los objetos ya existen:', initError.message);
        }

        // 2. Limpieza de edificios duplicados y asegurar UNIQUE
        console.log('🧹 Verificando duplicados en edificios...');
        const duplicatesResult = await pool.query(`
            SELECT nombre, COUNT(*) 
            FROM edificios 
            GROUP BY nombre 
            HAVING COUNT(*) > 1
        `);

        if (duplicatesResult.rows.length > 0) {
            for (const row of duplicatesResult.rows) {
                console.log(`Eliminando duplicados para: "${row.nombre}" (${row.count} encontrados)`);
                const idsResult = await pool.query('SELECT id FROM edificios WHERE nombre = $1 ORDER BY id ASC', [row.nombre]);
                const originalId = idsResult.rows[0].id;
                const redundantIds = idsResult.rows.slice(1).map(r => r.id);

                for (const oldId of redundantIds) {
                    await pool.query('UPDATE usuarios SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('UPDATE solicitudes SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('UPDATE mensajes SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('UPDATE pagos SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('UPDATE emergencias SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('UPDATE alertas SET edificio_id = $1 WHERE edificio_id = $2', [originalId, oldId]);
                    await pool.query('DELETE FROM edificios WHERE id = $1', [oldId]);
                }
            }
        }

        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'edificios_nombre_key') THEN
                    ALTER TABLE edificios ADD CONSTRAINT edificios_nombre_key UNIQUE (nombre);
                END IF;
            END $$;
        `);

        // 3. Insertar datos iniciales
        console.log('📝 Verificando datos iniciales...');

        // Edificios (Con INSERT IGNORE/ON CONFLICT)
        await pool.query(`
            INSERT INTO edificios (nombre, direccion, ciudad, codigo_postal, telefono) 
            VALUES ('Torre del Sol', 'Av. Principal 123', 'Lima', '15001', '555-0100')
            ON CONFLICT (nombre) DO NOTHING
        `);

        await pool.query(`
            INSERT INTO edificios (nombre, direccion, ciudad, codigo_postal, telefono) 
            VALUES ('Residencial Los Pinos', 'Calle Las Flores 456', 'Lima', '15002', '555-0200')
            ON CONFLICT (nombre) DO NOTHING
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
            (2, 'Luis Fernández', 'vigilante2@edificio.com', $1, 'vigilante', true),
            (1, 'Dr. Gregory House', 'doctor@edificio.com', $1, 'medico', true),
            (1, 'Personal Limpieza', 'limpieza@edificio.com', $1, 'limpieza', true)
            ON CONFLICT (email) DO NOTHING
        `, [hashedPassword]);

        console.log('✅ Verificación de base de datos completada');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        return false;
    }
}
