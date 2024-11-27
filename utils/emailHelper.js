import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



//Validacion de datos
const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Asegúrate de configurar esto en tu .env
            pass: process.env.EMAIL_PASS, // Configura también esto en tu .env
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,      // Aquí se usa 'to' que viene como argumento
        subject, // Aquí 'subject'
        text,    // Aquí 'text'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente');
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw new Error('Error enviando correo');
    }
};

export default sendEmail;
