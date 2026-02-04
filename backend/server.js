// server.js - Pastane Yönetim Sistemi Backend API
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'pastane-secret-key-2026'; // Gerçek uygulamada .env dosyasından alın

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Veritabanı Bağlantısı
const db = new sqlite3.Database('./pastane.db', (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
  } else {
    console.log('✅ SQLite veritabanına bağlanıldı');
    initDatabase();
  }
});

// Veritabanı Tablolarını Oluştur
function initDatabase() {
  // Şubeler
  db.run(`CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Kullanıcılar (Admin/Personel)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    branch_id TEXT,
    phone TEXT,
    email TEXT,
    salary REAL,
    shift TEXT,
    performance INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
  )`);

  // Müşteriler
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    birthday DATE,
    total_orders INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    points INTEGER DEFAULT 0,
    vip BOOLEAN DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Kategoriler
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT
  )`);

  // Ürünler
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    price REAL NOT NULL,
    cost REAL NOT NULL,
    description TEXT,
    image_emoji TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Stok
  db.run(`CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT NOT NULL,
    price REAL NOT NULL,
    min_level INTEGER NOT NULL,
    merkez_qty INTEGER DEFAULT 0,
    kadikoy_qty INTEGER DEFAULT 0,
    besiktas_qty INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Siparişler
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    branch_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATETIME,
    notes TEXT,
    created_by INTEGER,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Sipariş Ürünleri
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Gelir-Gider
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'income' veya 'expense'
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Stok Hareketleri
  db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_id INTEGER NOT NULL,
    branch_id TEXT NOT NULL,
    movement_type TEXT NOT NULL, -- 'in' veya 'out'
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stock(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  console.log('✅ Veritabanı tabloları oluşturuldu');
  seedDatabase();
}

