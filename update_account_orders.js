const fs = require('fs');
let content = fs.readFileSync('app/account/page.tsx', 'utf-8');

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

fs.writeFileSync('app/account/page.tsx', content);
