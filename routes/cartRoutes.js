import express from 'express';
import cartController from '../controllers/cartController.js';
import  protect  from '../middleware/authMiddleware.js'; 
const router = express.Router();
// Ruta para agregar un producto al carrito
router.post('/add', protect, cartController.addToCart);

// Ruta para obtener el carrito del usuario
router.get('/', protect, cartController.getCart);

// Ruta para eliminar un producto del carrito
router.delete('/remove', protect, cartController.removeFromCart);

// Ruta para vaciar completamente el carrito
router.delete('/clear', protect, cartController.clearCart);

export default router;
