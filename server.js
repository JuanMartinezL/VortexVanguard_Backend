import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connection from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

//Conexion a la base de datos 
connection();


const app = express();

// Configuración de CORS
const corsOptions = {
    origin: ['https://vortexvanguard.onrender.com', 'http://127.0.0.1:5501'],
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type,Authorization', // Asegúrate de incluir Authorization
    credentials: true // Esto permite el envío de cookies si es necesario 
};

app.use(cors());
app.use(express.json());


//Rutas de autenticacion
app.use('/api/auth', authRoutes);

//Rutas de los productos
app.use('/api/products', productRoutes);

//Rutas del carrito
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
console.log('Bienvenido a el servidor de Vortex Vanguard 👨🏻‍🚒')
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;