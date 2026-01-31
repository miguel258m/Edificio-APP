import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración para producción (Render) o desarrollo (local)
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
            max: 20, // Máximo de conexiones en el pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            database: process.env.DB_NAME || 'edificio_db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'admin123',
            max: 20, // Máximo de conexiones en el pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
);

// Evento de error
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
    process.exit(-1);
});

// Función para verificar conexión
export async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a PostgreSQL exitosa');
        const result = await client.query('SELECT NOW()');
        console.log('🕐 Hora del servidor DB:', result.rows[0].now);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', error.message);
        return false;
    }
}

export default pool;
