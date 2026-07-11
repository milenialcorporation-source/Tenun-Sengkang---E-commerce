const fs = require('fs');
let content = fs.readFileSync('app/account/page.tsx', 'utf-8');

content = content.replace(
  "<p className=\"text-sm\">{order.items}</p>",
  `{(() => {
    try {
      const parsed = JSON.parse(order.items);
      return <p className="text-sm">{parsed.summary || order.items}</p>;
    } catch {
      return <p className="text-sm">{order.items}</p>;
    }
  })()}`
);

fs.writeFileSync('app/account/page.tsx', content);
