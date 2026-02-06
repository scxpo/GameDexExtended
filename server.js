const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const dbPath = path.join(__dirname, 'data', 'montagna.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureDatabase() {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      highlight TEXT NOT NULL
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (count === 0) {
    const insert = db.prepare(
      'INSERT INTO products (name, category, price, highlight) VALUES (?, ?, ?, ?)'
    );
    const seed = db.transaction((items) => {
      for (const item of items) {
        insert.run(item.name, item.category, item.price, item.highlight);
      }
    });

    seed([
      {
        name: 'Giacca Termica Summit Pro',
        category: 'Abbigliamento',
        price: 249.9,
        highlight: 'Traspirante, antivento, pronta per le cime invernali.'
      },
      {
        name: 'Zaino Alpine Trek 45L',
        category: 'Zaini',
        price: 159.0,
        highlight: 'Schienale ergonomico e accesso rapido ai comparti.'
      },
      {
        name: 'Scarponi Roccia GTX',
        category: 'Calzature',
        price: 199.5,
        highlight: 'Grip affidabile su terreni misti e impermeabilità totale.'
      },
      {
        name: 'Bastoncini Carbon Trail',
        category: 'Accessori',
        price: 89.9,
        highlight: 'Leggeri e resistenti con impugnatura in sughero.'
      }
    ]);
  }

  return db;
}

const db = ensureDatabase();

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id ASC').all();
  res.json(products);
});

app.get('/api/summary', (req, res) => {
  const categories = db.prepare(
    'SELECT category, COUNT(*) as total FROM products GROUP BY category'
  ).all();
  res.json({
    totalProducts: db.prepare('SELECT COUNT(*) as total FROM products').get().total,
    categories
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
