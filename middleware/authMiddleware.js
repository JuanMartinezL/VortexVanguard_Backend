import jwt from'jsonwebtoken';
import User from'../models/userModel.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adjuntar usuario al request
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no se encontró un token.' });
    }
};


export default protect;
