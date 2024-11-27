import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/productController.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// Ruta para crear un producto
router.post('/', upload.array('images', 5), createProduct);

// Ruta para obtener todos los productos
router.get('/', getAllProducts);

// Ruta para obtener un producto por ID
router.get('/:id', getProductById);

export default router;