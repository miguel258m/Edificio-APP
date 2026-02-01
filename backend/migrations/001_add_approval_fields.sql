-- Migration script to add approval fields to usuarios table

-- Add aprobado column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'aprobado'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN aprobado BOOLEAN DEFAULT true;
        
        -- Set existing users as approved
        UPDATE usuarios SET aprobado = true WHERE aprobado IS NULL;
        
        RAISE NOTICE 'Column aprobado added successfully';
    ELSE
        RAISE NOTICE 'Column aprobado already exists';
    END IF;
END $$;

-- Add foto_perfil column for future profile picture feature
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'foto_perfil'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;
        
        RAISE NOTICE 'Column foto_perfil added successfully';
    ELSE
        RAISE NOTICE 'Column foto_perfil already exists';
    END IF;
END $$;

RAISE NOTICE 'Migration completed successfully';
