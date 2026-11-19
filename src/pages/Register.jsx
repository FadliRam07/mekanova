import { useState } from 'react';
import { ArrowRight, Settings, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signUp(form.email, form.password, form.fullName, form.phone);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert('Registrasi berhasil! Silakan cek email untuk verifikasi (jika diaktifkan di Supabase), atau langsung masuk.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Daftar Akun</span>
          <h1 className="text-3xl font-bold mt-4 mb-2">Buat akun Mekanova</h1>
          <p className="text-gray-500 mb-8">Mulai kelola kendaraanmu dengan mudah.</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Nama kamu" 
                required
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat email</label>
              <input 
                type="email" 
                placeholder="nama@email.com" 
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
              <input 
                type="tel" 
                placeholder="0812 3456 7890" 
                required
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 8 karakter" 
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-600" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button disabled={loading} className="w-full py-3 text-base flex justify-center items-center gap-2 mt-6">
              {loading ? 'Memproses...' : 'Daftar sekarang'} {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-400">atau</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-gray-700 hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Sudah punya akun? <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-blue-50/50 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Settings size={24} /></div>
            <span className="text-2xl font-bold text-gray-900">Mekanova</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Servis yang baik dimulai dengan rasa percaya.</h2>
          <p className="text-gray-600 mb-10 text-lg">Booking lebih mudah, mengetahui proses servis dengan jelas, dan kembali ke jalan dengan tenang.</p>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
            </div>
            <p className="text-gray-700 font-medium italic mb-6">"Dari booking sampai selesai semuanya jelas. Mekaniknya juga menjelaskan apa yang dikerjakan dengan sabar."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">SP</div>
              <div>
                <p className="font-bold text-sm">Sinta Putri</p>
                <p className="text-xs text-gray-500">Pelanggan Mekanova</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}