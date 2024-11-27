import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from'crypto';
import sendEmail from '../utils/emailHelper.js';
import nodemailer from 'nodemailer';

//Registro de usuarios
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        //Verificar si el usuario ya existe
        if ( await User.findOne({ email })) {
            return res.status(400).json({ message: 'El usuario ya existe ' });
        }

        //Crear y guardar un nuevo usuario
        const user = new User({ name, email, password, role: role || 'user'});
        await user.save();

        res.status(201).json({
            message: "Usuario registrado exitosamente", //Agrego mensaje de exito
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }); 
    } catch (error) {
        res.status(500).json({ error: "Error al registrar Usuario", details: error.message });
    }
};


//Inicio de sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        //Verificar la contraseña
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid){
            return res.status(401).json({message: 'Credenciales incorrectas'});
        }
        //Generar Token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '6h'});
        res.status(200).json({message: `Inicio de sesión exitoso 🥳🥳. || Bienvenid@ ${user.name}!`, 
            token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al iniciar sesión', details: error.message });
    }
};

//restablecimiento de contraseña
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Generar el token de restablecimiento y establecer su expiración
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutos
        await user.save();

        // Llamar a sendEmail con las propiedades necesarias
        await sendEmail({
            to: user.email,
            subject: 'Restablecimiento de contraseña',
            text: `Hola ${user.name}, utiliza este enlace para restablecer tu contraseña: http://example.com/reset/${user.resetPasswordToken}`,
        });

        res.status(200).send('Correo de restablecimiento enviado');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error enviando correo');
    }
};


// Verificar el token y permitir al usuario actualizar su contraseña.
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        //Hash del token que se recibe
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        //Buscar al usuario con el token valido
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            console.log('Ocurrio un problema en la solicitud');
            return res.status(400).json({ message: 'Token inválido o ha expirado' });
        }

        //Actualiza la contraseña y limpia los campos relacionados con el token
        user.password = await bcrypt.hash(password, 10) ;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al restablecer contraseña.' });
    }
};

export default {register, login, forgotPassword, resetPassword};