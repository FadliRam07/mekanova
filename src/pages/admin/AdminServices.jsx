import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Wrench } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_minutes: '' });

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('id');
    if (data) setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('services').insert({
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      duration_minutes: parseInt(form.duration_minutes),
      is_popular: false
    });

    if (!error) {
      setIsAdding(false);
      setForm({ name: '', description: '', price: '', duration_minutes: '' });
      fetchServices(); // Refresh data
    } else {
      alert('Gagal menambah: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layanan & Produk</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar layanan bengkel.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      {/* FORM TAMBAH LAYANAN */}
      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-6">
          <h3 className="font-bold mb-4">Tambah Layanan Baru</h3>
          <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Nama Layanan" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-3 rounded-lg" />
            <input required type="number" placeholder="Harga (Rp)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-3 rounded-lg" />
            <input required type="number" placeholder="Durasi (Menit)" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} className="border p-3 rounded-lg" />
            <input required type="text" placeholder="Deskripsi Singkat" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-3 rounded-lg" />
            <button type="submit" className="bg-green-600 text-white p-3 rounded-lg font-bold md:col-span-2 hover:bg-green-700">Simpan Layanan</button>
          </form>
        </div>
      )}

      {/* TABEL LAYANAN */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Nama Layanan</th>
              <th className="p-4 font-medium">Harga</th>
              <th className="p-4 font-medium">Durasi</th>
              <th className="p-4 font-medium">Deskripsi</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">Belum ada layanan.</td></tr>
            ) : (
              services.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Wrench size={16}/></div>
                    {s.name}
                  </td>
                  <td className="p-4 text-sm font-bold">Rp {s.price.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-sm">{s.duration_minutes} menit</td>
                  <td className="p-4 text-sm text-gray-500">{s.description}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
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