import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- LAYOUT & GUEST PAGES ---
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import CekBooking from './pages/CekBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import CeritaPelanggan from './pages/CeritaPelanggan';
import Tentang from './pages/Tentang';

// --- PROTECTED PAGES (USER) ---
import Booking from './pages/Booking';
import ProtectedRoute, { AdminRoute } from './components/auth/ProtectedRoute';

// --- ADMIN PAGES ---
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/AdminBookings'; // <-- Import halaman Booking Admin
import AdminServices from './pages/admin/AdminServices'; // <-- Import halaman Layanan Admin

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
            RUTE UNTUK USER BIASA / PUBLIK 
            (Menggunakan Navbar Atas)
        ========================================= */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/services" element={<><Navbar /><Services /></>} />
        <Route path="/cek-booking" element={<><Navbar /><CekBooking /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/cerita-pelanggan" element={<><Navbar /><CeritaPelanggan /></>} />
        <Route path="/tentang" element={<><Navbar /><Tentang /></>} />
        
        {/* Halaman Booking yang butuh Login */}
        <Route path="/booking" element={
          <ProtectedRoute>
            <Navbar />
            <Booking />
          </ProtectedRoute>
        } />

        {/* =========================================
            RUTE UNTUK ADMIN DASHBOARD 
            (Menggunakan Sidebar AdminLayout)
        ========================================= */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          {/* Konten yang muncul di dalam <Outlet /> pada AdminLayout */}
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="services" element={<AdminServices />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}