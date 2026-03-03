
import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/notificaciones - Obtener notificaciones del usuario
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});

// PATCH /api/notificaciones/:id/leida - Marcar como leída
router.patch('/:id/leida', async (req, res) => {
    try {
        await pool.query(
            'UPDATE notificaciones SET leida = true WHERE id = $1 AND usuario_id = $2',
            [req.params.id, req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar notificación' });
    }
});

// DELETE /api/notificaciones/todas - Eliminar todas
router.delete('/todas', async (req, res) => {
    try {
        await pool.query('DELETE FROM notificaciones WHERE usuario_id = $1', [req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar notificaciones' });
    }
});

export default router;
