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

// =====================================================
// GET /api/mensajes/conversaciones - Obtener lista de conversaciones
// =====================================================
router.get('/conversaciones', async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const result = await pool.query(
            `WITH partners AS (
                SELECT DISTINCT
                    CASE 
                        WHEN remitente_id = $1 THEN destinatario_id
                        ELSE remitente_id
                    END AS partner_id
                FROM mensajes
                WHERE remitente_id = $1 OR destinatario_id = $1
            ),
            last_msgs AS (
                SELECT DISTINCT ON (p.partner_id)
                    p.partner_id,
                    m.contenido,
                    m.created_at,
                    m.remitente_id
                FROM partners p
                JOIN mensajes m ON 
                    (m.remitente_id = $1 AND m.destinatario_id = p.partner_id)
                    OR (m.remitente_id = p.partner_id AND m.destinatario_id = $1)
                ORDER BY p.partner_id, m.created_at DESC
            ),
            unread AS (
                SELECT 
                    remitente_id AS partner_id,
                    COUNT(*) AS no_leidos
                FROM mensajes
                WHERE destinatario_id = $1 AND leido = false
                GROUP BY remitente_id
            )
            SELECT 
                p.partner_id AS usuario_id,
                u.nombre,
                lm.contenido AS ultimo_mensaje,
                lm.created_at AS ultima_fecha,
                COALESCE(ur.no_leidos, 0) AS no_leidos
            FROM partners p
            JOIN usuarios u ON u.id = p.partner_id
            LEFT JOIN last_msgs lm ON lm.partner_id = p.partner_id
            LEFT JOIN unread ur ON ur.partner_id = p.partner_id
            ORDER BY lm.created_at DESC NULLS LAST`,
            [currentUserId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        res.status(500).json({ error: 'Error al obtener conversaciones' });
    }
});

export default router;
