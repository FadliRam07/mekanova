import { useState } from 'react';
import { ArrowRight, Settings, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Proses Login ke Supabase
    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Jika login sukses, cek Role-nya di tabel profiles
    // Ambil data user yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setLoading(false);

      // 3. Auto-Redirect berdasarkan role
      if (profileData?.role === 'admin') {
        navigate('/admin'); // Lempar ke Dashboard Admin
      } else {
        navigate('/'); // Lempar ke Beranda User Biasa
      }
    } else {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Selamat Datang</span>
          
          <h1 className="text-3xl font-bold mt-4 mb-2">Masuk ke akunmu</h1>
          <p className="text-gray-500 mb-8">
            Silakan masuk terlebih dahulu untuk mengelola booking dan melakukan pemesanan servis.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100 flex items-center gap-2">
              <span className="font-bold">Gagal:</span> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat email</label>
              <input 
                type="email" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 8 karakter" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
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
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" /> Ingat saya
              </label>
              <Link to="#" className="text-blue-600 font-medium hover:underline">Lupa kata sandi?</Link>
            </div>

            <Button disabled={loading} className="w-full py-3 text-base flex justify-center items-center gap-2 mt-6">
              {loading ? 'Memproses...' : 'Masuk'} {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-400">atau</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button type="button" className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>

      {/* Banner Kanan */}
      <div className="hidden md:flex w-1/2 bg-blue-50/50 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Settings size={24} /></div>
            <span className="text-2xl font-bold text-gray-900">Mekanova</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4 text-gray-900">Servis yang baik dimulai dengan rasa percaya.</h2>
          <p className="text-gray-600 mb-10 text-lg">Booking lebih mudah, mengetahui proses servis dengan jelas, dan kembali ke jalan dengan tenang.</p>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
            </div>
            <p className="text-gray-700 font-medium italic mb-6">"Dari booking sampai selesai semuanya jelas. Mekaniknya juga menjelaskan apa yang dikerjakan dengan sabar."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">SP</div>
              <div>
                <p className="font-bold text-sm text-gray-900">Sinta Putri</p>
                <p className="text-xs text-gray-500">Pelanggan Mekanova</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}