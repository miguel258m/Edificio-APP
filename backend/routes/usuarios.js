import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// =====================================================
// GET /api/usuarios - Obtener usuarios del edificio (admin/vigilante)
// =====================================================
router.get('/', requireRole('admin', 'vigilante'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const { rol } = req.query;

        let query = `
      SELECT id, edificio_id, nombre, email, rol, apartamento, telefono, activo, created_at
      FROM usuarios
      WHERE edificio_id = $1
    `;

        const params = [edificio_id];

        if (rol) {
            params.push(rol);
            query += ` AND rol = $${params.length}`;
        }

        query += ' ORDER BY nombre ASC';

        const result = await pool.query(query, params);

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// =====================================================
// GET /api/usuarios/vigilantes - Obtener vigilantes del edificio (para residentes)
// =====================================================
router.get('/vigilantes', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT id, nombre, email, rol, activo, created_at
       FROM usuarios
       WHERE edificio_id = $1 AND rol = 'vigilante' AND activo = true
       ORDER BY nombre ASC`,
            [edificio_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener vigilantes:', error);
        res.status(500).json({ error: 'Error al obtener vigilantes' });
    }
});

// =====================================================
// PATCH /api/usuarios/:id/aprobar - Aprobar/Rechazar usuario
// =====================================================
router.patch('/:id/aprobar', requireRole('admin', 'vigilante'), async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobado } = req.body; // true = aprobar, false = rechazar

        if (typeof aprobado !== 'boolean') {
            return res.status(400).json({ error: 'El campo aprobado debe ser true o false' });
        }

        const result = await pool.query(
            `UPDATE usuarios 
             SET aprobado = $1 
             WHERE id = $2 
             RETURNING id, nombre, email, rol, aprobado`,
            [aprobado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al aprobar usuario:', error);
        res.status(500).json({ error: 'Error al aprobar usuario' });
    }
});

export default router;
