const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: "Laptop", price: 999, stock: 10 },
  { id: 2, name: "Mouse", price: 25, stock: 50 },
  { id: 3, name: "Keyboard", price: 75, stock: 30 }
];

// Get all products
app.get('/products', (req, res) => {
  console.log('📦 Request received: Get all products');
  res.json(products);
});

// Get single product
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  console.log(`📦 Request received: Get product with ID ${productId}`);
  
  const product = products.find(p => p.id === productId);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Add new product
app.post('/products', (req, res) => {
  console.log('📦 Request received: Create new product');
  
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Product Service is running on http://localhost:${PORT}`);
  console.log(`📦 Try: http://localhost:${PORT}/products`);
});