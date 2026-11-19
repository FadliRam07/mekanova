import { useEffect, useState } from 'react';
import { CalendarCheck, TrendingUp, Users, CheckCircle, ArrowUpRight, ArrowDownRight, Download, Loader2, Wrench, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, newCustomers: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const currentHour = new Date().getHours();
  let greeting = 'Pagi';
  if (currentHour >= 11 && currentHour < 15) greeting = 'Siang';
  else if (currentHour >= 15 && currentHour < 18) greeting = 'Sore';
  else if (currentHour >= 18 || currentHour < 4) greeting = 'Malam';

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: bookings } = await supabase.from('bookings').select(`*, services(name, price)`).order('created_at', { ascending: false });
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');
      const { data: services } = await supabase.from('services').select('*').order('id');

      if (bookings) {
        setAllBookings(bookings); 
        const totalRev = bookings.reduce((sum, b) => sum + (b.services?.price || 0), 0);
        const completed = bookings.filter(b => b.status === 'completed').length;
        setStats({ totalBookings: bookings.length, revenue: totalRev, newCustomers: userCount || 0, completed: completed });
        setRecentBookings(bookings.slice(0, 5));
      }
      if (services) setServicesList(services);
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  const handleDownloadReport = () => {
    if (allBookings.length === 0) return alert("Belum ada data booking.");
    setIsDownloading(true);
    try {
      const dataToExport = allBookings.map(b => ({
        "Kode": b.booking_code, "Pelanggan": b.customer_name, "No HP": b.customer_phone,
        "Layanan": b.services?.name || '-', "Harga": b.services?.price || 0,
        "Tanggal": b.booking_date, "Jam": b.booking_time, "Status": b.status.toUpperCase(),
        "Dibuat": new Date(b.created_at).toLocaleString('id-ID')
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Booking");
      worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 20 }];
      XLSX.writeFile(workbook, `Laporan_Mekanova_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      alert("Terjadi kesalahan saat mengunduh laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-sm font-bold text-gray-400 mb-1 uppercase">{currentDate}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Selamat {greeting}, {profile?.full_name || 'Admin'}</h1>
          <p className="text-gray-500 text-sm mt-1">Berikut ringkasan aktivitas bengkel hari ini.</p>
        </div>
        <button onClick={handleDownloadReport} disabled={isDownloading} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-gray-50 disabled:opacity-50 w-full md:w-auto justify-center">
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
          {isDownloading ? 'Mengunduh...' : 'Unduh laporan'}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium text-sm">Total booking</p>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><CalendarCheck size={20} /></div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stats.totalBookings}</h3>
          <p className="text-sm text-green-600 flex items-center gap-1 font-medium"><ArrowUpRight size={16} /> +12.8%</p>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium text-sm">Revenue bulan ini</p>
            <div className="bg-green-50 p-2 rounded-lg text-green-600"><TrendingUp size={20} /></div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Rp {stats.revenue.toLocaleString('id-ID')}</h3>
          <p className="text-sm text-green-600 flex items-center gap-1 font-medium"><ArrowUpRight size={16} /> +8.4%</p>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium text-sm">Pelanggan baru</p>
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Users size={20} /></div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stats.newCustomers}</h3>
          <p className="text-sm text-green-600 flex items-center gap-1 font-medium"><ArrowUpRight size={16} /> +18.2%</p>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium text-sm">Servis selesai</p>
            <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600"><CheckCircle size={20} /></div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stats.completed}</h3>
          <p className="text-sm text-red-600 flex items-center gap-1 font-medium"><ArrowDownRight size={16} /> -2.1%</p>
        </div>
      </div>

      {/* BAGIAN BAWAH: 2 KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabel Booking (Bisa di-scroll di HP) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Booking Terbaru</h2>
            <p className="text-sm text-gray-500">Daftar 5 pesanan masuk terakhir.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Kode</th>
                  <th className="p-4 font-medium">Pelanggan</th>
                  <th className="p-4 font-medium">Layanan</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">Belum ada booking masuk.</td></tr>
                ) : (
                  recentBookings.map(b => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-sm">{b.booking_code}</td>
                      <td className="p-4 text-sm">{b.customer_name}</td>
                      <td className="p-4 text-sm">{b.services?.name}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Layanan Tersedia */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Layanan Tersedia</h2>
            <Link to="/admin/services" className="text-sm text-blue-600 font-medium flex items-center hover:underline">
              Kelola <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 text-sm">Memuat layanan...</p>
            ) : servicesList.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">Belum ada layanan.</p>
            ) : (
              servicesList.slice(0, 5).map(svc => ( 
                <div key={svc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Wrench size={18} /></div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{svc.name}</p>
                    <p className="text-xs text-gray-500">Rp {svc.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}