// Örnek Verileri Ekle
function seedDatabase() {
  // Şubeleri kontrol et
  db.get("SELECT COUNT(*) as count FROM branches", (err, row) => {
    if (row.count === 0) {
      const branches = [
        { id: 'merkez', name: 'Merkez Şube', address: 'İstiklal Cad. No:123 Beyoğlu/İstanbul', phone: '0212 123 45 67', color: '#f59e0b' },
        { id: 'kadikoy', name: 'Kadıköy Şubesi', address: 'Bahariye Cad. No:45 Kadıköy/İstanbul', phone: '0216 234 56 78', color: '#8b5cf6' },
        { id: 'besiktas', name: 'Beşiktaş Şubesi', address: 'Çarşı İçi No:12 Beşiktaş/İstanbul', phone: '0212 345 67 89', color: '#3b82f6' }
      ];

      const stmt = db.prepare("INSERT INTO branches (id, name, address, phone, color) VALUES (?, ?, ?, ?, ?)");
      branches.forEach(b => stmt.run(b.id, b.name, b.address, b.phone, b.color));
      stmt.finalize();
      console.log('✅ Şubeler eklendi');
    }
  });

  // Admin kullanıcısını kontrol et
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row.count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      db.run(`INSERT INTO users (username, password, name, role, branch_id) VALUES (?, ?, ?, ?, ?)`,
        ['admin', hashedPassword, 'Yönetici', 'admin', 'merkez'],
        () => console.log('✅ Admin kullanıcısı oluşturuldu (username: admin, password: admin123)')
      );
    }
  });

  // Kategorileri kontrol et
  db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
    if (row.count === 0) {
      const categories = [
        { name: 'Pastalar', description: 'Özel günler için pastalar', color: '#f59e0b' },
        { name: 'Kurabiyeler', description: 'Çeşitli kurabiye çeşitleri', color: '#ec4899' },
        { name: 'Ekler & Profiterol', description: 'Ekler ve profiteroller', color: '#8b5cf6' },
        { name: 'Tatlılar', description: 'Sütlü tatlılar ve cheesecake', color: '#3b82f6' },
        { name: 'Diğer', description: 'Brownie, muffin vb.', color: '#10b981' }
      ];

      const stmt = db.prepare("INSERT INTO categories (name, description, color) VALUES (?, ?, ?)");
      categories.forEach(c => stmt.run(c.name, c.description, c.color));
      stmt.finalize();
      console.log('✅ Kategoriler eklendi');
    }
  });

  // Ürünleri kontrol et
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const products = [
        { name: 'Çikolatalı Pasta', category_id: 1, price: 450, cost: 180, image_emoji: '🍰', description: 'Yoğun çikolatalı pasta' },
        { name: 'Frambuazlı Cheesecake', category_id: 1, price: 380, cost: 150, image_emoji: '🍰', description: 'Kremalı frambuazlı cheesecake' },
        { name: 'Profiterol (1kg)', category_id: 3, price: 320, cost: 120, image_emoji: '🧁', description: 'Çikolata soslu profiterol' },
        { name: 'Kurabiye Çeşitleri (500gr)', category_id: 2, price: 180, cost: 70, image_emoji: '🍪', description: 'Karışık kurabiye paketi' },
        { name: 'Tiramisu', category_id: 4, price: 220, cost: 85, image_emoji: '🍮', description: 'İtalyan tiramisu' },
        { name: 'San Sebastian Cheesecake', category_id: 1, price: 380, cost: 145, image_emoji: '🍰', description: 'Yanık cheesecake' },
        { name: 'Ekler (6 adet)', category_id: 3, price: 150, cost: 60, image_emoji: '🧁', description: 'Kremalı ekler' },
        { name: 'Brownie', category_id: 5, price: 95, cost: 35, image_emoji: '🍫', description: 'Çikolatalı brownie' }
      ];

      const stmt = db.prepare("INSERT INTO products (name, category_id, price, cost, image_emoji, description) VALUES (?, ?, ?, ?, ?, ?)");
      products.forEach(p => stmt.run(p.name, p.category_id, p.price, p.cost, p.image_emoji, p.description));
      stmt.finalize();
      console.log('✅ Ürünler eklendi');
    }
  });

  // Stok malzemelerini kontrol et
  db.get("SELECT COUNT(*) as count FROM stock", (err, row) => {
    if (row.count === 0) {
      const stockItems = [
        { name: 'Un', category: 'Hammadde', unit: 'kg', price: 8.5, min_level: 50, merkez: 45, kadikoy: 38, besiktas: 42 },
        { name: 'Şeker', category: 'Hammadde', unit: 'kg', price: 12.0, min_level: 60, merkez: 62, kadikoy: 55, besiktas: 58 },
        { name: 'Yumurta', category: 'Hammadde', unit: 'adet', price: 4.5, min_level: 200, merkez: 180, kadikoy: 220, besiktas: 190 },
        { name: 'Çikolata', category: 'Hammadde', unit: 'kg', price: 85.0, min_level: 30, merkez: 22, kadikoy: 18, besiktas: 25 },
        { name: 'Tereyağı', category: 'Hammadde', unit: 'kg', price: 95.0, min_level: 40, merkez: 35, kadikoy: 28, besiktas: 32 },
        { name: 'Pasta Kutusu (Büyük)', category: 'Ambalaj', unit: 'adet', price: 3.5, min_level: 100, merkez: 85, kadikoy: 92, besiktas: 78 },
        { name: 'Pasta Kutusu (Küçük)', category: 'Ambalaj', unit: 'adet', price: 2.0, min_level: 150, merkez: 120, kadikoy: 135, besiktas: 115 },
        { name: 'Krema', category: 'Hammadde', unit: 'lt', price: 45.0, min_level: 25, merkez: 18, kadikoy: 22, besiktas: 20 }
      ];

      const stmt = db.prepare("INSERT INTO stock (name, category, unit, price, min_level, merkez_qty, kadikoy_qty, besiktas_qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      stockItems.forEach(s => stmt.run(s.name, s.category, s.unit, s.price, s.min_level, s.merkez, s.kadikoy, s.besiktas));
      stmt.finalize();
      console.log('✅ Stok malzemeleri eklendi');
    }
  });

  // Örnek müşterileri kontrol et
  db.get("SELECT COUNT(*) as count FROM customers", (err, row) => {
    if (row.count === 0) {
      const customers = [
        { name: 'Ayşe Yılmaz', phone: '05321234523', email: 'ayse@email.com', birthday: '1990-03-15', total_orders: 23, total_spent: 8450, points: 845, vip: 1 },
        { name: 'Mehmet Kaya', phone: '05452345667', email: 'mehmet@email.com', birthday: '1985-06-08', total_orders: 15, total_spent: 5280, points: 528, vip: 0 },
        { name: 'Zeynep Demir', phone: '05053456789', email: 'zeynep@email.com', birthday: '1992-09-22', total_orders: 31, total_spent: 12450, points: 1245, vip: 1 },
        { name: 'Ali Öztürk', phone: '05334567845', email: 'ali@email.com', birthday: '1988-11-10', total_orders: 8, total_spent: 2890, points: 289, vip: 0 }
      ];

      const stmt = db.prepare("INSERT INTO customers (name, phone, email, birthday, total_orders, total_spent, points, vip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      customers.forEach(c => stmt.run(c.name, c.phone, c.email, c.birthday, c.total_orders, c.total_spent, c.points, c.vip));
      stmt.finalize();
      console.log('✅ Örnek müşteriler eklendi');
    }
  });
}

// ============== AUTH ENDPOINTS ==============

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Hatalı şifre' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        branch_id: user.branch_id
      }
    });
  });
});

