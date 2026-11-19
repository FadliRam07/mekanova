import { useEffect, useState } from 'react';
import { ArrowLeft, Wrench, Check, Loader2, CalendarDays, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Booking() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State form
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    date: '', 
    time: '' 
  });
  
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // 1. Ambil data layanan dari Supabase
  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from('services').select('*');
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  // 2. Isi otomatis form nama & no hp jika user sudah login
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: profile.full_name || '',
        phone: profile.phone || ''
      }));
    }
  }, [profile]);

  // 3. Fungsi Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return alert('Pilih layanan dulu!');
    
    setLoading(true);
    // Generate kode unik, contoh: MKV-123456
    const bookingCode = 'MKV-' + Math.floor(100000 + Math.random() * 900000);
    
    // Simpan ke tabel bookings
    const { error } = await supabase.from('bookings').insert({
      booking_code: bookingCode,
      customer_name: form.name,
      customer_phone: form.phone,
      service_id: selectedService.id,
      booking_date: form.date,
      booking_time: form.time,
      status: 'confirmed',
      user_id: user?.id // <-- Menyimpan ID User agar muncul di halaman Cek Booking
    });

    setLoading(false);

    if (error) {
      alert('Gagal booking: ' + error.message);
    } else {
      // Tampilkan pop-up kode booking yang sangat jelas
      alert(`✅ BOOKING BERHASIL!\n\nSimpan kode ini untuk cek status:\n\nKODE BOOKING: ${bookingCode}\n\nJadwal: ${form.date} jam ${form.time}`);
      navigate('/cek-booking');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-[80vh]">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-medium transition-colors">
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Pilih Layanan & Form */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">Pilih layanan servis</h1>
          <p className="text-gray-500 mb-6">Pilih layanan yang paling sesuai dengan kebutuhanmu.</p>

          {/* List Layanan */}
          {services.length === 0 ? (
            <div className="p-6 bg-gray-50 border rounded-xl text-center text-gray-500 mb-8">
              Memuat layanan atau belum ada layanan tersedia...
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {services.map((svc) => (
                <div 
                  key={svc.id} 
                  onClick={() => setSelectedService(svc)}
                  className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer relative transition-all duration-200 ${selectedService?.id === svc.id ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-gray-200 hover:border-blue-400'}`}
                >
                  <div className={`p-2 rounded-lg ${selectedService?.id === svc.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{svc.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{svc.duration_minutes} menit · Rp {svc.price.toLocaleString('id-ID')}</p>
                  </div>
                  {selectedService?.id === svc.id && (
                    <div className="absolute top-4 right-4 text-blue-600">
                      <Check size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <h2 className="text-xl font-bold mb-4">Isi Data Diri & Jadwal</h2>
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (WhatsApp)</label>
                <input required type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="08xxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Servis</label>
                <input required type="date" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kedatangan</label>
                <input required type="time" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              </div>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: Ringkasan Booking */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4">Ringkasan booking</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Layanan dipilih</p>
              <p className="font-bold text-gray-900">{selectedService ? selectedService.name : 'Belum dipilih'}</p>
            </div>

            <div className="space-y-3 text-sm mb-6 border-b pb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><CalendarDays size={16}/> Tanggal</span>
                <span className="font-semibold">{form.date || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><Clock size={16}/> Waktu</span>
                <span className="font-semibold">{form.time || '-'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Total estimasi</span>
              <span className="text-xl font-bold text-blue-600">
                {selectedService ? `Rp ${selectedService.price.toLocaleString('id-ID')}` : 'Rp 0'}
              </span>
            </div>
            
            <button 
              type="submit" 
              form="booking-form" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Konfirmasi Booking'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">Pastikan data sudah benar sebelum menekan tombol.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}