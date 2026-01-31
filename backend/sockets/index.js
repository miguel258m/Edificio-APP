// =====================================================
// SOCKET.IO HANDLERS - Manejo de eventos en tiempo real
// =====================================================

import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export function setupSocketHandlers(io) {
    // Middleware de autenticación para Socket.io
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Token no proporcionado'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error('Token inválido'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Usuario conectado: ${socket.user.email} (${socket.user.rol})`);

        // Unir al usuario a la sala de su edificio
        socket.join(`edificio_${socket.user.edificio_id}`);

        // =====================================================
        // EVENTOS DE CHAT
        // =====================================================

        socket.on('enviar_mensaje', async (data) => {
            try {
                const { destinatario_id, contenido } = data;

                // Guardar mensaje en la base de datos
                const result = await pool.query(
                    `INSERT INTO mensajes (edificio_id, remitente_id, destinatario_id, contenido)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
                    [socket.user.edificio_id, socket.user.id, destinatario_id, contenido]
                );

                const mensaje = result.rows[0];

                // Obtener información del remitente
                const userResult = await pool.query(
                    'SELECT nombre FROM usuarios WHERE id = $1',
                    [socket.user.id]
                );

                mensaje.remitente_nombre = userResult.rows[0].nombre;

                // Emitir el mensaje al destinatario
                io.to(`edificio_${socket.user.edificio_id}`).emit('nuevo_mensaje', mensaje);

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        socket.on('typing', (data) => {
            socket.broadcast.to(`edificio_${socket.user.edificio_id}`).emit('user_typing', {
                userId: socket.user.id,
                userName: socket.user.nombre
            });
        });

        // =====================================================
        // EVENTOS DE EMERGENCIA
        // =====================================================

        socket.on('nueva_emergencia', async (data) => {
            try {
                const { tipo, descripcion, ubicacion } = data;

                // Guardar emergencia en la base de datos
                const result = await pool.query(
                    `INSERT INTO emergencias (usuario_id, edificio_id, tipo, descripcion, ubicacion)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
                    [socket.user.id, socket.user.edificio_id, tipo, descripcion, ubicacion]
                );

                const emergencia = result.rows[0];

                // Obtener información del usuario
                const userResult = await pool.query(
                    'SELECT nombre, apartamento FROM usuarios WHERE id = $1',
                    [socket.user.id]
                );

                emergencia.usuario_nombre = userResult.rows[0].nombre;
                emergencia.usuario_apartamento = userResult.rows[0].apartamento;

                // Emitir alerta de emergencia a todos en el edificio
                io.to(`edificio_${socket.user.edificio_id}`).emit('nueva_emergencia', emergencia);

                console.log(`🚨 EMERGENCIA en edificio ${socket.user.edificio_id}: ${descripcion}`);

            } catch (error) {
                console.error('Error al crear emergencia:', error);
                socket.emit('error', { message: 'Error al crear emergencia' });
            }
        });

        // =====================================================
        // EVENTOS DE ALERTA GENERAL
        // =====================================================

        socket.on('alerta_general', async (data) => {
            try {
                const { titulo, mensaje, tipo } = data;

                // Solo vigilantes y admins pueden enviar alertas generales
                if (socket.user.rol !== 'vigilante' && socket.user.rol !== 'admin') {
                    return socket.emit('error', { message: 'No tienes permisos para enviar alertas' });
                }

                // Guardar alerta en la base de datos
                const result = await pool.query(
                    `INSERT INTO alertas (edificio_id, creada_por, titulo, mensaje, tipo)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
                    [socket.user.edificio_id, socket.user.id, titulo, mensaje, tipo]
                );

                const alerta = result.rows[0];

                // Emitir alerta a todos en el edificio
                io.to(`edificio_${socket.user.edificio_id}`).emit('alerta_general', alerta);

                console.log(`📢 ALERTA GENERAL en edificio ${socket.user.edificio_id}: ${titulo}`);

            } catch (error) {
                console.error('Error al enviar alerta:', error);
                socket.emit('error', { message: 'Error al enviar alerta' });
            }
        });

        // =====================================================
        // DESCONEXIÓN
        // =====================================================

        socket.on('disconnect', () => {
            console.log(`❌ Usuario desconectado: ${socket.user.email}`);
        });
    });
}
