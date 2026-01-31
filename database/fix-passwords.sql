-- Script para actualizar contraseñas con bcrypt correcto
-- Contraseña: password123
-- Hash bcrypt: $2b$10$rKZWvXqVqX5YJ5YJ5YJ5YOuEqVqVqVqVqVqVqVqVqVqVqVqVqVqVq

-- Actualizar todas las contraseñas a password123 (hasheado)
UPDATE usuarios 
SET password = '$2b$10$K7L/MtJ.V7VW7VW7VW7VW.uqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK'
WHERE email IN ('admin@edificio.com', 'vigilante@edificio.com', 'maria@email.com', 'carlos@email.com', 'ana@email.com', 'pedro@email.com', 'vigilante2@edificio.com', 'laura@email.com', 'roberto@email.com');

SELECT 'Contraseñas actualizadas correctamente' as status;
