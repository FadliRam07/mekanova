import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { ArrowRight, Settings, ChevronDown, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Settings size={24} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-900">Mekanova</span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <Link to="/services" className="hover:text-blue-600 transition-colors">Layanan</Link>
          <Link to="/tentang" className="hover:text-blue-600 transition-colors">Tentang</Link>
          <Link to="/cerita-pelanggan" className="hover:text-blue-600 transition-colors">Cerita pelanggan</Link>
          <Link to="/cek-booking" className="hover:text-blue-600 transition-colors">Cek booking</Link>
          
          <div className="relative group cursor-pointer flex items-center gap-1 text-blue-600 py-6">
            <span>Jelajahi layar</span>
            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
            <div className="absolute top-[70px] left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <Link to="/services" className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-50">Semua Layanan</Link>
              <Link to="/booking" className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-50">Booking Baru</Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 transition-colors">
                  <LayoutDashboard size={16} /> Kembali ke Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Kanan (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-semibold text-gray-700">
                Hai, {profile?.full_name?.split(' ')[0] || user.email.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-white border border-red-200 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                <LogOut size={16} /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Masuk</Link>
              <Link to="/booking">
                <Button className="px-5 py-2.5 text-sm flex items-center gap-2">Booking sekarang <ArrowRight size={16} /></Button>
              </Link>
            </>
          )}
        </div>

        {/* Tombol Menu Mobile (Hamburger) */}
        <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full">
          <Link to="/services" className="block text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Layanan</Link>
          <Link to="/tentang" className="block text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
          <Link to="/cerita-pelanggan" className="block text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Cerita pelanggan</Link>
          <Link to="/cek-booking" className="block text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Cek booking</Link>
          <Link to="/booking" className="block text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Booking Baru</Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" className="block text-blue-600 font-bold py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard Admin</Link>
          )}
          
          <div className="border-t border-gray-100 pt-4 mt-2">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-700">Hai, {profile?.full_name?.split(' ')[0] || user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="text-left text-sm font-semibold text-red-600 flex items-center gap-2">
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-sm font-semibold text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full py-3 text-sm">Booking sekarang</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}