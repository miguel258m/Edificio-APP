import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// =====================================================
// GET /api/mensajes/no-leidos - Obtener mensajes no leídos
// =====================================================
router.get('/no-leidos', async (req, res) => {
    try {
        const usuario_id = req.user.id;

        const result = await pool.query(
            `SELECT m.*, u.nombre as remitente_nombre
       FROM mensajes m
       JOIN usuarios u ON m.remitente_id = u.id
       WHERE m.destinatario_id = $1 AND m.leido = false
       ORDER BY m.created_at DESC`,
            [usuario_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

// =====================================================
// GET /api/mensajes/conversacion/:userId - Obtener conversación con un usuario
// =====================================================
router.get('/conversacion/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const result = await pool.query(
            `SELECT m.*, 
              u1.nombre as remitente_nombre,
              u2.nombre as destinatario_nombre
       FROM mensajes m
       JOIN usuarios u1 ON m.remitente_id = u1.id
       JOIN usuarios u2 ON m.destinatario_id = u2.id
       WHERE (m.remitente_id = $1 AND m.destinatario_id = $2)
          OR (m.remitente_id = $2 AND m.destinatario_id = $1)
       ORDER BY m.created_at ASC`,
            [currentUserId, userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener conversación:', error);
        res.status(500).json({ error: 'Error al obtener conversación' });
    }
});

// =====================================================
// PATCH /api/mensajes/:id/leer - Marcar mensaje como leído
// =====================================================
router.patch('/:id/leer', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE mensajes 
       SET leido = true
       WHERE id = $1 AND destinatario_id = $2
       RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al marcar mensaje:', error);
        res.status(500).json({ error: 'Error al marcar mensaje' });
    }
});

// =====================================================
// PATCH /api/mensajes/conversacion/:userId/leer - Leer toda la conversación
// =====================================================
router.patch('/conversacion/:userId/leer', async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        await pool.query(
            `UPDATE mensajes 
             SET leido = true 
             WHERE remitente_id = $1 AND destinatario_id = $2 AND leido = false`,
            [userId, currentUserId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error al marcar conversación como leída:', error);
        res.status(500).json({ error: 'Error al marcar conversación como leída' });
    }
});

export default router;
