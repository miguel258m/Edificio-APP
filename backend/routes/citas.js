import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// ── Crear tabla si no existe (auto-init) ─────────────────────
router.use(async (_req, _res, next) => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS citas (
      id SERIAL PRIMARY KEY,
      medico_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
      residente_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
      edificio_id INTEGER,
      titulo VARCHAR(200) NOT NULL,
      descripcion TEXT,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      estado VARCHAR(30) DEFAULT 'programada',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(() => { }); // silently ignore if already exists
    next();
});

// ── GET /api/citas - Obtener citas del médico ─────────────────
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.*, u.nombre as residente_nombre, u.apartamento as residente_apartamento
       FROM citas c
       LEFT JOIN usuarios u ON c.residente_id = u.id
       WHERE c.medico_id = $1
       ORDER BY c.fecha ASC, c.hora ASC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (e) {
        console.error('Error citas GET:', e);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});

// ── GET /api/citas/residentes - Lista residentes del edificio ─
router.get('/residentes', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, nombre, apartamento FROM usuarios
       WHERE edificio_id = $1 AND rol = 'residente' AND activo = true
       ORDER BY nombre`,
            [req.user.edificio_id]
        );
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: 'Error al obtener residentes' });
    }
});

// ── POST /api/citas - Crear cita ──────────────────────────────
router.post('/', async (req, res) => {
    try {
        if (req.user.rol !== 'medico' && req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Solo médicos pueden crear citas' });
        }
        const { titulo, descripcion, fecha, hora, residente_id } = req.body;
        if (!titulo || !fecha || !hora) {
            return res.status(400).json({ error: 'Título, fecha y hora son requeridos' });
        }
        const result = await pool.query(
            `INSERT INTO citas (medico_id, residente_id, edificio_id, titulo, descripcion, fecha, hora)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [req.user.id, residente_id || null, req.user.edificio_id, titulo, descripcion || null, fecha, hora]
        );

        const cita = result.rows[0];

        // ── Crear Notificación para el residente ──────────────────
        if (residente_id) {
            const fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
            const tituloNotif = '📅 Nueva cita agendada';
            const mensajeNotif = `El doctor ${req.user.nombre} ha agendado una cita contigo: "${titulo}" para el día ${fechaFormateada} a las ${hora?.substring(0, 5)}.`;

            await pool.query(
                `INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, data)
                 VALUES ($1, $2, $3, $4, $5)`,
                [residente_id, tituloNotif, mensajeNotif, 'cita', JSON.stringify({ cita_id: cita.id })]
            ).catch(e => console.error('Error al crear notificación:', e));

            // Emitir vía socket si está disponible
            const io = req.app.get('io');
            if (io) {
                io.to(`user_${residente_id}`).emit('notificacion', {
                    titulo: tituloNotif,
                    mensaje: mensajeNotif,
                    tipo: 'cita',
                    created_at: new Date()
                });
            }
        }

        res.status(201).json(cita);
    } catch (e) {
        console.error('Error citas POST:', e);
        res.status(500).json({ error: 'Error al crear cita' });
    }
});

// ── PATCH /api/citas/:id - Actualizar estado/datos ───────────
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha, hora, estado, residente_id } = req.body;
        const result = await pool.query(
            `UPDATE citas SET
        titulo = COALESCE($1, titulo),
        descripcion = COALESCE($2, descripcion),
        fecha = COALESCE($3, fecha),
        hora = COALESCE($4, hora),
        estado = COALESCE($5, estado),
        residente_id = COALESCE($6, residente_id)
       WHERE id = $7 AND medico_id = $8 RETURNING *`,
            [titulo, descripcion, fecha, hora, estado, residente_id, id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json(result.rows[0]);
    } catch (e) {
        console.error('Error citas PATCH:', e);
        res.status(500).json({ error: 'Error al actualizar cita' });
    }
});

// ── DELETE /api/citas/:id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM citas WHERE id = $1 AND medico_id = $2', [id, req.user.id]);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Error al eliminar cita' });
    }
});

export default router;
