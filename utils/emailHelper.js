import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



//Validacion de datos
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Cambia según el proveedor de correo
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: `"Equipo VortexVanguard" <${process.env.EMAIL_USER}>`,
            subject, // Asunto
            text // Cuerpo del mensaje
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw new Error('Error enviando correo');
    }
};

export default sendEmail;
