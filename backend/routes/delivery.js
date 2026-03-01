import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
// Trigger restart

const router = express.Router();

// GET /api/delivery - List active services for residents (filtered by building)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { edificio_id } = req.user;
        const result = await pool.query(
            'SELECT * FROM delivery_services WHERE edificio_id = $1 AND activo = true ORDER BY created_at DESC',
            [edificio_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching delivery services:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/delivery/all - List all for manager/admin (filtered by building)
router.get('/all', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'gerente' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { edificio_id } = req.user;
        const result = await pool.query(
            'SELECT * FROM delivery_services WHERE edificio_id = $1 ORDER BY created_at DESC',
            [edificio_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all delivery services:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/delivery - Create new service (Manager only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'gerente' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { edificio_id } = req.user;
        const { nombre, descripcion, telefono } = req.body;

        if (!nombre || !telefono) {
            return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
        }

        const result = await pool.query(
            'INSERT INTO delivery_services (edificio_id, nombre, descripcion, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
            [edificio_id, nombre, descripcion, telefono]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating delivery service:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PATCH /api/delivery/:id - Update service (Manager only)
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'gerente' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { id } = req.params;
        const { nombre, descripcion, telefono, activo } = req.body;

        const result = await pool.query(
            `UPDATE delivery_services 
             SET nombre = COALESCE($1, nombre), 
                 descripcion = COALESCE($2, descripcion), 
                 telefono = COALESCE($3, telefono),
                 activo = COALESCE($4, activo)
             WHERE id = $5 AND edificio_id = $6
             RETURNING *`,
            [nombre, descripcion, telefono, activo, id, req.user.edificio_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating delivery service:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE /api/delivery/:id - Delete service (Manager only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.rol !== 'gerente' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM delivery_services WHERE id = $1 AND edificio_id = $2 RETURNING *',
            [id, req.user.edificio_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting delivery service:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
