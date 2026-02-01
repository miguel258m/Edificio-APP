import pool from './config/database.js';

async function checkEnum() {
    try {
        const result = await pool.query(`
            SELECT enumlabel 
            FROM pg_enum 
            JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
            WHERE pg_type.typname = (
                SELECT udt_name 
                FROM information_schema.columns 
                WHERE table_name = 'alertas' AND column_name = 'tipo'
            )
        `);
        console.log('--- Valores permitidos para "tipo" (ENUM) ---');
        console.log(result.rows.map(r => r.enumlabel));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkEnum();
