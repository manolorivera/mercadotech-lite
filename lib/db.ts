import Database from "better-sqlite3";

const db = new Database("mercadotech.db");
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, price REAL NOT NULL, stock INTEGER NOT NULL, category TEXT, image_url TEXT);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS cart_items (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, total REAL NOT NULL, items TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`);

const seed: [string, string, number, number, string][] = [
  ["Laptop Zenbook 14", "Ultrabook de 14 pulgadas, 16 GB RAM, 512 GB SSD.", 3499, 8, "Laptops"],
  ["Laptop Gamer Nitro 5", "Ryzen 7, RTX 4050, pantalla de 144 Hz.", 4599, 5, "Laptops"],
  ["Smartphone Galaxy A55", "Pantalla AMOLED de 6.6 pulgadas, 256 GB.", 1599, 20, "Celulares"],
  ["Smartphone Redmi Note 13", "Cámara de 108 MP, 128 GB.", 899, 30, "Celulares"],
  ["Audífonos Bluetooth Pro", "Cancelación de ruido, 30 h de batería.", 349, 40, "Audio"],
  ["Parlante Portátil Boom", "Resistente al agua, 12 h de batería.", 199, 25, "Audio"],
  ["Smartwatch Fit 3", "Monitor cardíaco, GPS y 7 días de batería.", 449, 15, "Wearables"],
  ["Tablet Pad 11", "11 pulgadas, 128 GB, incluye lápiz.", 1199, 12, "Tablets"],
  ["Teclado Mecánico RGB", "Switches rojos, formato 75%.", 279, 35, "Accesorios"],
  ["Mouse Inalámbrico Ergo", "Ergonómico, 4000 DPI.", 119, 50, "Accesorios"],
  ["Monitor 27 pulgadas 4K", "Panel IPS, 60 Hz, HDMI y USB-C.", 1399, 7, "Monitores"],
  ["Cargador Rápido 65W", "GaN, dos puertos USB-C.", 129, 60, "Accesorios"],
];

if ((db.prepare("SELECT COUNT(*) c FROM products").get() as { c: number }).c === 0) {
  const ins = db.prepare("INSERT INTO products (title, description, price, stock, category, image_url) VALUES (?,?,?,?,?,?)");
  seed.forEach(([t, d, p, s, c], i) => ins.run(t, d, p, s, c, `https://picsum.photos/seed/mt${i + 1}/600/400`));
}

export default db;
