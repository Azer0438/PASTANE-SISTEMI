import axios from './axios';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Package, Users, TrendingUp, DollarSign, Cake, AlertTriangle, Clock, MapPin, Calendar, Search, Filter, Plus, Download, Settings, Moon, Sun, LogOut, ChevronDown, Eye, Edit, Trash2, CheckCircle, XCircle, Phone, Mail, Star } from 'lucide-react';


const PastaneDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [showNotifications, setShowNotifications] = useState(false); // Bu satırı tamamladık

  // === BarbarosSoft Veri Ekleme Fonksiyonu ===
  const handleVeriEkle = async (endpoint, veri) => {
    try {
      // Backend'e POST isteği gönderiyoruz
      const response = await axios.post(`http://localhost:5000/api/${endpoint}`, veri);
      if(response.status === 201 || response.status === 200) {
         alert("İşlem Başarılı: Veri sisteme kaydedildi!");
         // Burada verileri tekrar çekmek için fetch fonksiyonunu çağırabilirsin
      }
    } catch (error) {
      console.error("Veri eklenirken hata oluştu:", error);
      alert("Hata: Veri gönderilemedi. Backend'in çalıştığından emin ol dostum.");
    }
  };

  
  // Şube verileri
  const branches = [
    { id: 'all', name: 'Tüm Şubeler', color: '#ec4899' },
    { id: 'merkez', name: 'Merkez Şube', color: '#f59e0b' },
    { id: 'kadikoy', name: 'Kadıköy Şubesi', color: '#8b5cf6' },
    { id: 'besiktas', name: 'Beşiktaş Şubesi', color: '#3b82f6' }
  ];

  // Dashboard özet verileri
  const [dashboardData, setDashboardData] = useState({
    todaySales: 45280,
    todayOrders: 127,
    pendingOrders: 23,
    lowStock: 8,
    activeStaff: 18,
    totalCustomers: 1847,
    monthlyGrowth: 12.5,
    customerSatisfaction: 4.7
  });

  // Satış verileri
  const salesData = [
    { day: 'Pzt', satis: 4200, siparis: 45, merkez: 1500, kadikoy: 1400, besiktas: 1300 },
    { day: 'Sal', satis: 5100, siparis: 58, merkez: 1900, kadikoy: 1700, besiktas: 1500 },
    { day: 'Çar', satis: 4800, siparis: 52, merkez: 1700, kadikoy: 1600, besiktas: 1500 },
    { day: 'Per', satis: 6200, siparis: 67, merkez: 2300, kadikoy: 2000, besiktas: 1900 },
    { day: 'Cum', satis: 7800, siparis: 89, merkez: 2900, kadikoy: 2600, besiktas: 2300 },
    { day: 'Cmt', satis: 9500, siparis: 112, merkez: 3500, kadikoy: 3200, besiktas: 2800 },
    { day: 'Paz', satis: 8900, siparis: 98, merkez: 3300, kadikoy: 2900, besiktas: 2700 }
  ];

  // Ürün kategorileri
  const categoryData = [
    { name: 'Pastalar', value: 45, color: '#f59e0b' },
    { name: 'Kurabiyeler', value: 25, color: '#ec4899' },
    { name: 'Ekler & Profiterol', value: 15, color: '#8b5cf6' },
    { name: 'Tatlılar', value: 10, color: '#3b82f6' },
    { name: 'Diğer', value: 5, color: '#10b981' }
  ];

  // Siparişler
  const [orders, setOrders] = useState([
    { id: 'SIP-2024-001', customer: 'Ayşe Yılmaz', product: 'Doğum Günü Pastası', branch: 'merkez', status: 'preparing', amount: 450, date: '04.02.2026 09:30', delivery: '04.02.2026 16:00', phone: '0532 xxx xx 23' },
    { id: 'SIP-2024-002', customer: 'Mehmet Kaya', product: 'Çikolatalı Cupcake (12 adet)', branch: 'kadikoy', status: 'ready', amount: 280, date: '04.02.2026 10:15', delivery: '04.02.2026 14:00', phone: '0545 xxx xx 67' },
    { id: 'SIP-2024-003', customer: 'Zeynep Demir', product: 'Profiterol (1kg)', branch: 'besiktas', status: 'pending', amount: 320, date: '04.02.2026 11:00', delivery: '04.02.2026 17:30', phone: '0505 xxx xx 89' },
    { id: 'SIP-2024-004', customer: 'Ali Öztürk', product: 'San Sebastian Cheesecake', branch: 'merkez', status: 'delivered', amount: 380, date: '03.02.2026 15:20', delivery: '04.02.2026 10:00', phone: '0533 xxx xx 45' },
    { id: 'SIP-2024-005', customer: 'Fatma Şahin', product: 'Tiramisu (2 dilim)', branch: 'kadikoy', status: 'preparing', amount: 180, date: '04.02.2026 12:30', delivery: '04.02.2026 18:00', phone: '0542 xxx xx 12' }
  ]);

  // Stok verileri
  const [stockItems, setStockItems] = useState([
    { id: 1, name: 'Un (kg)', category: 'Hammadde', merkez: 45, kadikoy: 38, besiktas: 42, min: 50, unit: 'kg', price: 8.5 },
    { id: 2, name: 'Şeker (kg)', category: 'Hammadde', merkez: 62, kadikoy: 55, besiktas: 58, min: 60, unit: 'kg', price: 12.0 },
    { id: 3, name: 'Yumurta (adet)', category: 'Hammadde', merkez: 180, kadikoy: 220, besiktas: 190, min: 200, unit: 'adet', price: 4.5 },
    { id: 4, name: 'Çikolata (kg)', category: 'Hammadde', merkez: 22, kadikoy: 18, besiktas: 25, min: 30, unit: 'kg', price: 85.0 },
    { id: 5, name: 'Tereyağı (kg)', category: 'Hammadde', merkez: 35, kadikoy: 28, besiktas: 32, min: 40, unit: 'kg', price: 95.0 },
    { id: 6, name: 'Pasta Kutusu (Büyük)', category: 'Ambalaj', merkez: 85, kadikoy: 92, besiktas: 78, min: 100, unit: 'adet', price: 3.5 },
    { id: 7, name: 'Pasta Kutusu (Küçük)', category: 'Ambalaj', merkez: 120, kadikoy: 135, besiktas: 115, min: 150, unit: 'adet', price: 2.0 },
    { id: 8, name: 'Krema (lt)', category: 'Hammadde', merkez: 18, kadikoy: 22, besiktas: 20, min: 25, unit: 'lt', price: 45.0 }
  ]);

  // Personel verileri
  const [staff, setStaff] = useState([
    { id: 1, name: 'Ahmet Yıldız', role: 'Pastane Şefi', branch: 'merkez', shift: 'Sabah (08:00-16:00)', phone: '0532 xxx xx 11', salary: 25000, performance: 95 },
    { id: 2, name: 'Elif Aksoy', role: 'Pastacı', branch: 'merkez', shift: 'Sabah (08:00-16:00)', phone: '0545 xxx xx 22', salary: 18000, performance: 88 },
    { id: 3, name: 'Burak Çelik', role: 'Satış Danışmanı', branch: 'kadikoy', shift: 'Öğle (12:00-20:00)', phone: '0505 xxx xx 33', salary: 16000, performance: 92 },
    { id: 4, name: 'Selin Kara', role: 'Pastacı', branch: 'kadikoy', shift: 'Sabah (08:00-16:00)', phone: '0533 xxx xx 44', salary: 17500, performance: 90 },
    { id: 5, name: 'Can Aydın', role: 'Pastane Şefi', branch: 'besiktas', shift: 'Sabah (08:00-16:00)', phone: '0542 xxx xx 55', salary: 24000, performance: 93 },
    { id: 6, name: 'Deniz Ergin', role: 'Satış Danışmanı', branch: 'besiktas', shift: 'Akşam (16:00-00:00)', phone: '0534 xxx xx 66', salary: 15500, performance: 85 }
  ]);

  // Ürünler
  const [products, setProducts] = useState([
    { id: 1, name: 'Çikolatalı Pasta', category: 'Pastalar', price: 450, cost: 180, stock: 12, image: '🍰' },
    { id: 2, name: 'Frambuazlı Cheesecake', category: 'Pastalar', price: 380, cost: 150, stock: 8, image: '🍰' },
    { id: 3, name: 'Profiterol', category: 'Ekler & Profiterol', price: 320, cost: 120, stock: 15, image: '🧁' },
    { id: 4, name: 'Kurabiye Çeşitleri (500gr)', category: 'Kurabiyeler', price: 180, cost: 70, stock: 25, image: '🍪' },
    { id: 5, name: 'Tiramisu', category: 'Tatlılar', price: 220, cost: 85, stock: 10, image: '🍮' },
    { id: 6, name: 'San Sebastian', category: 'Pastalar', price: 380, cost: 145, stock: 6, image: '🍰' },
    { id: 7, name: 'Ekler (6 adet)', category: 'Ekler & Profiterol', price: 150, cost: 60, stock: 20, image: '🧁' },
    { id: 8, name: 'Brownie', category: 'Diğer', price: 95, cost: 35, stock: 18, image: '🍫' }
  ]);

  // Müşteriler
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ayşe Yılmaz', phone: '0532 xxx xx 23', email: 'ayse@email.com', totalOrders: 23, totalSpent: 8450, lastOrder: '04.02.2026', birthday: '15 Mart', points: 845, vip: true },
    { id: 2, name: 'Mehmet Kaya', phone: '0545 xxx xx 67', email: 'mehmet@email.com', totalOrders: 15, totalSpent: 5280, lastOrder: '03.02.2026', birthday: '8 Haziran', points: 528, vip: false },
    { id: 3, name: 'Zeynep Demir', phone: '0505 xxx xx 89', email: 'zeynep@email.com', totalOrders: 31, totalSpent: 12450, lastOrder: '04.02.2026', birthday: '22 Eylül', points: 1245, vip: true },
    { id: 4, name: 'Ali Öztürk', phone: '0533 xxx xx 45', email: 'ali@email.com', totalOrders: 8, totalSpent: 2890, lastOrder: '02.02.2026', birthday: '10 Kasım', points: 289, vip: false }
  ]);

  // Tema değişimi
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sipariş durumu renkleri
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      ready: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      delivered: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Beklemede',
      preparing: 'Hazırlanıyor',
      ready: 'Hazır',
      delivered: 'Teslim Edildi'
    };
    return texts[status] || status;
  };

  // Ana Dashboard Görünümü
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-90">Bugünkü Satış</div>
              <div className="text-3xl font-bold">₺{dashboardData.todaySales.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{dashboardData.monthlyGrowth}% bu ay</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-90">Bugünkü Sipariş</div>
              <div className="text-3xl font-bold">{dashboardData.todayOrders}</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{dashboardData.pendingOrders} beklemede</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Users className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-90">Aktif Personel</div>
              <div className="text-3xl font-bold">{dashboardData.activeStaff}</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 mr-1" />
            <span>Ortalama performans: 90%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium opacity-90">Düşük Stok</div>
              <div className="text-3xl font-bold">{dashboardData.lowStock}</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Package className="w-4 h-4 mr-1" />
            <span>Ürün sipariş gerekli</span>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Haftalık Satış Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="satis" stroke="#f59e0b" strokeWidth={3} name="Toplam Satış (₺)" />
              <Line type="monotone" dataKey="siparis" stroke="#8b5cf6" strokeWidth={3} name="Sipariş Sayısı" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Ürün Kategorileri</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Şube Bazlı Performans */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Şube Performansı (Haftalık)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="merkez" fill="#f59e0b" name="Merkez" radius={[8, 8, 0, 0]} />
            <Bar dataKey="kadikoy" fill="#8b5cf6" name="Kadıköy" radius={[8, 8, 0, 0]} />
            <Bar dataKey="besiktas" fill="#3b82f6" name="Beşiktaş" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Son Siparişler */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Son Siparişler</h3>
          <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
            Tümünü Gör →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Sipariş No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Müşteri</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ürün</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Şube</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Durum</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{order.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{order.customer}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{order.product}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {branches.find(b => b.id === order.branch)?.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-semibold text-gray-800 dark:text-gray-200">₺{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Sipariş Yönetimi
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sipariş Yönetimi</h2>
          <p className="text-gray-600 dark:text-gray-400">Tüm siparişleri görüntüleyin ve yönetin</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Sipariş
        </button>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Sipariş ara..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
            />
          </div>
          <select className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white">
            <option>Tüm Durumlar</option>
            <option>Beklemede</option>
            <option>Hazırlanıyor</option>
            <option>Hazır</option>
            <option>Teslim Edildi</option>
          </select>
          <select className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white">
            <option>Tüm Şubeler</option>
            <option>Merkez</option>
            <option>Kadıköy</option>
            <option>Beşiktaş</option>
          </select>
          <select className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white">
            <option>Bugün</option>
            <option>Bu Hafta</option>
            <option>Bu Ay</option>
            <option>Tüm Zamanlar</option>
          </select>
        </div>
      </div>

      {/* Sipariş Listesi */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {branches.find(b => b.id === order.branch)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Müşteri:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.customer}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {order.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ürün:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.product}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sipariş Tarihi:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Teslim Tarihi:</span>
                    <p className="font-medium text-gray-800 dark:text-white">{order.delivery}</p>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-3">
                <div className="text-2xl font-bold text-orange-500">₺{order.amount}</div>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Stok Yönetimi
  const renderStock = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Stok Yönetimi</h2>
          <p className="text-gray-600 dark:text-gray-400">Tüm şubelerdeki stok durumunu takip edin</p>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Stok Girişi
        </button>
      </div>

      {/* Stok Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Kritik Seviye</div>
              <div className="text-3xl font-bold">{stockItems.filter(item => 
                item.merkez < item.min || item.kadikoy < item.min || item.besiktas < item.min
              ).length}</div>
            </div>
          </div>
          <p className="text-sm opacity-90">Acil sipariş gerekli</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Toplam Ürün</div>
              <div className="text-3xl font-bold">{stockItems.length}</div>
            </div>
          </div>
          <p className="text-sm opacity-90">Takip edilen kalem</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Normal Seviye</div>
              <div className="text-3xl font-bold">{stockItems.filter(item => 
                item.merkez >= item.min && item.kadikoy >= item.min && item.besiktas >= item.min
              ).length}</div>
            </div>
          </div>
          <p className="text-sm opacity-90">Yeterli stok var</p>
        </div>
      </div>

      {/* Stok Tablosu */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Ürün</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Merkez</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Kadıköy</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Beşiktaş</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Min. Seviye</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Birim Fiyat</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Durum</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => {
                const isLow = item.merkez < item.min || item.kadikoy < item.min || item.besiktas < item.min;
                return (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-800 dark:text-white">{item.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${item.merkez < item.min ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {item.merkez} {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${item.kadikoy < item.min ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {item.kadikoy} {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${item.besiktas < item.min ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {item.besiktas} {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {item.min} {item.unit}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">
                      ₺{item.price}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          Düşük
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Personel Yönetimi
  const renderStaff = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Personel Yönetimi</h2>
          <p className="text-gray-600 dark:text-gray-400">Çalışanlarınızı ve performanslarını takip edin</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Personel
        </button>
      </div>

      {/* Personel Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((person) => (
          <div key={person.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{person.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{person.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Şube
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {branches.find(b => b.id === person.branch)?.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Vardiya
                </span>
                <span className="font-medium text-gray-800 dark:text-white">{person.shift}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefon
                </span>
                <span className="font-medium text-gray-800 dark:text-white">{person.phone}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Maaş
                </span>
                <span className="font-medium text-gray-800 dark:text-white">₺{person.salary.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Performans</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">%{person.performance}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${person.performance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Ürün Yönetimi
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ürün Yönetimi</h2>
          <p className="text-gray-600 dark:text-gray-400">Ürünlerinizi ve reçetelerinizi yönetin</p>
        </div>
        <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Ürün
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{product.image}</div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{product.name}</h3>
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {product.category}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Satış Fiyatı:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₺{product.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Maliyet:</span>
                <span className="font-medium text-gray-600 dark:text-gray-400">₺{product.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Kar Marjı:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  %{Math.round(((product.price - product.cost) / product.price) * 100)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Stok:</span>
                <span className={`font-semibold ${product.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {product.stock} adet
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium text-sm">
                Düzenle
              </button>
              <button className="px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Müşteri Yönetimi
  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Müşteri Yönetimi</h2>
          <p className="text-gray-600 dark:text-gray-400">Müşterilerinizi takip edin ve sadakat programını yönetin</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Müşteri
        </button>
      </div>

      {/* Müşteri Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <Users className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-sm opacity-90 mb-1">Toplam Müşteri</div>
          <div className="text-3xl font-bold">{dashboardData.totalCustomers}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <Star className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-sm opacity-90 mb-1">VIP Müşteri</div>
          <div className="text-3xl font-bold">{customers.filter(c => c.vip).length}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
          <ShoppingCart className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-sm opacity-90 mb-1">Ort. Sipariş</div>
          <div className="text-3xl font-bold">
            ₺{Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.reduce((acc, c) => acc + c.totalOrders, 0))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-sm opacity-90 mb-1">Memnuniyet</div>
          <div className="text-3xl font-bold">{dashboardData.customerSatisfaction}/5</div>
        </div>
      </div>

      {/* Müşteri Listesi */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Müşteri</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">İletişim</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Toplam Sipariş</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Toplam Harcama</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Puan</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Son Sipariş</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Doğum Günü</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Durum</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">{customer.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: #{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">
                    {customer.totalOrders}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                    ₺{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <Star className="w-3 h-3 fill-current" />
                      {customer.points}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {customer.lastOrder}
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {customer.birthday}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {customer.vip ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Star className="w-3 h-3 fill-current" />
                        VIP
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        Standart
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Finans Raporu
  const renderFinance = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Finans & Raporlar</h2>
          <p className="text-gray-600 dark:text-gray-400">Gelir-gider takibi ve finansal raporlar</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          Rapor İndir
        </button>
      </div>

      {/* Finansal Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Gelir (Aylık)</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30).toLocaleString()}</div>
            </div>
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{dashboardData.monthlyGrowth}% geçen aya göre
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Gider (Aylık)</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.65).toLocaleString()}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Personel, stok, kira, faturalar
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
              <Cake className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Net Kar (Aylık)</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₺{(dashboardData.todaySales * 30 * 0.35).toLocaleString()}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Kar marjı: %35
          </div>
        </div>
      </div>

      {/* Detaylı Finansal Tablo */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Bu Ay Detaylı Finansal Durum</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Gelirler
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Ürün Satışları</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.85).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Özel Siparişler</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <span className="font-semibold text-gray-800 dark:text-white">Toplam Gelir</span>
                <span className="font-bold text-green-600 dark:text-green-400 text-lg">₺{(dashboardData.todaySales * 30).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              Giderler
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Hammadde & Stok</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.30).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Personel Maaşları</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.20).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Kira & Faturalar</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.10).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Diğer Giderler</span>
                <span className="font-semibold text-gray-800 dark:text-white">₺{(dashboardData.todaySales * 30 * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                <span className="font-semibold text-gray-800 dark:text-white">Toplam Gider</span>
                <span className="font-bold text-red-600 dark:text-red-400 text-lg">₺{(dashboardData.todaySales * 30 * 0.65).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-400 to-rose-500 p-3 rounded-2xl shadow-lg">
                <Cake className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Pastane Yönetim Sistemi
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hoş geldiniz, Admin</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Şube Seçici */}
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white font-medium"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>

              {/* Koyu/Açık Mod */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              {/* Bildirimler */}
              <button className="relative p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {dashboardData.lowStock}
                </span>
              </button>

              {/* Çıkış */}
              <button className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {[
              { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
              { id: 'orders', icon: ShoppingCart, label: 'Siparişler' },
              { id: 'stock', icon: Package, label: 'Stok' },
              { id: 'staff', icon: Users, label: 'Personel' },
              { id: 'products', icon: Cake, label: 'Ürünler' },
              { id: 'customers', icon: Users, label: 'Müşteriler' },
              { id: 'finance', icon: DollarSign, label: 'Finans' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'stock' && renderStock()}
        {activeTab === 'staff' && renderStaff()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'finance' && renderFinance()}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 Pastane Yönetim Sistemi. Tüm hakları saklıdır.</p>
          <p className="mt-1">Versiyon 1.0.0 | Son güncelleme: 04 Şubat 2026</p>
        </div>
      </footer>
  

{/* BarbarosSoft Global Footer */}
<div className="mt-12 pb-10 text-center border-t border-gray-800/30 pt-8">
  <div className="flex items-center justify-center gap-2">
    <span className="text-gray-600 text-[11px] uppercase tracking-[0.2em] font-light">
      Powered by
    </span>
    <p className="flex items-center tracking-tighter">
      <span className="text-red-600 font-black text-base italic ml-[1px]">Barbaros</span>
      <span className="text-red-600 font-black text-base italic ml-[1px]">Soft</span>
    </p>
    <div className="h-3 w-[1px] bg-gray-800 mx-2"></div>
    <span className="text-gray-600 text-xs font-medium">2026</span>
  </div>
</div>
    </div>
  
  );
};

export default PastaneDashboard;