import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// =====================================================
// POST /api/emergencias - Crear nueva emergencia
// =====================================================
router.post('/', async (req, res) => {
    try {
        const { tipo, descripcion, ubicacion } = req.body;
        const usuario_id = req.user.id;
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `INSERT INTO emergencias (usuario_id, edificio_id, tipo, descripcion, ubicacion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [usuario_id, edificio_id, tipo, descripcion, ubicacion]
        );

        const emergencia = result.rows[0];

        // Emitir evento de Socket.io para notificar en tiempo real
        // (esto se manejará en el socket handler)

        res.status(201).json(emergencia);

    } catch (error) {
        console.error('Error al crear emergencia:', error);
        res.status(500).json({ error: 'Error al crear emergencia' });
    }
});

// =====================================================
// GET /api/emergencias/activas - Obtener emergencias activas
// =====================================================
router.get('/activas', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT e.*, u.nombre as usuario_nombre, u.apartamento as usuario_apartamento, u.telefono as usuario_telefono
       FROM emergencias e
       JOIN usuarios u ON e.usuario_id = u.id
       WHERE e.edificio_id = $1 AND e.estado = 'activa'
       ORDER BY e.created_at DESC`,
            [edificio_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener emergencias:', error);
        res.status(500).json({ error: 'Error al obtener emergencias' });
    }
});

// =====================================================
// PATCH /api/emergencias/:id/atender - Marcar emergencia como atendida
// =====================================================
router.patch('/:id/atender', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE emergencias 
       SET estado = 'atendida', atendida_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Emergencia no encontrada' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al atender emergencia:', error);
        res.status(500).json({ error: 'Error al atender emergencia' });
    }
});

export default router;
