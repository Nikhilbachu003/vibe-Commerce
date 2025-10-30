const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category TEXT,
    image TEXT
  )`);

  // Cart table
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert the provided products
  const products = [
    { name: 'Dell G15', price: 63480.00, description: 'High-performance laptop for gaming and content creation', category: 'Laptops', image: 'https://tse3.mm.bing.net/th/id/OIP.fXHHSYkDraEZex2rq6ylKgHaFG?pid=Api&P=0&h=180' },
    { name: 'UltraBook Air', price: 119998.99, description: 'Lightweight ultrabook with long battery life', category: 'Laptops', image: 'https://tse2.mm.bing.net/th/id/OIP.vyNqWWdreTn9uAMwWA_jpwHaEu?pid=Api&P=0&h=180' },
    { name: 'Precision Wireless Mouse', price: 398.99, description: 'High-precision wireless mouse with programmable buttons', category: 'Accessories', image: 'https://i5.walmartimages.com/asr/d43f8db9-ee8f-4652-9968-5279433bb18a_1.6dd574ec8fa52ca720ca52e7babc1d2b.jpeg?odnHeight=117&odnWidth=117&odnBg=FFFFFF' },
    { name: 'Ergonomic Gaming Mouse', price: 590.99, description: 'Comfortable gaming mouse with RGB lighting', category: 'Accessories', image: 'https://tse4.mm.bing.net/th/id/OIP.q1mygfdaAzvqrfd8sDSwGgHaF3?pid=Api&P=0&h=180' },
    { name: 'Usha steam Iron Pro', price: 3290.99, description: 'Powerful steam iron for wrinkle-free clothes', category: 'Home Appliances', image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6355/6355911_rd.jpg' },
    { name: 'Ceramic Iron Lite', price: 1049.00, description: 'Lightweight ceramic soleplate iron for everyday use', category: 'Home Appliances', image: 'https://www.courtsmammouth.mu/105488-product_set/morphy-richards-ec3009-310002-2yw-blue-ceramic-steam-iron.jpg' },
    { name: 'Samsung S24', price: 99900.00, description: 'Latest Samsung flagship with high refresh rate display', category: 'Mobiles', image: 'https://m.media-amazon.com/images/I/81vxWpPpgNL.jpg' },
    { name: 'iPhone 16 Pro Max', price: 94900.00, description: 'Apple flagship with advanced camera system', category: 'Mobiles', image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9471f613-7d82-400e-97ed-7dca6c0101af.jpg' },
    { name: 'MacBook Air 5', price: 84900.00, description: 'Ultra-thin Apple laptop with M-series chip', category: 'Laptops', image: 'https://a.allegroimg.com/original/11c360/72b417574dc394d4392f6834e850/APPLE-MACBOOK-AIR-5-2-A1466-i5-13-3-LED-2012r' },
    { name: 'Stainless Water Bottle', price: 249.00, description: 'Insulated stainless steel water bottle 750ml', category: 'Accessories', image: 'https://m.media-amazon.com/images/I/61X1b09mK0L._SL1500_.jpg' }
  ];

  // Clear existing products and insert new ones
  db.run('DELETE FROM products', (err) => {
    if (err) {
      console.error('Error clearing products:', err);
    } else {
      const stmt = db.prepare('INSERT INTO products (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)');
      products.forEach(product => {
        stmt.run(product.name, product.price, product.description, product.category, product.image);
      });
      stmt.finalize();
      console.log('Products inserted successfully');
    }
  });
});

module.exports = db;