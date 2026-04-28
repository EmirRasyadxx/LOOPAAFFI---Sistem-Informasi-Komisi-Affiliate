import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original_content = content

    # Direct String Replacements
    content = content.replace('DollarSign', 'Coins')
    content = content.replace('Sale Amount ($)', 'Jumlah Penjualan (IDR)')
    content = content.replace('"Total Sales ($)"', '"Total Penjualan (IDR)"')
    content = content.replace('"Total Commission ($)"', '"Total Komisi (IDR)"')
    content = content.replace('"Paid Commission ($)"', '"Komisi Dibayar (IDR)"')
    content = content.replace('"Pending Commission ($)"', '"Komisi Tertunda (IDR)"')

    # `$` inside string literals, e.g. `$${var.toLocaleString()}` -> `Rp ${formatIDR(var)}`
    # Python regex for `$${var.toLocaleString()}`:
    content = re.sub(r'\$\$\{([^}]+)\.toLocaleString\(\)\}', r'Rp ${formatIDR(\1)}', content)
    content = re.sub(r'\$\$\{([^}]+)\.toFixed\([0-9]+\)\}', r'Rp ${formatIDR(\1)}', content)
    content = re.sub(r'\$\$\{\(([^)]+)\)\.toFixed\([0-9]+\)\}', r'Rp ${formatIDR(\1)}', content)

    content = re.sub(r'>\$\{([^}]+)\.toLocaleString\(\)\}<', r'>Rp {formatIDR(\1)}<', content)
    content = re.sub(r'>\$\{([^}]+)\.toFixed\([0-9]+\)\}<', r'>Rp {formatIDR(\1)}<', content)

    # Some hardcoded ones: `<TableCell>${sale.amount.toFixed(2)}</TableCell>` 
    # Actually the generic >\$...< covers it.
    
    # Catch any remaining `$${...}`
    content = re.sub(r'\$\$\{([^}]+)\}', r'Rp ${formatIDR(\1)}', content)
    # Catch any remaining `>${...}<`
    content = re.sub(r'>\$\{([^}]+)\}<', r'>Rp {formatIDR(\1)}<', content)

    if content != original_content:
        if 'formatIDR' in content and 'import { formatIDR }' not in content:
            # Find last import
            last_import = content.rfind('import ')
            next_newline = content.find('\n', last_import)
            content = content[:next_newline+1] + 'import { formatIDR } from "@/lib/utils";\n' + content[next_newline+1:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
