import pool from './config/database.js';

async function fixData() {
    try {
        console.log('--- Corrigiendo datos de prueba ---');

        // Mover a gere1 al edificio 2 (donde está dp3)
        await pool.query("UPDATE usuarios SET edificio_id = 2 WHERE email = 'gene1@gmail.com'");
        console.log('✅ Gerente gene1 movido al edificio 2');

        // Actualizar el aviso 'corte de luz' al edificio 2
        await pool.query("UPDATE alertas SET edificio_id = 2 WHERE titulo = 'corte de luz'");
        console.log('✅ Aviso "corte de luz" actualizado al edificio 2');

        // Verificar el cambio
        const result = await pool.query(`
            SELECT u.nombre, u.email, u.rol, u.edificio_id 
            FROM usuarios u 
            WHERE email IN ('gene1@gmail.com', 'dp3@gmail.com')
        `);
        console.table(result.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

fixData();
