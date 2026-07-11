const fs = require('fs');
let content = fs.readFileSync('app/account/page.tsx', 'utf-8');

const statusBadgeCode = `{(() => {
                              switch (order.status) {
                                case 'Pending': return <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Belum Bayar</span>;
                                case 'Paid': return <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Menunggu Pengiriman</span>;
                                case 'Processing': return <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Diproses</span>;
                                case 'Shipped': return <span className="inline-block bg-purple-100 text-purple-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Dikirim</span>;
                                case 'Delivered': return <span className="inline-block bg-green-100 text-green-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Selesai</span>;
                                case 'Cancelled': return <span className="inline-block bg-red-100 text-red-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Dibatalkan</span>;
                                default: return <span className="inline-block bg-gray-100 text-gray-800 text-[10px] px-2 py-1 uppercase tracking-widest font-bold">{order.status}</span>;
                              }
                            })()}`;

content = content.replace(
  /<span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 uppercase tracking-widest font-semibold">\{order\.status\}<\/span>/g,
  statusBadgeCode
);

fs.writeFileSync('app/account/page.tsx', content);
