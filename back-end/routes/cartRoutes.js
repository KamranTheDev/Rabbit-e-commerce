const express = require("express");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const { protect } = require("../middleware/authMiddleware.js");

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
router.post("/", protect, async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
      return res.status(200).json(cart);
    } else {
      // Create a new cart for the user or guest
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
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

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route PUT /api/cart
// @desc Update item in cart for a logged-in user or guest
// @access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      if (quantity > 0) {
        // Update product quantity
        cart.products[productIndex].quantity = quantity;
      } else {
        // Remove product from cart
        cart.products.splice(productIndex, 1);
      }
      // Calculate total price
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route DELETE /api/cart
// @desc Remove item from cart for a logged-in user or guest
// @access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      // Remove product from cart
      cart.products.splice(productIndex, 1);
      // Calculate total price
      cart.totalPrice = cart.products.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route GET /api/cart
// @desc Get cart for a logged-in user or guest user cart
// @access Public
router.get("/", async (req, res) => {
  const { guestId, userId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart with user cart
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    // Find the user's cart
    const userCart = await Cart.findOne({ user: req.user._id });
    // Find the guest's cart
    const guestCart = await Cart.findOne({ guestId });
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        // Merge guest cart into user's cart
        guestCart.products.forEach((product) => {
          const productIndex = userCart.products.findIndex(
            (p) =>
              p.productId.toString() === product.productId.toString() &&
              p.size === product.size &&
              p.color === product.color
          );
          if (productIndex > -1) {
            userCart.products[productIndex].quantity += product.quantity;
          } else {
            userCart.products.push(product);
          }
        });
        // Calculate total price
        userCart.totalPrice = userCart.products.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        await userCart.save();
        //remove guest cart
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }
        res.status(200).json(userCart);
      } else {
        // if the user has no existing cart, just assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined; // Remove guestId
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        //guest has been merged into user cart, return user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: " Guest No cart found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
