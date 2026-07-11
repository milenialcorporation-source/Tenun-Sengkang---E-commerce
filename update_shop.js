const fs = require('fs');
let content = fs.readFileSync('app/shop/page.tsx', 'utf-8');

const replacement = `<span className="font-semibold text-accent text-sm sm:text-base mt-0.5 w-full flex flex-wrap items-center">
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                      <span className="text-[10px] sm:text-xs text-gray-400 ml-1 font-normal lowercase flex-shrink-0">
                        / {product.uom?.replace(/per /i, '') || 'pcs'}
                      </span>
                    </span>
                    {product.stock !== undefined && (
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Stock: {product.stock} {product.productType === 'kain' ? 'm' : 'pcs'}
                      </span>
                    )}`;

content = content.replace(
  /<span className="font-semibold text-accent text-sm sm:text-base mt-0.5 w-full flex flex-wrap items-center">\n                      Rp \{Number\(product\.price \|\| 0\)\.toLocaleString\('id-ID'\)\}\n                      <span className="text-\[10px\] sm:text-xs text-gray-400 ml-1 font-normal lowercase flex-shrink-0">\n                        \/ \{product\.uom\?\.replace\(\/per \/i, ''\) \|\| 'pcs'\}\n                      <\/span>\n                    <\/span>/g,
  replacement
);

fs.writeFileSync('app/shop/page.tsx', content);
