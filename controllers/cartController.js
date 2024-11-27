import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Agregar un producto al carrito
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Crear un nuevo carrito si no existe
            cart = new Cart({
                user: req.user.id,
                products: [{ product: productId, quantity }]
            });
        } else {
            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(
                (item) => item.product.toString() === productId
            );

            if (existingProductIndex > -1) {
                // Actualizar la cantidad del producto
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Agregar un nuevo producto al carrito
                cart.products.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar al carrito', error });
    }
};

// Obtener el carrito del usuario
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('products.product', 'name price');
        if (!cart) {
            return res.status(404).json({ message: 'El carrito está vacío' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Eliminar un producto del carrito
const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'El carrito está vacío' });
        }

        // Filtrar los productos para eliminar el solicitado
        cart.products = cart.products.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

// Limpiar el carrito
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'El carrito ya está vacío' });
        }

        cart.products = []; // Eliminar todos los productos
        await cart.save();

        res.status(200).json({ message: 'Carrito vacío con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};

export default {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};
