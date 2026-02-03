import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta de uploads si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

import { testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import solicitudesRoutes from './routes/solicitudes.js';
import mensajesRoutes from './routes/mensajes.js';
import pagosRoutes from './routes/pagos.js';
import emergenciasRoutes from './routes/emergencias.js';
import alertasRoutes from './routes/alertas.js';
import edificiosRoutes from './routes/edificios.js';

import { setupSocketHandlers } from './sockets/index.js';
import { initDatabase } from './scripts/init-production-db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://edificio-app.onrender.com',
    'https://edificio-frontend-production.up.railway.app'
];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

// Seguridad - Configurado para permitir cargar imágenes desde otros dominios (CORS)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Deshabilitamos CSP temporalmente para facilitar desarrollo con múltiples puertos
}));

// CORS - Configuración flexible
app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (como apps móviles o curl)
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
            origin.endsWith('.railway.app') ||
            origin.endsWith('.up.railway.app') ||
            process.env.NODE_ENV !== 'production';

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn('🛑 CORS bloqueado para origin:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para fotos de perfil)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // Aumentado para desarrollo y pruebas intensas
    message: {
        error: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo en 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// =====================================================
// ROUTES
// =====================================================

app.get('/', (req, res) => {
    res.json({
        message: '🏢 API de Administración de Edificios',
        version: '1.0.0',
        status: 'online'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/emergencias', emergenciasRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/edificios', edificiosRoutes);

// Endpoint temporal para inicializar la base de datos en producción
app.get('/api/init-db', async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const scriptPath = path.join(__dirname, 'scripts', 'init-production-db.js');

        console.log('Ejecutando script de inicialización:', scriptPath);

        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al inicializar BD:', error);
                return res.status(500).json({
                    error: 'Error al inicializar base de datos',
                    details: error.message,
                    stderr: stderr
                });
            }

            console.log('✅ Base de datos inicializada:', stdout);
            res.json({
                success: true,
                message: 'Base de datos inicializada correctamente',
                output: stdout
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// =====================================================
// SOCKET.IO
// =====================================================

setupSocketHandlers(io);

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
    try {
        console.log('--- Configuración del Entorno ---');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('PORT:', process.env.PORT);
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada (OK)' : 'NO CONFIGURADA (Error)');
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configurada (OK)' : 'NO CONFIGURADA (Error)');
        console.log('--------------------------------');

        // Inicializar/Verificar base de datos
        await initDatabase();

        // Verificar conexión a base de datos
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }

        // Iniciar servidor en todas las interfaces de red
        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log('');
            console.log('🚀 ========================================');
            console.log(`🏢 Servidor de Edificio App iniciado`);
            console.log(`📡 Puerto: ${PORT}`);
            console.log(`🌐 URL Local: http://localhost:${PORT}`);
            console.log(`📱 URL Red: http://192.168.18.5:${PORT}`);
            console.log(`🔌 WebSocket: Activo`);
            console.log(`🗄️  Base de datos: Conectada`);
            console.log('========================================');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('👋 Cerrando servidor...');
    httpServer.close(() => {
        console.log('✅ Servidor cerrado');
        process.exit(0);
    });
});
