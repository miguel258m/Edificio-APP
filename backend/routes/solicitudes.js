import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// =====================================================
// POST /api/solicitudes - Crear nueva solicitud
// =====================================================
router.post('/', async (req, res) => {
    try {
        const { tipo, descripcion, detalles, prioridad } = req.body;
        const usuario_id = req.user.id;
        const edificio_id = req.user.edificio_id;

        if (!tipo || !descripcion) {
            return res.status(400).json({ error: 'Tipo y descripción son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO solicitudes (usuario_id, edificio_id, tipo, descripcion, detalles, prioridad)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [usuario_id, edificio_id, tipo, descripcion, JSON.stringify(detalles || {}), prioridad || 'media']
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear solicitud' });
    }
});

// =====================================================
// GET /api/solicitudes/mis-solicitudes - Obtener mis solicitudes
// =====================================================
router.get('/mis-solicitudes', async (req, res) => {
    try {
        const usuario_id = req.user.id;

        const result = await pool.query(
            `SELECT s.*, u.nombre as usuario_nombre, u.apartamento as usuario_apartamento
       FROM solicitudes s
       JOIN usuarios u ON s.usuario_id = u.id
       WHERE s.usuario_id = $1
       ORDER BY s.fecha_solicitud DESC`,
            [usuario_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
});

// =====================================================
// GET /api/solicitudes - Obtener todas las solicitudes (vigilante/admin)
// =====================================================
router.get('/', async (req, res) => {
    try {
        const { estado, tipo } = req.query;
        const edificio_id = req.user.edificio_id;

        let query = `
      SELECT s.*, u.nombre as usuario_nombre, u.apartamento as usuario_apartamento
      FROM solicitudes s
      JOIN usuarios u ON s.usuario_id = u.id
      WHERE s.edificio_id = $1
    `;

        const params = [edificio_id];

        if (estado) {
            params.push(estado);
            query += ` AND s.estado = $${params.length}`;
        }

        if (tipo) {
            params.push(tipo);
            query += ` AND s.tipo = $${params.length}`;
        }

        query += ' ORDER BY s.fecha_solicitud DESC';

        const result = await pool.query(query, params);

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
});

// =====================================================
// PATCH /api/solicitudes/:id - Actualizar estado de solicitud
// =====================================================
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const result = await pool.query(
            `UPDATE solicitudes 
       SET estado = $1, fecha_atencion = CURRENT_TIMESTAMP, atendido_por = $2
       WHERE id = $3
       RETURNING *`,
            [estado, req.user.id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        res.status(500).json({ error: 'Error al actualizar solicitud' });
    }
});

// =====================================================
// PATCH /api/solicitudes/:id/estado - Actualizar estado de solicitud
// =====================================================
router.patch('/:id/estado', requireRole('admin', 'vigilante', 'limpieza'), async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const validEstados = ['pendiente', 'en_proceso', 'completada', 'rechazada'];
        if (!validEstados.includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const result = await pool.query(
            `UPDATE solicitudes 
             SET estado = $1 
             WHERE id = $2 
             RETURNING *`,
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});

export default router;
