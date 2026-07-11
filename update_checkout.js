const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf-8');

const replacement = `  let checkoutItems: any[] = [];
  if (product) {
    checkoutItems = [{ ...product, quantity: qtyNum }];
  } else if (cartItems.length > 0) {
    checkoutItems = cartItems;
  }

  const itemPrice = checkoutItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const itemName = checkoutItems.map(item => \`\${item.name} (\${item.quantity}\${item.productType === 'kain' ? 'm' : 'x'})\`).join(', ') || 'Produk';
`;

content = content.replace(
  "  // Fallback to a default if no product is selected (for direct visits)\n  const itemName = product ? `${product.name} (${qtyNum}${product.productType === 'kain' ? 'm' : 'x'})` : 'Produk (1x)';\n  const itemPrice = product ? Number(product.price || 0) * qtyNum : 1500000;",
  replacement
);

fs.writeFileSync('app/checkout/page.tsx', content);
