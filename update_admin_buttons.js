const fs = require('fs');
let content = fs.readFileSync('app/manage-store-secret/page.tsx', 'utf-8');

const selectCode = `<select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-gray-200 text-sm py-1 px-2 focus:outline-none focus:border-black rounded-sm"
                >
                  <option value="Pending">Pending / Belum Bayar</option>
                  <option value="Paid">Paid / Perlu Dikirim</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped / Dikirim</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>`;

const buttonsCode = `
                <div className="flex flex-wrap items-center gap-2 w-full mt-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 mr-4 min-w-[120px]">
                    Status: <span className="text-black font-bold">{order.status}</span>
                  </span>
                  
                  {order.status !== 'Shipped' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Shipped')}
                      className="px-3 py-1.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Kirim Pesanan
                    </button>
                  )}
                  {order.status === 'Shipped' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Delivered')}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-green-700 transition-colors"
                    >
                      Selesaikan
                    </button>
                  )}
                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Cancelled')}
                      className="px-3 py-1.5 border border-red-200 text-red-600 text-xs uppercase tracking-widest font-semibold hover:bg-red-50 transition-colors"
                    >
                      Batalkan
                    </button>
                  )}
                </div>
`;

content = content.replace(
  /<label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Status:<\/label>\n                <select \n                  value=\{order\.status\}\n                  onChange=\{\(e\) => updateStatus\(order\.id, e\.target\.value\)\}\n                  className="border border-gray-200 text-sm py-1 px-2 focus:outline-none focus:border-black rounded-sm"\n                >\n                  <option value="Pending">Pending \/ Belum Bayar<\/option>\n                  <option value="Paid">Paid \/ Perlu Dikirim<\/option>\n                  <option value="Processing">Processing<\/option>\n                  <option value="Shipped">Shipped \/ Dikirim<\/option>\n                  <option value="Delivered">Delivered<\/option>\n                  <option value="Cancelled">Cancelled<\/option>\n                <\/select>/g,
  buttonsCode
);

fs.writeFileSync('app/manage-store-secret/page.tsx', content);
