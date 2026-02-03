import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

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

// =====================================================
// PATCH /api/pagos/toggle-estado - Alternar estado de pago manual (Gerente/Admin)
// =====================================================
router.patch('/toggle-estado', requireRole('gerente', 'admin'), async (req, res) => {
    try {
        const { usuario_id, esta_pagado } = req.body;
        const edificio_id = req.user.edificio_id;

        if (!usuario_id) {
            return res.status(400).json({ error: 'ID de usuario es requerido' });
        }

        const mesActual = new Date().getMonth() + 1;
        const anioActual = new Date().getFullYear();

        if (esta_pagado) {
            // Registrar como pagado: Insertar registro en la tabla pagos
            await pool.query(
                `INSERT INTO pagos (usuario_id, edificio_id, concepto, monto, fecha_pago, estado, metodo_pago)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, 'pagado', 'manual')
                 ON CONFLICT DO NOTHING`,
                [usuario_id, edificio_id, `Mantenimiento ${mesActual}/${anioActual}`, 0]
            );
        } else {
            // Quitar pago: Eliminar registros de este mes de la tabla pagos
            await pool.query(
                `DELETE FROM pagos 
                 WHERE usuario_id = $1 
                 AND edificio_id = $2 
                 AND estado = 'pagado'
                 AND EXTRACT(MONTH FROM fecha_pago) = $3
                 AND EXTRACT(YEAR FROM fecha_pago) = $4`,
                [usuario_id, edificio_id, mesActual, anioActual]
            );
        }

        res.json({ success: true, message: 'Estado de pago actualizado correctamente' });

    } catch (error) {
        console.error('Error al alternar estado de pago:', error);
        res.status(500).json({ error: 'Error al actualizar estado de pago' });
    }
});

export default router;
