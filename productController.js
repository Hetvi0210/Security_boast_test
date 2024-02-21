const express = require('express');
const router = express.Router();
const Product = require('./productModel');
const { verifyToken, checkRole } = require('./authMiddleware');

// Add a new product (Owner only)
router.post('/add', [verifyToken, checkRole(['owner'])], async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    });
    await newProduct.save();
    res.status(201).send({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get list of products by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: categoryName });
    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found in this category' });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get specific product details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Update product stock (Owner only)
router.patch('/updateStock/:id', [verifyToken, checkRole(['owner'])], async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
