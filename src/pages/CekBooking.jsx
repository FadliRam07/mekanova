import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, Frown, Wrench, CalendarDays, FileText, CheckCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function CekBooking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchCode, setSearchCode] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchMyBookings = async () => {
        const { data, error } = await supabase
          .from('bookings')
          .select(`*, services (name, price, duration_minutes)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) setBookings(data);
        setLoading(false);
      };
      fetchMyBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    const cleanCode = searchCode.trim().toUpperCase();
    const cleanPhone = searchPhone.trim();

    const { data, error } = await supabase
      .from('bookings')
      .select(`*, services (name, price, duration_minutes)`)
      .eq('booking_code', cleanCode)
      .eq('customer_phone', cleanPhone)
      .single();

    if (error) {
      setSearchError('Data booking tidak ditemukan. Periksa kembali Kode Booking dan Nomor HP.');
    } else {
      setSearchResult(data);
    }
    setIsSearching(false);
  };

  // Komponen Card dengan Timeline Dinamis
  const BookingCard = ({ data }) => {
    // Tentukan posisi timeline berdasarkan status
    const isConfirmed = data.status === 'confirmed' || data.status === 'completed';
    const isCompleted = data.status === 'completed';

    return (
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">KODE: {data.booking_code}</p>
            <h3 className="text-xl font-bold text-gray-900">{data.services?.name || 'Layanan'}</h3>
            <p className="text-gray-500 text-sm mt-1">Atas nama: <span className="font-semibold">{data.customer_name}</span></p>
          </div>
          <span className={`font-bold text-sm px-4 py-2 rounded-full capitalize
            ${data.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
              data.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 
              data.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {data.status === 'confirmed' ? 'Dikonfirmasi' : 
             data.status === 'completed' ? 'Selesai' : 
             data.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <CalendarDays className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Jadwal Servis</p>
              <p className="font-bold text-sm">{data.booking_date} · {data.booking_time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <Wrench className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Estimasi Biaya</p>
              <p className="font-bold text-sm">Rp {data.services?.price?.toLocaleString('id-ID') || '-'}</p>
            </div>
          </div>
        </div>

        {/* Timeline Status Dinamis */}
        <div className="space-y-6">
          {/* Langkah 1: Booking Diterima (Selalu aktif) */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full p-1"><CheckCircle2 size={16} /></div>
              <div className={`w-0.5 h-full mt-1 ${isConfirmed ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="pb-4">
              <h4 className="font-bold text-gray-900 text-sm">Booking diterima</h4>
              <p className="text-xs text-gray-500 mt-1">Pesanan kamu sudah masuk ke sistem.</p>
            </div>
          </div>

          {/* Langkah 2: Sedang Dikerjakan */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`rounded-full p-1 ${isConfirmed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Clock size={16} />
              </div>
              <div className={`w-0.5 h-full mt-1 ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="pb-4">
              <h4 className={`font-bold text-sm ${isConfirmed ? 'text-gray-900' : 'text-gray-400'}`}>Kendaraan diservis</h4>
              <p className="text-xs text-gray-500 mt-1">
                {isConfirmed ? 'Mekanik kami sedang mengerjakan kendaraanmu.' : 'Menunggu konfirmasi dari admin.'}
              </p>
            </div>
          </div>

          {/* Langkah 3: Selesai */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`rounded-full p-1 ${isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <CheckCheck size={16} />
              </div>
            </div>
            <div>
              <h4 className={`font-bold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>Servis Selesai</h4>
              <p className="text-xs text-gray-500 mt-1">
                {isCompleted ? 'Kendaraan sudah siap untuk diambil!' : 'Menunggu pengerjaan selesai.'}
              </p>
            </div>
          </div>
        </div>

        {/* Jika statusnya completed, beri warna hijau di background card */}
        {isCompleted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="font-bold text-green-800">Kendaraanmu sudah siap diambil! Silakan datang ke bengkel.</p>
          </div>
        )}
        {data.status === 'cancelled' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="font-bold text-red-800">Booking ini telah dibatalkan.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-[70vh]">
      <div className="text-center mb-10">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Status Booking</span>
        <h1 className="text-4xl font-bold mt-4 mb-2">Servis kendaraanmu sampai mana?</h1>
        <p className="text-gray-500">Pantau status servis kendaraanmu dengan mudah.</p>
      </div>

      {user ? (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-blue-600" />
            <h2 className="text-2xl font-bold">Riwayat Booking Kamu</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat riwayat booking...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <Frown className="mx-auto text-gray-400 mb-3" size={40} />
              <h3 className="font-bold text-gray-700">Belum ada booking</h3>
              <p className="text-gray-500 text-sm mb-4">Kamu belum pernah melakukan booking servis.</p>
              <Link to="/booking"><Button>Booking Sekarang</Button></Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => (
                <BookingCard key={b.id} data={b} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-8 max-w-xl mx-auto">
          <p className="text-blue-800 font-medium">Ingin melihat semua riwayat bookingmu sekaligus?</p>
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk ke akunmu di sini</Link>
        </div>
      )}

      {/* PENCARIAN MANUAL */}
      <div className="relative flex py-5 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Pencarian Manual (Tanpa Login)</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-sm mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode booking</label>
            <input type="text" placeholder="MKV-123456" value={searchCode} onChange={e => setSearchCode(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600 uppercase font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input type="text" placeholder="0812xxxx" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600" />
          </div>
        </div>
        <Button disabled={isSearching} className="w-full py-3 text-base flex justify-center items-center gap-2">
          {isSearching ? 'Mencari...' : 'Cek status booking'} <Search size={18} />
        </Button>
        
        {searchError && (
          <div className="mt-6 flex flex-col items-center text-center p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="font-bold text-red-800">{searchError}</p>
          </div>
        )}
      </form>

      {searchResult && (
        <div className="animate-fade-in-up">
          <h3 className="font-bold text-gray-700 mb-4">Hasil Pencarian:</h3>
          <BookingCard data={searchResult} />
        </div>
      )}
    </div>
  );
}