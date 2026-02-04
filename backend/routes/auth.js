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
// POST /api/auth/google - Iniciar sesión con Google
// =====================================================
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "776968650110-n2idk31b0dj0g03me0fm2tvtu9fiogte.apps.googleusercontent.com");

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        // 1. Verificar el token con Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || "776968650110-n2idk31b0dj0g03me0fm2tvtu9fiogte.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        // 2. Buscar usuario en nuestra BD
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
            [email]
        );

        if (result.rows.length === 0) {
            // Usuario no existe - Devolvemos bandera para auto-registro en el frontend
            return res.json({
                newUser: true,
                email,
                nombre: payload.name,
                foto: payload.picture,
                token_google: token // Re-enviamos el token para validarlo en el paso final
            });
        }

        const user = result.rows[0];

        // 3. Verificar si está aprobado
        if (user.aprobado !== undefined && user.aprobado === false) {
            return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por el vigilante' });
        }

        // 4. Generar Token JWT de nuestra App
        const appToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol,
                edificio_id: user.edificio_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token: appToken,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en Google Login:', error);
        res.status(500).json({ error: 'Error al validar con Google' });
    }
});

// =====================================================
// POST /api/auth/google-register - Registrar con Google
// =====================================================
router.post('/google-register', async (req, res) => {
    try {
        const { token_google, edificio_id, rol, apartamento, telefono } = req.body;

        if (!token_google || !edificio_id || !rol) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para el registro' });
        }

        // 1. Validar token nuevamente por seguridad
        const ticket = await client.verifyIdToken({
            idToken: token_google,
            audience: process.env.GOOGLE_CLIENT_ID || "776968650110-n2idk31b0dj0g03me0fm2tvtu9fiogte.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // 2. Verificar si ya se registró mientras tanto
        const existing = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Este correo ya tiene una cuenta activa' });
        }

        // 3. Crear el usuario (aprobado = false por defecto)
        // Generamos una contraseña aleatoria ya que Google Auth no la requiere
        const randomPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const result = await pool.query(
            `INSERT INTO usuarios 
             (edificio_id, nombre, email, password, rol, apartamento, telefono, foto_perfil, aprobado) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING id, nombre, email, rol, edificio_id, aprobado`,
            [edificio_id, name, email, hashedPassword, rol, apartamento, telefono, picture, false]
        );

        const newUser = result.rows[0];

        // 4. Generar Token App
        const appToken = jwt.sign(
            { id: newUser.id, email: newUser.email, rol: newUser.rol, edificio_id: newUser.edificio_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registro solicitado correctamente',
            token: appToken,
            user: newUser
        });

    } catch (error) {
        console.error('Error en Google Register:', error);
        res.status(500).json({ error: 'Error al procesar el registro con Google' });
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

        // Solo admins son aprobados automáticamente
        // Residentes y trabajadores requieren aprobación
        const aprobado = rol === 'admin';

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
        res.status(500).json({ error: 'Error al registrar usuario: ' + error.message });
    }
});

export default router;
