import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// =====================================================
// POST /api/auth/login - Iniciar sesión
// =====================================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

        // Verificar si el usuario está aprobado (si existe el campo)
        if (user.aprobado !== undefined && user.aprobado === false) {
            return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por el vigilante' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol,
                edificio_id: user.edificio_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Responder sin la contraseña
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// =====================================================
// POST /api/auth/register - Registrar nuevo usuario
// =====================================================
router.post('/register', async (req, res) => {
    try {
        const { edificio_id, nombre, email, password, rol, apartamento, telefono } = req.body;

        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Campos requeridos faltantes' });
        }

        // Verificar si el email ya existe
        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determinar si el usuario debe ser aprobado automáticamente
        // Solo residentes y admins son aprobados automáticamente
        // Los trabajadores (trabajador_pendiente) requieren aprobación
        const aprobado = rol === 'residente' || rol === 'admin';

        // Intentar insertar con campo aprobado, si falla usar query sin ese campo
        let result;
        try {
            result = await pool.query(
                `INSERT INTO usuarios (edificio_id, nombre, email, password, rol, apartamento, telefono, aprobado)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
                [edificio_id, nombre, email, hashedPassword, rol, apartamento, telefono, aprobado]
            );
        } catch (error) {
            // Si falla, probablemente es porque no existe la columna aprobado
            result = await pool.query(
                `INSERT INTO usuarios (edificio_id, nombre, email, password, rol, apartamento, telefono)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
                [edificio_id, nombre, email, hashedPassword, rol, apartamento, telefono]
            );
        }

        const newUser = result.rows[0];

        // Si el usuario no está aprobado (y el campo existe), no generar token
        if (newUser.aprobado !== undefined && !newUser.aprobado) {
            return res.status(201).json({
                message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el vigilante.',
                user: newUser,
                needsApproval: true
            });
        }

        // Generar token solo para usuarios aprobados
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                rol: newUser.rol,
                edificio_id: newUser.edificio_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: newUser
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

export default router;
