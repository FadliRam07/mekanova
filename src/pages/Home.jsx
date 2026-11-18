import { useEffect, useState } from 'react';
import { CheckCircle2, Star, ShieldCheck, CalendarDays, Wrench, Banknote, ArrowRight, PackageOpen, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth(); 

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      // Ambil data layanan (tampilkan maksimal 6 untuk beranda)
      const { data } = await supabase.from('services').select('*').limit(6);
      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <div className="bg-white">
      
      {/* --- BANNER SAPAAN (Hanya muncul jika sudah login) --- */}
      {user && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm font-medium">
              👋 Selamat datang kembali, <span className="font-bold text-lg text-yellow-300">{profile?.full_name || 'Pelanggan'}</span>!
            </p>
            <p className="text-xs text-blue-100">Senang melihatmu lagi. Siap servis kendaraanmu hari ini?</p>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            4,9 dari 5.000+ pelanggan
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Servis Presisi,<br />
            <span className="text-blue-600">Performa Baru.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Booking servis motor & mobil online. Mekanik bersertifikat, harga transparan, dan garansi servis 30 hari.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link to="/booking">
              <Button className="px-6 py-3.5 text-base flex items-center gap-2">
                Booking servis <span>→</span>
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="px-6 py-3.5 text-base">
                Lihat layanan
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-8 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2"><ShieldCheck size={18} /> Mekanik bersertifikat</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} /> Garansi 30 hari</div>
            <div className="flex items-center gap-2"><CalendarDays size={18} /> Booking online</div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop" 
              alt="Mekanik Mekanova" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute top-8 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
              <Star size={20} className="fill-yellow-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">4,9 / 5</p>
              <p className="text-xs text-gray-500">Kepuasan pelanggan</p>
            </div>
          </div>

          <div className="absolute -bottom-6 left-10 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Servis selesai dengan tenang</p>
                <p className="text-xs text-gray-500">Garansi 30 hari untuk setiap servis</p>
              </div>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* --- LAYANAN KAMI SECTION (Desain Disamakan dengan Halaman Services) --- */}
      <div className="py-16 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Layanan Kami</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Semua kebutuhan servis kendaraanmu</h3>
            <p className="text-gray-600">Dari perawatan rutin sampai perbaikan khusus, semua ditangani dengan teliti dan transparan.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Memuat layanan...</div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
              <PackageOpen size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada layanan</h3>
              <p className="text-gray-500">Layanan akan muncul di sini setelah ditambahkan ke database Supabase.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div key={svc.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Wrench className="text-blue-600" size={24} />
                    </div>
                    {svc.is_popular ? (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        Paling dicari
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Garansi
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{svc.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-grow">{svc.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                    <span className="flex items-center gap-1"><Clock size={16} /> {svc.duration_minutes} menit</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Mulai dari</p>
                      <p className="text-lg font-bold">Rp {svc.price.toLocaleString('id-ID')}</p>
                    </div>
                    <Link to="/booking">
                      <Button variant="outline" className="px-4 py-2 flex items-center gap-2 text-sm">
                        Booking <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" className="px-6 py-3 flex items-center gap-2 mx-auto">
                Lihat Semua Layanan <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- KENAPA MEKANOVA SECTION --- */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Kenapa Mekanova</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lebih nyaman dari awal sampai jalan lagi.</h3>
            <p className="text-gray-600 mb-8">Kami percaya servis yang baik dimulai dari proses yang jujur, mudah, dan bisa kamu percaya.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="mb-2"><ShieldCheck className="text-blue-600" size={24} /></div>
                <h4 className="font-bold mb-1">Mekanik bersertifikat</h4>
                <p className="text-sm text-gray-500">Teknisi berpengalaman menangani berbagai merek kendaraan.</p>
              </div>
              <div>
                <div className="mb-2"><CheckCircle2 className="text-blue-600" size={24} /></div>
                <h4 className="font-bold mb-1">Garansi servis 30 hari</h4>
                <p className="text-sm text-gray-500">Kami berdiri di belakang setiap pekerjaan yang kami lakukan.</p>
              </div>
              <div>
                <div className="mb-2"><CalendarDays className="text-blue-600" size={24} /></div>
                <h4 className="font-bold mb-1">Booking online 24/7</h4>
                <p className="text-sm text-gray-500">Pilih waktu yang pas tanpa perlu antre di bengkel.</p>
              </div>
              <div>
                <div className="mb-2"><Banknote className="text-blue-600" size={24} /></div>
                <h4 className="font-bold mb-1">Harga transparan</h4>
                <p className="text-sm text-gray-500">Estimasi biaya jelas sebelum pengerjaan dimulai.</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-3xl h-[400px] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=1000&auto=format&fit=crop" alt="Mekanik" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* --- 3 LANGKAH MUDAH --- */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Singkat & Praktis</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Servis dalam 3 langkah mudah</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-700/50 p-8 rounded-2xl">
              <p className="text-sm font-bold text-blue-200 mb-4">LANGKAH 01</p>
              <h4 className="text-xl font-bold mb-2">Pilih layanan & jadwal</h4>
              <p className="text-blue-100 text-sm">Pilih kebutuhan kendaraan dan waktu yang paling nyaman.</p>
            </div>
            <div className="bg-blue-700/50 p-8 rounded-2xl">
              <p className="text-sm font-bold text-blue-200 mb-4">LANGKAH 02</p>
              <h4 className="text-xl font-bold mb-2">Datang & serahkan kendaraan</h4>
              <p className="text-blue-100 text-sm">Mekanik kami melakukan pengecekan sebelum mulai bekerja.</p>
            </div>
            <div className="bg-blue-700/50 p-8 rounded-2xl">
              <p className="text-sm font-bold text-blue-200 mb-4">LANGKAH 03</p>
              <h4 className="text-xl font-bold mb-2">Bayar & kendaraan siap</h4>
              <p className="text-blue-100 text-sm">Lihat rincian biaya, selesaikan pembayaran, lalu berkendara.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CERITA PELANGGAN --- */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Cerita Pelanggan</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dipercaya ribuan pelanggan</h3>
            <p className="text-gray-600">Pengalaman servis yang bikin perjalanan terasa lebih tenang.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Booking-nya gampang dan estimasi biayanya jelas dari awal. Motorku selesai tepat waktu."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">RA</div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Raka Aditya</p>
                  <p className="text-xs text-gray-500">Pemilik Honda Vario 160</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Teknisinya menjelaskan kondisi AC dengan detail tanpa bikin bingung. Hasilnya juga memuaskan."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">SP</div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Sinta Putri</p>
                  <p className="text-xs text-gray-500">Pemilik Toyota Yaris</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Pelayanan ramah, tempatnya bersih, dan garansi servisnya bikin makin yakin. Pasti kembali."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">DF</div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Dimas Firmansyah</p>
                  <p className="text-xs text-gray-500">Pemilik Yamaha NMAX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Performa Kendaraanmu Menunggu</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Siap servis kendaraanmu hari ini?</h3>
          <p className="text-gray-600 mb-8 text-lg">Pilih jadwal dalam hitungan menit. Tanpa antre, tanpa tebak-tebakan harga.</p>
          <Link to="/booking">
            <Button className="px-8 py-4 text-lg flex items-center justify-center gap-2 mx-auto">
              Booking sekarang <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}