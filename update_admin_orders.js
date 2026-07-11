const fs = require('fs');
let content = fs.readFileSync('app/manage-store-secret/page.tsx', 'utf-8');

const orderItemsCode = `{(() => {
    try {
      const parsed = JSON.parse(order.items);
      return (
        <div>
          <p className="text-sm font-medium">{parsed.summary || order.items}</p>
          {parsed.list && parsed.list.length > 0 && (
             <ul className="text-xs text-gray-500 mt-2 space-y-1">
               {parsed.list.map((item: any, i: number) => (
                  <li key={i}>• {item.name} x {item.quantity} {item.isKain ? 'Meter' : 'Pcs'}</li>
               ))}
             </ul>
          )}
        </div>
      );
    } catch {
      return <p className="text-sm">{order.items}</p>;
    }
  })()}`;

content = content.replace(
  /\{\(\(\) => \{\n    try \{\n      const parsed = JSON\.parse\(order\.items\);\n      return <p className="text-sm">\{parsed\.summary \|\| order\.items\}<\/p>;\n    \} catch \{\n      return <p className="text-sm">\{order\.items\}<\/p>;\n    \}\n  \}\)\(\)\}/g,
  orderItemsCode
);

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

content = content.replace(
  /<select \n                  value=\{order\.status\}\n                  onChange=\{\(e\) => updateStatus\(order\.id, e\.target\.value\)\}\n                  className="border border-gray-200 text-sm py-1 px-2 focus:outline-none focus:border-black rounded-sm"\n                >\n                  <option value="Pending">Pending<\/option>\n                  <option value="Processing">Processing<\/option>\n                  <option value="Shipped">Shipped<\/option>\n                  <option value="Delivered">Delivered<\/option>\n                  <option value="Cancelled">Cancelled<\/option>\n                <\/select>/g,
  selectCode
);

fs.writeFileSync('app/manage-store-secret/page.tsx', content);
