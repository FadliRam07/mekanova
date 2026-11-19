import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Wrench, LogOut, ArrowLeft, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk Mobile Sidebar

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Booking', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Layanan & Produk', path: '/admin/services', icon: <Wrench size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Tombol Hamburger (Hanya muncul di HP) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Gelap saat menu terbuka (Hanya di HP) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="bg-blue-600 p-2 rounded-xl text-white mr-3"><Settings size={20} /></div>
          <span className="text-xl font-bold text-gray-900">Mekanova</span>
        </div>

        <div className="p-4 text-xs font-bold text-gray-400 tracking-wider mt-4">MENU UTAMA</div>
        <nav className="flex-1 px-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // Tutup menu saat diklik di HP
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 px-2 py-2">
            <ArrowLeft size={16} /> Kembali ke situs
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-2 py-2 mt-2 w-full text-left">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}