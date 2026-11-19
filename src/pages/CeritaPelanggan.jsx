import { Star } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Raka Aditya', vehicle: 'Pemilik Honda Vario 160', initial: 'RA', review: '"Booking-nya gampang dan estimasi biayanya jelas dari awal. Motorku selesai tepat waktu."' },
  { id: 2, name: 'Sinta Putri', vehicle: 'Pemilik Toyota Yaris', initial: 'SP', review: '"Teknisinya menjelaskan kondisi AC dengan detail tanpa bikin bingung. Hasilnya juga memuaskan."' },
  { id: 3, name: 'Dimas Firmansyah', vehicle: 'Pemilik Yamaha NMAX', initial: 'DF', review: '"Pelayanan ramah, tempatnya bersih, dan garansi servisnya bikin makin yakin. Pasti kembali."' },
  { id: 4, name: 'Budi Santoso', vehicle: 'Pemilik Honda Beat', initial: 'BS', review: '"Harga sangat transparan, tidak ada biaya siluman. Proses servis juga cepat."' },
  { id: 5, name: 'Ayu Lestari', vehicle: 'Pemilik Suzuki Ertiga', initial: 'AL', review: '"Fasilitas ruang tunggunya nyaman, ada WiFi dan kopi gratis. Mantap!"' },
  { id: 6, name: 'Rizky Pratama', vehicle: 'Pemilik Yamaha Aerox', initial: 'RP', review: '"Mekaniknya ramah dan menjelaskan apa saja yang rusak. Sangat direkomendasikan."' },
];

export default function CeritaPelanggan() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Cerita Pelanggan</span>
        <h1 className="text-4xl font-bold mt-4 mb-4">Dipercaya ribuan pelanggan</h1>
        <p className="text-gray-600">Pengalaman servis yang bikin perjalanan terasa lebih tenang.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} className="fill-yellow-400" />)}
            </div>
            <p className="text-gray-700 italic mb-6">{t.review}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {t.initial}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.vehicle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}