import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// =====================================================
// POST /api/pagos - Registrar nuevo pago
// =====================================================
router.post('/', async (req, res) => {
    try {
        const { concepto, monto, fecha_pago, metodo_pago, comprobante } = req.body;
        const usuario_id = req.user.id;
        const edificio_id = req.user.edificio_id;

        if (!concepto || !monto || !fecha_pago) {
            return res.status(400).json({ error: 'Concepto, monto y fecha son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO pagos (usuario_id, edificio_id, concepto, monto, fecha_pago, metodo_pago, comprobante, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pagado')
       RETURNING *`,
            [usuario_id, edificio_id, concepto, monto, fecha_pago, metodo_pago, comprobante]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

// =====================================================
// GET /api/pagos/mis-pagos - Obtener mis pagos
// =====================================================
router.get('/mis-pagos', async (req, res) => {
    try {
        const usuario_id = req.user.id;

        const result = await pool.query(
            `SELECT * FROM pagos
       WHERE usuario_id = $1
       ORDER BY fecha_pago DESC`,
            [usuario_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

// =====================================================
// GET /api/pagos - Obtener todos los pagos (admin/vigilante)
// =====================================================
router.get('/', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const { estado } = req.query;

        let query = `
      SELECT p.*, u.nombre as usuario_nombre, u.apartamento as usuario_apartamento
      FROM pagos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.edificio_id = $1
    `;

        const params = [edificio_id];

        if (estado) {
            params.push(estado);
            query += ` AND p.estado = $${params.length}`;
        }

        query += ' ORDER BY p.fecha_pago DESC';

        const result = await pool.query(query, params);

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

// =====================================================
// GET /api/pagos/estado-residentes - Estado de pagos (Gerente/Admin)
// ===================================
router.get('/estado-residentes', requireRole('gerente', 'admin'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        // Query para obtener residentes y ver si tienen un pago 'pagado' en el mes actual
        const query = `
            SELECT 
                u.id, 
                u.nombre as usuario_nombre, 
                u.apartamento as usuario_apartamento,
                u.email,
                EXISTS (
                    SELECT 1 
                    FROM pagos p 
                    WHERE p.usuario_id = u.id 
                    AND p.edificio_id = u.edificio_id 
                    AND p.estado = 'pagado'
                    AND EXTRACT(MONTH FROM p.fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE)
                    AND EXTRACT(YEAR FROM p.fecha_pago) = EXTRACT(YEAR FROM CURRENT_DATE)
                ) as esta_pagado
            FROM usuarios u
            WHERE u.edificio_id = $1 AND u.rol = 'residente' AND u.aprobado = true
            ORDER BY u.apartamento ASC, u.nombre ASC
        `;

        const result = await pool.query(query, [edificio_id]);
        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener estado de pagos de residentes:', error);
        res.status(500).json({ error: 'Error al obtener estado de pagos' });
    }
});

export default router;
