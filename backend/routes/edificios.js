import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// =====================================================
// GET /api/edificios/public - Obtener edificios (público para registro)
// =====================================================
router.get('/public', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, direccion, ciudad FROM edificios ORDER BY nombre ASC'
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener edificios:', error);
        res.status(500).json({ error: 'Error al obtener edificios' });
    }
});

// Aplicar autenticación a las rutas siguientes
router.use(authenticateToken);

// =====================================================
// GET /api/edificios - Obtener todos los edificios (admin)
// =====================================================
router.get('/', requireRole('admin'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM edificios ORDER BY nombre ASC'
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener edificios:', error);
        res.status(500).json({ error: 'Error al obtener edificios' });
    }
});

// =====================================================
// POST /api/edificios - Crear nuevo edificio (admin)
// =====================================================
router.post('/', requireRole('admin'), async (req, res) => {
    try {
        const { nombre, direccion, ciudad, codigo_postal, telefono } = req.body;

        if (!nombre || !direccion) {
            return res.status(400).json({ error: 'Nombre y dirección son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO edificios (nombre, direccion, ciudad, codigo_postal, telefono)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [nombre, direccion, ciudad, codigo_postal, telefono]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al crear edificio:', error);
        res.status(500).json({ error: 'Error al crear edificio' });
    }
});

export default router;
