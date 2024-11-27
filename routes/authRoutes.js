import express from 'express';
import authController from '../controllers/authController.js'; // Revisa la ruta
import User from'../models/userModel.js'; // Necesario para validaciones en la ruta GET
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El correo no es válido.' });
    }

    next();
}, authController.register);

router.post('/login', authController.login);//ok
router.get('/profile', protect, (req, res) =>{
    res.status(200).json({message: 'Acceso permitido', user: req.user});
});

//Solicitar Restablecimiento
router.post('/forgot-password', authController.forgotPassword);

//Restablecer la contraseña
router.post('/reset-password/:token', authController.resetPassword);

/*router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('<h1>El token es inválido o ha expirado.</h1>');
        }

        res.send(`<html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="container mt-5">
                <h1 class="text-center">Restablecer Contraseña</h1>
                <form action="/reset-password/${token}" method="POST" class="mt-4">
                    <div class="mb-3">
                        <label for="password" class="form-label">Nueva Contraseña:</label>
                        <input type="password" id="password" name="password" class="form-control" required />
                    </div>
                    <button type="submit" class="btn btn-primary">Restablecer</button>
                </form>
            </body>
        </html>`);
    } catch (error) {
        res.status(500).send('<h1>Error en el servidor</h1>');
    }
});

*/

export default router;

