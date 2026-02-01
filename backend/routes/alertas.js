import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// =====================================================
// POST /api/alertas - Crear alerta general (solo vigilante/admin/gerente)
// =====================================================
router.post('/', requireRole('vigilante', 'admin', 'gerente'), async (req, res) => {
    try {
        const { titulo, mensaje, tipo } = req.body;
        const creada_por = req.user.id;
        const edificio_id = req.user.edificio_id;

        if (!titulo || !mensaje) {
            return res.status(400).json({ error: 'Título y mensaje son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO alertas (edificio_id, creada_por, titulo, mensaje, tipo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [edificio_id, creada_por, titulo, mensaje, tipo || 'informativa']
        );

        const alerta = result.rows[0];

        // Emitir evento de Socket.io para notificar a todos
        // (se manejará en el socket handler)

        res.status(201).json(alerta);

    } catch (error) {
        console.error('Error al crear alerta:', error);
        res.status(500).json({ error: 'Error al crear alerta' });
    }
});

// =====================================================
// GET /api/alertas - Obtener alertas del edificio
// =====================================================
router.get('/', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const { limit = 10 } = req.query;

        const result = await pool.query(
            `SELECT a.*, u.nombre as creada_por_nombre
       FROM alertas a
       JOIN usuarios u ON a.creada_por = u.id
       WHERE a.edificio_id = $1
       ORDER BY a.created_at DESC
       LIMIT $2`,
            [edificio_id, limit]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
});

export default router;
