import pool from './config/database.js';

async function cleanupDuplicates() {
    try {
        console.log('🧹 Iniciando limpieza de edificios duplicados...');

        // 1. Identificar nombres duplicados
        const duplicatesResult = await pool.query(`
            SELECT nombre, COUNT(*) 
            FROM edificios 
            GROUP BY nombre 
            HAVING COUNT(*) > 1
        `);

        if (duplicatesResult.rows.length === 0) {
            console.log('✅ No se encontraron nombres de edificios duplicados.');
        } else {
            for (const row of duplicatesResult.rows) {
                console.log(`Eliminando duplicados para: "${row.nombre}" (${row.count} encontrados)`);

                // Obtener todos los IDs para este nombre
                const idsResult = await pool.query(
                    'SELECT id FROM edificios WHERE nombre = $1 ORDER BY id ASC',
                    [row.nombre]
                );

                const originalId = idsResult.rows[0].id;
                const redundantIds = idsResult.rows.slice(1).map(r => r.id);

                console.log(`Manteniendo ID ${originalId}, reasignando/eliminando IDs: ${redundantIds.join(', ')}`);

                // Reasignar usuarios de los edificios duplicados al original
                for (const oldId of redundantIds) {
                    await pool.query(
                        'UPDATE usuarios SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    await pool.query(
                        'UPDATE solicitudes SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    await pool.query(
                        'UPDATE mensajes SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    await pool.query(
                        'UPDATE pagos SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    await pool.query(
                        'UPDATE emergencias SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    await pool.query(
                        'UPDATE alertas SET edificio_id = $1 WHERE edificio_id = $2',
                        [originalId, oldId]
                    );

                    // Eliminar el duplicado
                    await pool.query('DELETE FROM edificios WHERE id = $1', [oldId]);
                }
            }
            console.log('✅ Limpieza completada.');
        }

        // 2. Asegurar restricción UNIQUE si no existe
        console.log('🔒 Asegurando restricción UNIQUE en nombre del edificio...');
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'edificios_nombre_key'
                ) THEN
                    ALTER TABLE edificios ADD CONSTRAINT edificios_nombre_key UNIQUE (nombre);
                END IF;
            END $$;
        `);
        console.log('✅ Restricción UNIQUE verificada/creada.');

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    } finally {
        process.exit();
    }
}

cleanupDuplicates();
