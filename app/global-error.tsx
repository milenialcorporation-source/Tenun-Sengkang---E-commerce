'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isNetworkError = error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch');

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center text-gray-900">
          <h2 className="text-3xl font-bold mb-4">
            {isNetworkError ? "Koneksi Terputus" : "A critical error occurred!"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {isNetworkError 
              ? "Kami tidak dapat memuat halaman ini. Hal ini biasanya terjadi jika koneksi internet tidak stabil, atau jaringan Wi-Fi Anda (seperti Wi-Fi kampus/kantor) memblokir akses ke situs ini." 
              : "Terjadi kesalahan sistem saat memuat halaman."}
          </p>
          
          <pre className="text-left bg-white p-4 rounded border border-gray-200 overflow-auto max-w-4xl text-xs mb-8 text-gray-400">
            {error.message}
          </pre>

          <button
            className="px-8 py-3 bg-black text-white uppercase tracking-widest text-sm font-semibold rounded hover:bg-gray-800 transition-colors"
            onClick={() => {
              if (isNetworkError) {
                window.location.reload();
              } else {
                reset();
              }
            }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
