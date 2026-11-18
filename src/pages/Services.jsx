import { useEffect, useState } from 'react';
import { Search, Wrench, CheckCircle2, Clock, ArrowRight, PackageOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      // Ambil SEMUA layanan dari Supabase
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
        
      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  // Filter pencarian berdasarkan nama layanan
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
      <div className="text-sm text-gray-500 mb-4">Beranda / Layanan</div>
      <h1 className="text-4xl font-bold mb-2">Layanan kami</h1>
      <p className="text-gray-600 mb-8">Perawatan kendaraan yang tepat, ditangani dengan teliti.</p>

      {/* Search Bar & Garansi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari layanan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle2 size={16} /> Garansi servis 30 hari
          </div>
        </div>
      </div>

      {/* LOGIKA TAMPILAN */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat data layanan...</div>
      ) : filteredServices.length === 0 ? (
        /* TAMPILAN JIKA DATA KOSONG */
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <PackageOpen size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada layanan tersedia</h3>
          <p className="text-gray-500 max-w-md">
            {search ? `Layanan dengan kata kunci "${search}" tidak ditemukan.` : 'Data layanan belum ditambahkan ke database. Silakan hubungi admin.'}
          </p>
        </div>
      ) : (
        /* TAMPILAN JIKA DATA ADA (GRID KARTU) */
        <div className="grid md:grid-cols-3 gap-6">
          {filteredServices.map((svc) => (
            <div key={svc.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col bg-white">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Wrench className="text-blue-600" size={24} />
                </div>
                {/* Jika is_popular true, munculkan badge */}
                {svc.is_popular && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    Paling dicari
                  </span>
                )}
                {!svc.is_popular && (
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
    </div>
  );
}