const express = require('express');
const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Function to get cart for a user or guest
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart
// @desc Add item to cart for a guest or logged-in user
// @access Public
router.post('/', protect, async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Determine if the user is logged in or a guest
        let cart = await getCart(userId, guestId);
        if (cart) {
            // Update the cart item if it already exists
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product to the cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // Calculate total price
            cart.totalPrice = cart.products.reduce((acc, item) => {
                return acc + item.price * item.quantity;
            }, 0);

            await cart.save();

            // Populate the products field before sending the response
            cart = await cart.populate('products.productId');
            return res.status(200).json(cart);
        } else {
            // Create a new cart for the user or guest
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity,
            });

            // Populate the products field before sending the response
            const populatedCart = await newCart.populate('products.productId');
            return res.status(201).json(populatedCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET /api/products
// @desc Get all products
// @access Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/products/new-arrivals
// @desc Get 10 newest products
// @access Public
router.get('/new-arrivals', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/products/best-sellers
// @desc Get top 10 best seller products
// @access Public
router.get('/best-sellers', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ sold: -1 }).limit(2);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching best seller products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/products/top-wear-for-women
// @desc Get top wear products for women (limit 10)
// @access Public
router.get('/top-wear-for-women', async (req, res) => {
    try {
        const products = await Product.find({
            category: 'Top Wear',
            gender: 'Women'
        }).limit(8);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching top wear for women:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/products/:id
// @desc Get single product by ID
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;