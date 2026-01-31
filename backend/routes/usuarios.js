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

export default router;
