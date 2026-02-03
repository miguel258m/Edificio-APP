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
// GET /api/emergencias/activas - Obtener emergencias pendientes o en proceso
// =====================================================
router.get('/activas', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT e.*, 
                    u.nombre as usuario_nombre, u.apartamento as usuario_apartamento, u.telefono as usuario_telefono,
                    m.nombre as medico_nombre
             FROM emergencias e
             JOIN usuarios u ON e.usuario_id = u.id
             LEFT JOIN usuarios m ON e.atendido_por = m.id
             WHERE e.edificio_id = $1 AND e.estado IN ('activa', 'atendida')
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
// PATCH /api/emergencias/:id/atender - Un médico toma la alerta (En Proceso)
// =====================================================
router.patch('/:id/atender', async (req, res) => {
    try {
        const { id } = req.params;
        const medico_id = req.user.id;

        // Verificar que el usuario sea médico o admin
        if (req.user.rol !== 'medico' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para atender emergencias' });
        }

        const result = await pool.query(
            `UPDATE emergencias 
             SET estado = 'atendida', atendida_at = CURRENT_TIMESTAMP, atendido_por = $1
             WHERE id = $2 AND estado = 'activa'
             RETURNING *`,
            [medico_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Emergencia no disponible o ya tomada por otro médico' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al atender emergencia:', error);
        res.status(500).json({ error: 'Error al atender emergencia' });
    }
});

// =====================================================
// PATCH /api/emergencias/:id/resolver - Finalizar la atención médica
// =====================================================
router.patch('/:id/resolver', async (req, res) => {
    try {
        const { id } = req.params;

        // Solo el médico que tomó la alerta o un admin puede cerrarla
        const checkResult = await pool.query('SELECT atendido_por FROM emergencias WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });

        if (req.user.rol !== 'admin' && checkResult.rows[0].atendido_por !== req.user.id) {
            return res.status(403).json({ error: 'Solo el médico asignado puede finalizar esta atención' });
        }

        const result = await pool.query(
            `UPDATE emergencias 
             SET estado = 'resuelta'
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al resolver emergencia:', error);
        res.status(500).json({ error: 'Error al resolver emergencia' });
    }
});

// =====================================================
// GET /api/emergencias/medico/historial - Historial personal del médico
// =====================================================
router.get('/medico/historial', async (req, res) => {
    try {
        const medico_id = req.user.id;

        const result = await pool.query(
            `SELECT e.*, u.nombre as usuario_nombre, u.apartamento as usuario_apartamento
             FROM emergencias e
             JOIN usuarios u ON e.usuario_id = u.id
             WHERE e.atendido_por = $1 AND e.estado = 'resuelta'
             ORDER BY e.created_at DESC`,
            [medico_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener historial de emergencias:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

export default router;
