import { ShieldCheck, Target, Users, Wrench } from 'lucide-react';

export default function Tentang() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tentang Kami</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Lebih dari sekadar bengkel biasa.</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Mekanova didirikan dengan satu tujuan: mengubah cara orang memandang servis kendaraan. Kami menggabungkan mekanik ahli dengan teknologi modern agar pengalaman servis jadi lebih jujur, transparan, dan tanpa rasa khawatir.
        </p>
      </div>

      {/* Visi Misi Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-gray-50 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Visi Kami</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Menjadi jaringan bengkel kendaraan paling terpercaya di Indonesia dengan standar pelayanan modern dan transparan.</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Tim Ahli</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Kami hanya mempekerjakan mekanik bersertifikat yang terus dilatih mengikuti perkembangan teknologi kendaraan terbaru.</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Garansi Nyata</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Setiap pekerjaan yang kami lakukan dilindungi garansi 30 hari. Kami bertanggung jawab penuh atas kualitas kerja kami.</p>
        </div>
      </div>

      {/* Image Section */}
      <div className="rounded-3xl overflow-hidden h-[400px] relative">
        <img 
          src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=2000&auto=format&fit=crop" 
          alt="Tim Mekanova" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="p-8 md:p-12 text-white max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="text-blue-400" />
              <span className="font-bold tracking-wider uppercase text-sm">Bengkel Modern</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Fasilitas Standar Pabrik</h2>
            <p className="text-gray-200">Kami menggunakan peralatan diagnostik terkomputerisasi dan oli/pelumas asli bersegel untuk memastikan kendaraanmu dalam kondisi terbaik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}