-- =====================================================
-- SISTEMA DE ADMINISTRACIÓN DE EDIFICIOS
-- Script de inicialización de base de datos
-- =====================================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS alertas CASCADE;
DROP TABLE IF EXISTS emergencias CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS solicitudes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS edificios CASCADE;

-- Tipos ENUM
DROP TYPE IF EXISTS rol_usuario CASCADE;
DROP TYPE IF EXISTS tipo_solicitud CASCADE;
DROP TYPE IF EXISTS estado_solicitud CASCADE;
DROP TYPE IF EXISTS prioridad_solicitud CASCADE;
DROP TYPE IF EXISTS estado_emergencia CASCADE;
DROP TYPE IF EXISTS tipo_alerta CASCADE;
DROP TYPE IF EXISTS estado_pago CASCADE;

CREATE TYPE rol_usuario AS ENUM ('admin', 'vigilante', 'residente');
CREATE TYPE tipo_solicitud AS ENUM ('medica', 'limpieza', 'entretenimiento');
CREATE TYPE estado_solicitud AS ENUM ('pendiente', 'en_proceso', 'completada', 'cancelada');
CREATE TYPE prioridad_solicitud AS ENUM ('baja', 'media', 'alta');
CREATE TYPE estado_emergencia AS ENUM ('activa', 'atendida', 'resuelta');
CREATE TYPE tipo_alerta AS ENUM ('emergencia', 'informativa', 'mantenimiento');
CREATE TYPE estado_pago AS ENUM ('pendiente', 'pagado', 'vencido');

-- =====================================================
-- TABLA: edificios
-- =====================================================
CREATE TABLE edificios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol rol_usuario NOT NULL,
    apartamento VARCHAR(20),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: solicitudes
-- =====================================================
CREATE TABLE solicitudes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    tipo tipo_solicitud NOT NULL,
    descripcion TEXT NOT NULL,
    detalles JSONB, -- Datos adicionales específicos por tipo
    estado estado_solicitud DEFAULT 'pendiente',
    prioridad prioridad_solicitud DEFAULT 'media',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_atencion TIMESTAMP,
    atendido_por INTEGER REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: mensajes
-- =====================================================
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    remitente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: pagos
-- =====================================================
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    concepto VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago VARCHAR(50),
    comprobante VARCHAR(255),
    estado estado_pago DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: emergencias
-- =====================================================
CREATE TABLE emergencias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    tipo VARCHAR(100),
    descripcion TEXT,
    ubicacion VARCHAR(100),
    estado estado_emergencia DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendida_at TIMESTAMP
);

-- =====================================================
-- TABLA: alertas
-- =====================================================
CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE CASCADE,
    creada_por INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo tipo_alerta DEFAULT 'informativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES para mejorar rendimiento
-- =====================================================
CREATE INDEX idx_usuarios_edificio ON usuarios(edificio_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

CREATE INDEX idx_solicitudes_usuario ON solicitudes(usuario_id);
CREATE INDEX idx_solicitudes_edificio ON solicitudes(edificio_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo);

CREATE INDEX idx_mensajes_remitente ON mensajes(remitente_id);
CREATE INDEX idx_mensajes_destinatario ON mensajes(destinatario_id);
CREATE INDEX idx_mensajes_edificio ON mensajes(edificio_id);
CREATE INDEX idx_mensajes_leido ON mensajes(leido);

CREATE INDEX idx_pagos_usuario ON pagos(usuario_id);
CREATE INDEX idx_pagos_edificio ON pagos(edificio_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);

CREATE INDEX idx_emergencias_edificio ON emergencias(edificio_id);
CREATE INDEX idx_emergencias_estado ON emergencias(estado);

CREATE INDEX idx_alertas_edificio ON alertas(edificio_id);

-- =====================================================
-- Mensaje de confirmación
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos inicializada correctamente';
    RAISE NOTICE '📊 Tablas creadas: edificios, usuarios, solicitudes, mensajes, pagos, emergencias, alertas';
END $$;
