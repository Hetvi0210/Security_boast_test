const Order = require('./orderModel');
const Product = require('./productModel');
const { verifyToken, checkRole } = require('./authMiddleware');

// Function to create a new order
exports.createOrder = [verifyToken, async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).send({ message: 'No products specified.' });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).send({ message: 'Product not found.' });
      }
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      customer: req.userId,
      products: products,
      totalPrice: totalPrice,
    });

    await order.save();
    res.status(201).send({ message: 'Order created successfully.', order });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}];

// Function to update order status
exports.updateOrderStatus = [verifyToken, checkRole(['owner']), async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: 'Order not found.' });
    }

    order.status = status;
    await order.save();
    res.status(200).send({ message: 'Order status updated successfully.', order });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}];

// Function to get order by ID
exports.getOrderById = [verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');

    if (!order) {
      return res.status(404).send({ message: 'Order not found.' });
    }

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}];

// Function to list all orders for a customer
exports.listCustomerOrders = [verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId }).populate('products.product');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}];

module.exports = {
  createOrder,
  updateOrderStatus,
  getOrderById,
  listCustomerOrders,
};
