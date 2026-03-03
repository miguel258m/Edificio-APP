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

        console.log(`💰 Toggling pago: Usuario ${usuario_id}, Edificio ${edificio_id}, Estado: ${esta_pagado}`);

        if (esta_pagado) {
            // Verificar si ya existe un pago para este mes para evitar duplicados
            const existing = await pool.query(
                `SELECT 1 FROM pagos 
                 WHERE usuario_id = $1 
                 AND edificio_id = $2 
                 AND estado = 'pagado'
                 AND EXTRACT(MONTH FROM fecha_pago) = $3
                 AND EXTRACT(YEAR FROM fecha_pago) = $4`,
                [usuario_id, edificio_id, mesActual, anioActual]
            );

            if (existing.rows.length === 0) {
                // Registrar como pagado: Insertar registro en la tabla pagos
                await pool.query(
                    `INSERT INTO pagos (usuario_id, edificio_id, concepto, monto, fecha_pago, estado, metodo_pago)
                     VALUES ($1, $2, $3, $4, CURRENT_DATE, 'pagado', 'manual')`,
                    [usuario_id, edificio_id, `Mantenimiento ${mesActual}/${anioActual}`, 0]
                );
            }
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

// =====================================================
// METODOS DE PAGO
// =====================================================

// GET /api/pagos/metodos - Obtener métodos de pago (Residentes/Gerente)
router.get('/metodos', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const { solo_activos } = req.query;

        let query = 'SELECT * FROM metodos_pago WHERE edificio_id = $1';
        const params = [edificio_id];

        if (solo_activos === 'true') {
            query += ' AND activo = true';
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
});

// POST /api/pagos/metodos - Crear método de pago (Gerente/Admin)
router.post('/metodos', requireRole('gerente', 'admin'), async (req, res) => {
    try {
        const { tipo, detalles } = req.body;
        const edificio_id = req.user.edificio_id;

        if (!tipo || !detalles) {
            return res.status(400).json({ error: 'Tipo y detalles son requeridos' });
        }

        const result = await pool.query(
            `INSERT INTO metodos_pago (edificio_id, tipo, detalles)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [edificio_id, tipo, JSON.stringify(detalles || {})]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al crear método de pago:', error);
        res.status(500).json({ error: 'Error al crear método de pago' });
    }
});

// PATCH /api/pagos/metodos/:id - Actualizar método de pago (Gerente/Admin)
router.patch('/metodos/:id', requireRole('gerente', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, detalles, activo } = req.body;
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `UPDATE metodos_pago 
             SET tipo = COALESCE($1, tipo), 
                 detalles = COALESCE($2, detalles), 
                 activo = COALESCE($3, activo)
             WHERE id = $4 AND edificio_id = $5
             RETURNING *`,
            [tipo, detalles, activo, id, edificio_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Método de pago no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar método de pago:', error);
        res.status(500).json({ error: 'Error al actualizar método de pago' });
    }
});

// DELETE /api/pagos/metodos/:id - Eliminar método de pago (Gerente/Admin)
router.delete('/metodos/:id', requireRole('gerente', 'admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            'DELETE FROM metodos_pago WHERE id = $1 AND edificio_id = $2 RETURNING *',
            [id, edificio_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Método de pago no encontrado' });
        }

        res.json({ message: 'Método de pago eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar método de pago:', error);
        res.status(500).json({ error: 'Error al eliminar método de pago' });
    }
});

export default router;