// Middleware - Token Doğrulama
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
}

// ============== BRANCH ENDPOINTS ==============

// Tüm şubeleri getir
app.get('/api/branches', authenticateToken, (req, res) => {
  db.all("SELECT * FROM branches ORDER BY name", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============== PRODUCT ENDPOINTS ==============

// Tüm ürünleri getir
app.get('/api/products', authenticateToken, (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name, c.color as category_color
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
    ORDER BY p.name
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Yeni ürün ekle
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, category_id, price, cost, description, image_emoji } = req.body;

  db.run(
    "INSERT INTO products (name, category_id, price, cost, description, image_emoji) VALUES (?, ?, ?, ?, ?, ?)",
    [name, category_id, price, cost, description, image_emoji],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Ürün eklendi' });
    }
  );
});

// Ürün güncelle
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { name, category_id, price, cost, description, image_emoji } = req.body;

  db.run(
    "UPDATE products SET name = ?, category_id = ?, price = ?, cost = ?, description = ?, image_emoji = ? WHERE id = ?",
    [name, category_id, price, cost, description, image_emoji, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Ürün güncellendi' });
    }
  );
});

// Ürün sil (soft delete)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.run("UPDATE products SET is_active = 0 WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Ürün silindi' });
  });
});

// ============== STOCK ENDPOINTS ==============

