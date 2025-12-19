const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let orders = [];

const PRODUCT_SERVICE_URL = 'http://localhost:3001';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3003';

app.post('/orders', async (req, res) => {
  console.log('🛒 New order request received');
  
  try {
    console.log(`📞 Calling Product Service for product ${req.body.productId}`);
    
    const productResponse = await axios.get(
      `${PRODUCT_SERVICE_URL}/products/${req.body.productId}`
    );
    
    const product = productResponse.data;
    console.log(`✅ Product found: ${product.name}`);
    
    if (product.stock < req.body.quantity) {
      return res.status(400).json({ 
        error: "Not enough stock available" 
      });
    }
    
    const totalPrice = product.price * req.body.quantity;
    
    const order = {
      id: orders.length + 1,
      productId: product.id,
      productName: product.name,
      quantity: req.body.quantity,
      totalPrice: totalPrice,
      customerEmail: req.body.customerEmail,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };
    
    orders.push(order);
    console.log(`✅ Order created: #${order.id}`);
    
    console.log('📧 Sending notification...');
    axios.post(`${NOTIFICATION_SERVICE_URL}/notify`, {
      orderId: order.id,
      customerEmail: order.customerEmail,
      message: `Order confirmed! ${order.quantity}x ${order.productName} - Total: $${order.totalPrice}`
    }).catch(err => {
      console.log('⚠️  Notification failed (but order is still valid):', err.message);
    });
    
    res.status(201).json(order);
    
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ 
        error: "Failed to create order",
        details: error.message 
      });
    }
  }
});

app.get('/orders', (req, res) => {
  console.log('🛒 Request: Get all orders');
  res.json(orders);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ Order Service is running on http://localhost:${PORT}`);
});