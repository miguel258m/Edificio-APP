import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = user; // { id, email, rol, edificio_id }
        next();
    });
}

// Middleware para verificar roles específicos
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
}

// Middleware para verificar que el usuario pertenece al edificio
export function requireSameBuilding(req, res, next) {
    const edificioId = req.params.edificioId || req.body.edificio_id;

    if (req.user.rol === 'admin') {
        // Los admins pueden acceder a cualquier edificio
        return next();
    }

    if (req.user.edificio_id !== parseInt(edificioId)) {
        return res.status(403).json({
            error: 'No puedes acceder a datos de otro edificio'
        });
    }

    next();
}
