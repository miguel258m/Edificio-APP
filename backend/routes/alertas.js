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
        const { titulo, mensaje, tipo, edificio_id: selected_edificio_id } = req.body;
        const creada_por = req.user.id;
        let edificio_id = req.user.edificio_id;

        // Si es admin, puede elegir el edificio o dejarlo NULL para global
        if (req.user.rol === 'admin') {
            edificio_id = selected_edificio_id || null;
        }

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
        alerta.creada_por_nombre = req.user.nombre;

        // Emitir evento de Socket.io
        const io = req.app.get('io');
        if (io) {
            if (edificio_id === null) {
                // Notificar a todos los edificios (Aviso Global)
                io.emit('alerta_general', alerta);
            } else {
                // Notificar solo al edificio específico
                io.to(`edificio_${edificio_id}`).emit('alerta_general', alerta);
            }
        }

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
        const { rol, edificio_id } = req.user;
        const { limit = 50 } = req.query;

        let query;
        let params;

        if (rol === 'admin') {
            // El admin ve TODOS los avisos del sistema para poder gestionarlos
            query = `
                SELECT a.*, u.nombre as creada_por_nombre, e.nombre as edificio_nombre
                FROM alertas a
                LEFT JOIN usuarios u ON a.creada_por = u.id
                LEFT JOIN edificios e ON a.edificio_id = e.id
                ORDER BY a.created_at DESC
                LIMIT $1
            `;
            params = [limit];
        } else {
            // Residentes y vigilantes solo ven los de su edificio o globales
            query = `
                SELECT a.*, u.nombre as creada_por_nombre, e.nombre as edificio_nombre
                FROM alertas a
                LEFT JOIN usuarios u ON a.creada_por = u.id
                LEFT JOIN edificios e ON a.edificio_id = e.id
                WHERE a.edificio_id = $1 OR a.edificio_id IS NULL
                ORDER BY a.created_at DESC
                LIMIT $2
            `;
            params = [edificio_id, limit];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
});

export default router;
