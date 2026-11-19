import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, CheckCircle, Clock, CheckCheck } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`*, services(name)`)
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Gagal update status: ' + error.message);
    } else {
      // Refresh data setelah update
      fetchBookings();
    }
  };

  const filtered = bookings.filter(b => 
    b.booking_code.toLowerCase().includes(search.toLowerCase()) || 
    b.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar semua pesanan servis yang masuk.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari kode / nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Kode</th>
              <th className="p-4 font-medium">Pelanggan</th>
              <th className="p-4 font-medium">Layanan</th>
              <th className="p-4 font-medium">Jadwal</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Aksi (Ubah Status)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">Belum ada data booking.</td></tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-sm">{b.booking_code}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{b.customer_name}</p>
                    <p className="text-xs text-gray-500">{b.customer_phone}</p>
                  </td>
                  <td className="p-4 text-sm">{b.services?.name}</td>
                  <td className="p-4 text-sm">{b.booking_date} · {b.booking_time}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full capitalize 
                      ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {b.status === 'pending' && <Clock size={12}/>}
                      {b.status === 'confirmed' && <CheckCircle size={12}/>}
                      {b.status === 'completed' && <CheckCheck size={12}/>}
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={b.status}
                      onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Batal</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}