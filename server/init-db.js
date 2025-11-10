const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

function run() {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Ensure folder exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    console.log('Initializing database at', dbPath);
    db.exec('PRAGMA foreign_keys = ON;');

    // Execute the schema SQL (which is sqlite-compatible in db/schema.sql)
    db.exec(schemaSql, (err) => {
      if (err) {
        console.error('Error applying schema:', err.message);
      } else {
        console.log('Schema applied.');
        seed(db);
      }
    });
  });

  function seed(db) {
    // Insert sample products with specific IDs to match the static HTML product cards
    const products = [
      { id: 101, name: 'Rose Stacking Ring', description: 'Slim rose-gold band for everyday wear.', price: 45, image_url: 'assets/images/product4.jpg' },
      { id: 102, name: 'Minimal Pendant', description: '14k gold pendant on adjustable chain.', price: 95, image_url: 'assets/images/product5.jpg' },
      { id: 103, name: 'Pearl Drop Earrings', description: 'Classic pearls with modern setting.', price: 110, image_url: 'assets/resized-shop-with-us.jpg' },
      { id: 104, name: 'Emerald Cocktail Ring', description: 'Bold centerpiece for evening wear.', price: 320, image_url: 'assets/MIK-Tile-Beads&Jewellery-3Charms&Pendants.jpg' },
      { id: 105, name: 'Layered Chain Set', description: 'Three-piece chain set to mix & match.', price: 150, image_url: 'assets/nn-strip_20230302-new-vacation-destination-tins__47190_product.original.jpg' },
      { id: 106, name: 'Rose Stacking Ring (Alt)', description: 'Slim rose-gold band for everyday wear.', price: 45, image_url: 'assets/images/product4.jpg' },
      { id: 107, name: 'Minimal Pendant (Alt)', description: '14k gold pendant on adjustable chain.', price: 95, image_url: 'assets/images/product5.jpg' },
      { id: 108, name: 'Pearl Drop Earrings (Alt)', description: 'Classic pearls with modern setting.', price: 110, image_url: 'assets/MIK-Tile-Beads&Jewellery-3Charms&Pendants.jpg' }
    ];

    const insert = db.prepare('INSERT OR IGNORE INTO products (id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)');
    products.forEach(p => {
      insert.run(p.id, p.name, p.description, p.price, p.image_url);
    });
    insert.finalize(() => {
      console.log('Seed data inserted (or already present).');
      db.close();
    });
  }
}

run();
