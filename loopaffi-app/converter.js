const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
                filelist.push(filepath);
            }
        }
    });
    return filelist;
};

const files = walkSync('src');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Direct String Replacements
    content = content.replace(/DollarSign/g, 'Coins');
    content = content.replace(/Sale Amount \(\$\)/g, 'Jumlah Penjualan (IDR)');
    content = content.replace(/"Total Sales \(\$\)"/g, '"Total Penjualan (IDR)"');
    content = content.replace(/"Total Commission \(\$\)"/g, '"Total Komisi (IDR)"');
    content = content.replace(/"Paid Commission \(\$\)"/g, '"Komisi Dibayar (IDR)"');
    content = content.replace(/"Pending Commission \(\$\)"/g, '"Komisi Tertunda (IDR)"');

    // Replace $${...} with Rp ${formatIDR(...)}
    // Examples: 
    // `$${totalSalesAmount.toLocaleString()}` -> `Rp ${formatIDR(totalSalesAmount)}`
    // `$${sale.amount.toFixed(2)}` -> `Rp ${formatIDR(sale.amount)}`
    
    // Pattern 1: $${var.toLocaleString()}
    content = content.replace(/\$\$\{([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)\.toLocaleString\(\)\}/g, "Rp ${formatIDR($1)}");
    // Pattern 2: $${var.toFixed(2)}
    content = content.replace(/\$\$\{([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)\.toFixed\([0-9]+\)\}/g, "Rp ${formatIDR($1)}");
    // Pattern 3: $${(expression).toFixed(2)}
    content = content.replace(/\$\$\{\(([^)]+)\)\.toFixed\([0-9]+\)\}/g, "Rp ${formatIDR($1)}");
    // Pattern 4: $${(expression).toLocaleString()}
    content = content.replace(/\$\$\{\(([^)]+)\)\.toLocaleString\(\)\}/g, "Rp ${formatIDR($1)}");

    // Replace <TableCell>${sale.amount.toFixed(2)}</TableCell>
    content = content.replace(/>\$\{([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)\.toFixed\([0-9]+\)\}</g, ">Rp ${formatIDR($1)}<");
    content = content.replace(/>\$\{([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)\.toLocaleString\(\)\}</g, ">Rp ${formatIDR($1)}<");

    // Literal replacements for the dashboard pages with static $ chars
    content = content.replace(/\$\$\{([^}]+)\}/g, "Rp ${formatIDR($1)}");
    
    // Special cases for strings without variables but pure TSX, e.g.
    // >${sale.amount.toFixed(2)}< -> >{formatIDR(sale.amount)}< if not inside string literal
    content = content.replace(/>\$\{([^}]+)\}</g, ">Rp {formatIDR($1)}<");

    if (content !== originalContent) {
        if (!content.includes('formatIDR') && content.includes('Rp ')) {
            // we won't need to import if we just replace it perfectly, wait we do need to import it.
        }
        if (content.includes('formatIDR') && !content.includes('import { formatIDR }')) {
            // Find a suitable place for import
            const lastImportIndex = content.lastIndexOf('import ');
            const nextNewline = content.indexOf('\n', lastImportIndex);
            
            content = content.slice(0, nextNewline + 1) + 'import { formatIDR } from "@/lib/utils";\n' + content.slice(nextNewline + 1);
        }

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
