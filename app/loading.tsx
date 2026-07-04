import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 z-[100] flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">Memuat Halaman...</p>
      </div>
    </div>
  );
}
