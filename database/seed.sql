-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Edificio de ejemplo
INSERT INTO edificios (nombre, direccion, ciudad, codigo_postal, telefono) VALUES
('Torre del Sol', 'Av. Principal 123', 'Lima', '15001', '555-0100'),
('Residencial Los Pinos', 'Calle Las Flores 456', 'Lima', '15002', '555-0200');

-- Usuarios de ejemplo
-- Password para todos: "password123" (hasheado con bcrypt)
-- Hash: $2b$10$rKZvVqJZ5qYqX5qX5qX5qeX5qX5qX5qX5qX5qX5qX5qX5qX5qX5q

INSERT INTO usuarios (edificio_id, nombre, email, password, rol, apartamento, telefono) VALUES
-- Administrador
(1, 'Admin Principal', 'admin@edificio.com', '$2b$10$YourHashedPasswordHere', 'admin', NULL, '555-1001'),

-- Vigilante Torre del Sol
(1, 'Juan Pérez', 'vigilante@edificio.com', '$2b$10$YourHashedPasswordHere', 'vigilante', 'Caseta', '555-1002'),

-- Residentes Torre del Sol
(1, 'María García', 'maria@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '101', '555-1101'),
(1, 'Carlos López', 'carlos@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '102', '555-1102'),
(1, 'Ana Martínez', 'ana@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '201', '555-1201'),
(1, 'Pedro Rodríguez', 'pedro@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '202', '555-1202'),

-- Vigilante Residencial Los Pinos
(2, 'Luis Fernández', 'vigilante2@edificio.com', '$2b$10$YourHashedPasswordHere', 'vigilante', 'Caseta', '555-2002'),

-- Residentes Residencial Los Pinos
(2, 'Laura Sánchez', 'laura@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '301', '555-2101'),
(2, 'Roberto Torres', 'roberto@email.com', '$2b$10$YourHashedPasswordHere', 'residente', '302', '555-2102');

-- Solicitudes de ejemplo
INSERT INTO solicitudes (usuario_id, edificio_id, tipo, descripcion, detalles, estado, prioridad) VALUES
(3, 1, 'medica', 'Necesito atención médica urgente', '{"sintomas": "dolor de cabeza intenso"}', 'pendiente', 'alta'),
(4, 1, 'limpieza', 'Solicito limpieza del área común', '{"area": "salón de eventos", "fecha_preferida": "2024-02-01"}', 'pendiente', 'media'),
(5, 1, 'entretenimiento', 'Reserva para fiesta de cumpleaños', '{"con_alcohol": true, "fecha": "2024-02-15", "hora": "19:00", "invitados": 25}', 'pendiente', 'baja'),
(6, 1, 'limpieza', 'Limpieza de mi apartamento', '{"area": "apartamento 202"}', 'completada', 'media');

-- Mensajes de ejemplo
INSERT INTO mensajes (edificio_id, remitente_id, destinatario_id, contenido, leido) VALUES
(1, 3, 2, 'Hola, ¿está disponible el vigilante?', true),
(1, 2, 3, 'Sí, ¿en qué puedo ayudarle?', true),
(1, 3, 2, 'Tengo una visita programada para las 3pm', false),
(1, 4, 2, '¿Llegó mi paquete?', false);

-- Pagos de ejemplo
INSERT INTO pagos (usuario_id, edificio_id, concepto, monto, fecha_pago, metodo_pago, estado) VALUES
(3, 1, 'Mantenimiento Enero 2024', 150.00, '2024-01-15', 'Transferencia', 'pagado'),
(4, 1, 'Mantenimiento Enero 2024', 150.00, '2024-01-20', 'Efectivo', 'pagado'),
(5, 1, 'Mantenimiento Febrero 2024', 150.00, '2024-02-01', 'Transferencia', 'pendiente'),
(6, 1, 'Mantenimiento Febrero 2024', 150.00, '2024-02-05', NULL, 'vencido');

-- Emergencias de ejemplo
INSERT INTO emergencias (usuario_id, edificio_id, tipo, descripcion, ubicacion, estado) VALUES
(3, 1, 'Incendio', 'Humo en el pasillo', 'Piso 1', 'resuelta'),
(5, 1, 'Robo', 'Intento de robo en estacionamiento', 'Sótano', 'atendida');

-- Alertas de ejemplo
INSERT INTO alertas (edificio_id, creada_por, titulo, mensaje, tipo) VALUES
(1, 2, 'Corte de agua programado', 'Mañana habrá corte de agua de 8am a 12pm por mantenimiento', 'informativa'),
(1, 2, 'Emergencia resuelta', 'Se ha controlado la situación de emergencia en el piso 1', 'emergencia');

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Datos de prueba insertados correctamente';
    RAISE NOTICE '👤 Usuarios creados: 1 admin, 2 vigilantes, 6 residentes';
    RAISE NOTICE '📝 Credenciales de prueba:';
    RAISE NOTICE '   Admin: admin@edificio.com / password123';
    RAISE NOTICE '   Vigilante: vigilante@edificio.com / password123';
    RAISE NOTICE '   Residente: maria@email.com / password123';
END $$;
