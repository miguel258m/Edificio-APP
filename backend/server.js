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

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
        credentials: true
    }
});

const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

// Seguridad
app.use(helmet());

// CORS - Permitir acceso desde cualquier origen en desarrollo
app.use(cors({
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests por ventana
});
app.use('/api/', limiter);

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
