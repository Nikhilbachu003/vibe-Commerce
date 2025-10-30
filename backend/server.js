const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

// GET /api/cart - Get cart items with total
app.get('/api/cart', (req, res) => {
  const sql = `
    SELECT cart.id, cart.quantity, products.id as product_id, products.name, products.price, products.image 
    FROM cart 
    JOIN products ON cart.product_id = products.id
    ORDER BY cart.added_at DESC
  `;
  
  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Calculate total
    const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      items: rows,
      total: total.toFixed(2)
    });
  });
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  // Check if product exists
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE product_id = ?', [productId], (err, existingItem) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (existingItem) {
        // Update quantity if exists
        db.run('UPDATE cart SET quantity = quantity + ? WHERE product_id = ?', [quantity, productId], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Cart updated successfully' });
        });
      } else {
        // Add new item
        db.run('INSERT INTO cart (product_id, quantity) VALUES (?, ?)', [productId, quantity], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Item added to cart successfully' });
        });
      }
    });
  });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const itemId = req.params.id;
  
  db.run('DELETE FROM cart WHERE id = ?', [itemId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item removed from cart successfully' });
  });
});

// POST /api/checkout - Process checkout and generate receipt
app.post('/api/checkout', (req, res) => {
  const { customerName, customerEmail } = req.body;
  
  if (!customerName || !customerEmail) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }

  // Get current cart items
  const sql = `
    SELECT cart.quantity, products.name, products.price 
    FROM cart 
    JOIN products ON cart.product_id = products.id
  `;
  
  db.all(sql, (err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total and create receipt
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const receipt = {
      receiptId: 'ORD-' + Date.now(),
      customerName: customerName,
      customerEmail: customerEmail,
      items: items,
      total: total.toFixed(2),
      orderDate: new Date().toISOString(),
      timestamp: new Date().toLocaleString()
    };
    
    // Clear cart after successful order
    db.run('DELETE FROM cart', (err) => {
      if (err) {
        console.error('Error clearing cart:', err);
        return res.status(500).json({ error: 'Error processing order' });
      }
      
      res.json({ 
        receipt: receipt, 
        message: 'Order placed successfully' 
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'E-commerce backend is running', 
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(` Backend server running on http://localhost:${PORT}`);
  console.log(` Products API: http://localhost:${PORT}/api/products`);
  console.log(` Cart API: http://localhost:${PORT}/api/cart`);
});