// Tüm stokları getir
app.get('/api/stock', authenticateToken, (req, res) => {
  db.all("SELECT * FROM stock ORDER BY name", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Düşük stok uyarıları
app.get('/api/stock/low', authenticateToken, (req, res) => {
  db.all(`
    SELECT * FROM stock 
    WHERE merkez_qty < min_level 
       OR kadikoy_qty < min_level 
       OR besiktas_qty < min_level
    ORDER BY name
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Stok güncelle
app.put('/api/stock/:id', authenticateToken, (req, res) => {
  const { merkez_qty, kadikoy_qty, besiktas_qty } = req.body;

  db.run(
    "UPDATE stock SET merkez_qty = ?, kadikoy_qty = ?, besiktas_qty = ? WHERE id = ?",
    [merkez_qty, kadikoy_qty, besiktas_qty, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Stok güncellendi' });
    }
  );
});

// ============== ORDER ENDPOINTS ==============

// Tüm siparişleri getir
app.get('/api/orders', authenticateToken, (req, res) => {
  const { branch_id, status, start_date, end_date } = req.query;
  let query = `
    SELECT o.*, c.name as customer_name, c.phone as customer_phone, 
           b.name as branch_name, u.name as created_by_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN branches b ON o.branch_id = b.id
    LEFT JOIN users u ON o.created_by = u.id
    WHERE 1=1
  `;
  const params = [];

  if (branch_id && branch_id !== 'all') {
    query += " AND o.branch_id = ?";
    params.push(branch_id);
  }

  if (status) {
    query += " AND o.status = ?";
    params.push(status);
  }

  if (start_date) {
    query += " AND DATE(o.order_date) >= ?";
    params.push(start_date);
  }

  if (end_date) {
    query += " AND DATE(o.order_date) <= ?";
    params.push(end_date);
  }

  query += " ORDER BY o.order_date DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Yeni sipariş oluştur
app.post('/api/orders', authenticateToken, (req, res) => {
  const { customer_id, branch_id, product_name, amount, delivery_date, notes } = req.body;
  
  // Sipariş numarası oluştur
  const orderId = `SIP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  db.run(
    `INSERT INTO orders (id, customer_id, branch_id, product_name, amount, delivery_date, notes, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, customer_id, branch_id, product_name, amount, delivery_date, notes, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Müşteri istatistiklerini güncelle
      db.run(
        "UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ?, points = points + ? WHERE id = ?",
        [amount, Math.floor(amount / 10), customer_id]
      );

      res.json({ id: orderId, message: 'Sipariş oluşturuldu' });
    }
  );
});

// Sipariş durumu güncelle
app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Sipariş durumu güncellendi' });
  });
});

// ============== CUSTOMER ENDPOINTS ==============

// Tüm müşterileri getir
app.get('/api/customers', authenticateToken, (req, res) => {
  db.all("SELECT * FROM customers ORDER BY total_spent DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Yeni müşteri ekle
app.post('/api/customers', authenticateToken, (req, res) => {
  const { name, phone, email, address, birthday, notes } = req.body;

  db.run(
    "INSERT INTO customers (name, phone, email, address, birthday, notes) VALUES (?, ?, ?, ?, ?, ?)",
    [name, phone, email, address, birthday, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Müşteri eklendi' });
    }
  );
});

// Müşteri güncelle
app.put('/api/customers/:id', authenticateToken, (req, res) => {
  const { name, phone, email, address, birthday, vip, notes } = req.body;

  db.run(
    "UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, birthday = ?, vip = ?, notes = ? WHERE id = ?",
    [name, phone, email, address, birthday, vip, notes, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Müşteri güncellendi' });
    }
  );
});

// ============== STAFF ENDPOINTS ==============

// Tüm personeli getir
app.get('/api/staff', authenticateToken, (req, res) => {
  db.all(`
    SELECT u.*, b.name as branch_name 
    FROM users u
    LEFT JOIN branches b ON u.branch_id = b.id
    WHERE u.role != 'admin'
    ORDER BY u.name
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Şifreleri gizle
    const staff = rows.map(({ password, ...rest }) => rest);
    res.json(staff);
  });
});

// ============== DASHBOARD STATS ==============

app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const { branch_id, date } = req.query;
  const today = date || new Date().toISOString().split('T')[0];

  let branchFilter = '';
  const params = [today];

  if (branch_id && branch_id !== 'all') {
    branchFilter = 'AND branch_id = ?';
    params.push(branch_id);
  }

  // Bugünkü satış ve sipariş sayısı
  db.get(`
    SELECT 
      COUNT(*) as today_orders,
      COALESCE(SUM(amount), 0) as today_sales,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders
    FROM orders
    WHERE DATE(order_date) = ? ${branchFilter}
  `, params, (err, orderStats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Düşük stok sayısı
    db.get(`
      SELECT COUNT(*) as low_stock
      FROM stock
      WHERE merkez_qty < min_level 
         OR kadikoy_qty < min_level 
         OR besiktas_qty < min_level
    `, (err, stockStats) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Aktif personel ve müşteri sayısı
      db.get("SELECT COUNT(*) as active_staff FROM users WHERE role != 'admin'", (err, staffStats) => {
        db.get("SELECT COUNT(*) as total_customers FROM customers", (err, customerStats) => {
          res.json({
            todaySales: orderStats.today_sales,
            todayOrders: orderStats.today_orders,
            pendingOrders: orderStats.pending_orders,
            lowStock: stockStats.low_stock,
            activeStaff: staffStats.active_staff,
            totalCustomers: customerStats.total_customers
          });
        });
      });
    });
  });
});

// Haftalık satış verileri
app.get('/api/dashboard/weekly-sales', authenticateToken, (req, res) => {
  const { branch_id } = req.query;
  
  let branchFilter = '';
  const params = [];

  if (branch_id && branch_id !== 'all') {
    branchFilter = 'AND branch_id = ?';
    params.push(branch_id);
  }

  db.all(`
    SELECT 
      DATE(order_date) as date,
      COUNT(*) as order_count,
      SUM(amount) as total_sales
    FROM orders
    WHERE DATE(order_date) >= DATE('now', '-7 days')
      ${branchFilter}
    GROUP BY DATE(order_date)
    ORDER BY date
  `, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============== CATEGORIES ==============

app.get('/api/categories', authenticateToken, (req, res) => {
  db.all("SELECT * FROM categories ORDER BY name", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============== SERVER START ==============

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   🎂 PASTANE YÖNETİM SİSTEMİ API                 ║
║   ✅ Sunucu çalışıyor: http://localhost:${PORT}    ║
║   📊 Veritabanı: SQLite (pastane.db)             ║
║   🔐 Admin: username: admin, password: admin123  ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('✅ Veritabanı bağlantısı kapatıldı');
    process.exit(0);
  });
});