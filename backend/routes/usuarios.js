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
// PATCH /api/usuarios/perfil - Actualizar perfil del usuario
// =====================================================
router.patch('/perfil', async (req, res) => {
    try {
        const { nombre, telefono, apartamento } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = COALESCE($1, nombre),
                 telefono = COALESCE($2, telefono),
                 apartamento = COALESCE($3, apartamento)
             WHERE id = $4
             RETURNING id, nombre, email, telefono, apartamento, rol`,
            [nombre, telefono, apartamento, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
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

// =====================================================
// GET /api/usuarios/pendientes - Usuarios pendientes de aprobación
// =====================================================
router.get('/pendientes', requireRole('admin', 'gerente', 'vigilante'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT id, nombre, email, telefono, created_at
             FROM usuarios 
             WHERE edificio_id = $1 AND rol = 'trabajador_pendiente'
             ORDER BY created_at DESC`,
            [edificio_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener usuarios pendientes:', error);
        res.status(500).json({ error: 'Error al obtener usuarios pendientes' });
    }
});

// =====================================================
// GET /api/usuarios/aprobados - Usuarios aprobados
// =====================================================
router.get('/aprobados', requireRole('admin', 'gerente', 'vigilante'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT id, nombre, email, rol, created_at
             FROM usuarios 
             WHERE edificio_id = $1 AND rol != 'trabajador_pendiente'
             ORDER BY created_at DESC`,
            [edificio_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener usuarios aprobados:', error);
        res.status(500).json({ error: 'Error al obtener usuarios aprobados' });
    }
});

// =====================================================
// PATCH /api/usuarios/:id/asignar-rol - Asignar rol a trabajador
// =====================================================
router.patch('/:id/asignar-rol', requireRole('admin', 'gerente'), async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        const validRoles = ['limpieza', 'vigilante', 'gerente'];
        if (!validRoles.includes(rol)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        const result = await pool.query(
            `UPDATE usuarios 
             SET rol = $1, aprobado = true
             WHERE id = $2 AND rol = 'trabajador_pendiente'
             RETURNING id, nombre, email, rol`,
            [rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o ya aprobado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al asignar rol:', error);
        res.status(500).json({ error: 'Error al asignar rol' });
    }
});

// =====================================================
// DELETE /api/usuarios/:id - Eliminar usuario (rechazar)
// =====================================================
router.delete('/:id', requireRole('admin', 'gerente'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 AND rol = \'trabajador_pendiente\' RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

export default router;
