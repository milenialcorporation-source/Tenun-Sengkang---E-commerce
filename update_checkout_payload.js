const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf-8');

content = content.replace(
  "                      items: itemName,",
  "                      items: JSON.stringify({ summary: itemName, list: checkoutItems }),"
);

fs.writeFileSync('app/checkout/page.tsx', content);
