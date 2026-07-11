const fs = require('fs');
let content = fs.readFileSync('app/api/checkout/simulate-payment/route.ts', 'utf-8');
content = content.replace('(p) =>', '(p: any) =>');
fs.writeFileSync('app/api/checkout/simulate-payment/route.ts', content);
