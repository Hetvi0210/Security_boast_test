const mongoose = require('mongoose');

// Define the schema for the product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

// Create a model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
