import Product from '../models/productModel.js';

// Crear un producto
export const createProduct = async (req, res) => {
    const { name, price, description, category, } = req.body;

    try {
        const images = req.files.map(file => file.path);

        const product = new Product({ name, price, description, images, category, });
        await product.save();
        res.status(201).json({ message: 'Producto creado exitosamente', product });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el producto', error: error.message });
    }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener el producto', error: error.message });
    }
};
