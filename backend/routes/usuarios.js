import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuración de multer para fotos de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
});

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
// GET /api/usuarios/medicos - Obtener médicos del edificio (para residentes)
// =====================================================
router.get('/medicos', async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;

        const result = await pool.query(
            `SELECT id, nombre, email, rol, activo, created_at
             FROM usuarios
             WHERE edificio_id = $1 AND rol = 'medico' AND activo = true
             ORDER BY nombre ASC`,
            [edificio_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener médicos:', error);
        res.status(500).json({ error: 'Error al obtener médicos' });
    }
});

// =====================================================
// PATCH /api/usuarios/perfil - Actualizar perfil del usuario
// =====================================================
router.patch('/perfil', async (req, res) => {
    try {
        const { nombre, email, telefono, apartamento } = req.body;
        const userId = req.user.id;

        // Verificar si el email ya existe en otro usuario
        if (email) {
            const existing = await pool.query('SELECT id FROM usuarios WHERE email = $1 AND id != $2', [email, userId]);
            if (existing.rows.length > 0) {
                return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
            }
        }

        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = COALESCE($1, nombre),
                 email = COALESCE($2, email),
                 telefono = COALESCE($3, telefono),
                 apartamento = COALESCE($4, apartamento)
             WHERE id = $5
             RETURNING id, nombre, email, telefono, apartamento, rol, foto_perfil`,
            [nombre, email, telefono, apartamento, userId]
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
// POST /api/usuarios/foto-perfil - Subir foto de perfil
// =====================================================
router.post('/foto-perfil', upload.single('foto'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        const userId = req.user.id;
        const fotoUrl = `/uploads/${req.file.filename}`;

        // Obtener foto anterior para eliminarla
        const prevResult = await pool.query('SELECT foto_perfil FROM usuarios WHERE id = $1', [userId]);
        const oldFoto = prevResult.rows[0]?.foto_perfil;

        // Actualizar base de datos
        await pool.query('UPDATE usuarios SET foto_perfil = $1 WHERE id = $2', [fotoUrl, userId]);

        // Eliminar foto anterior si existe y no es la predeterminada
        if (oldFoto && oldFoto.startsWith('/uploads/')) {
            const oldPath = path.join(path.resolve(), oldFoto);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        res.json({ foto_perfil: fotoUrl });

    } catch (error) {
        console.error('Error al subir foto:', error);
        res.status(500).json({ error: 'Error al subir foto' });
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
        console.error('Error al aprobar usuario - DETALLE:', error);
        res.status(500).json({ error: 'Error al aprobar usuario: ' + error.message });
    }
});

// =====================================================
// GET /api/usuarios/pendientes - Usuarios pendientes de aprobación
// =====================================================
router.get('/pendientes', requireRole('admin', 'gerente', 'vigilante'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const rol = req.user.rol;

        let result;
        if (rol === 'admin') {
            // Admin ve todos los edificios
            result = await pool.query(
                `SELECT u.id, u.nombre, u.email, u.telefono, u.rol, u.apartamento, u.created_at, e.nombre as edificio_nombre
                 FROM usuarios u
                 LEFT JOIN edificios e ON u.edificio_id = e.id
                 WHERE u.aprobado = false
                 ORDER BY u.created_at DESC`
            );
        } else {
            // Otros ven solo su edificio
            result = await pool.query(
                `SELECT id, nombre, email, telefono, rol, apartamento, created_at
                 FROM usuarios 
                 WHERE edificio_id = $1 AND aprobado = false
                 ORDER BY created_at DESC`,
                [edificio_id]
            );
        }

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener usuarios pendientes:', error);
        res.status(500).json({ error: 'Error al obtener usuarios pendientes: ' + error.message });
    }
});

// =====================================================
// GET /api/usuarios/aprobados - Usuarios aprobados
// =====================================================
router.get('/aprobados', requireRole('admin', 'gerente', 'vigilante'), async (req, res) => {
    try {
        const edificio_id = req.user.edificio_id;
        const rol = req.user.rol;

        let result;
        if (rol === 'admin') {
            result = await pool.query(
                `SELECT u.id, u.nombre, u.email, u.rol, u.apartamento, u.created_at, e.nombre as edificio_nombre
                 FROM usuarios u
                 LEFT JOIN edificios e ON u.edificio_id = e.id
                 WHERE u.aprobado = true AND u.rol != 'admin'
                 ORDER BY u.created_at DESC`
            );
        } else {
            result = await pool.query(
                `SELECT id, nombre, email, rol, apartamento, created_at
                 FROM usuarios 
                 WHERE edificio_id = $1 AND aprobado = true AND rol != 'admin'
                 ORDER BY created_at DESC`,
                [edificio_id]
            );
        }

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener usuarios aprobados:', error);
        res.status(500).json({ error: 'Error al obtener usuarios aprobados: ' + error.message });
    }
});

// =====================================================
// PATCH /api/usuarios/:id/password - Cambiar contraseña (admin/gerente)
// =====================================================
router.patch('/:id/password', requireRole('admin', 'gerente'), async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 4) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'UPDATE usuarios SET password = $1 WHERE id = $2 RETURNING id, nombre',
            [hashedPassword, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada correctamente', usuario: result.rows[0].nombre });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
});

// =====================================================
// DELETE /api/usuarios/:id - Eliminar usuario
// =====================================================
router.delete('/:id', requireRole('admin', 'gerente'), async (req, res) => {
    try {
        const { id } = req.params;
        const requesterRol = req.user.rol;

        let query;
        let params = [id];

        if (requesterRol === 'admin') {
            // Admin puede eliminar a cualquier usuario menos a sí mismo
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
            }
            query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
        } else {
            // Gerente solo puede eliminar si el usuario NO está aprobado
            query = 'DELETE FROM usuarios WHERE id = $1 AND aprobado = false RETURNING id';
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o no tienes permisos para eliminarlo' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

export default router;
