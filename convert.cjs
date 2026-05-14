const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const classMap = {
  // Layout & Flex
  'flex': 'd-flex',
  'flex-col': 'flex-column',
  'flex-row': 'flex-row',
  'items-center': 'align-items-center',
  'items-start': 'align-items-start',
  'items-end': 'align-items-end',
  'justify-center': 'justify-content-center',
  'justify-between': 'justify-content-between',
  'justify-start': 'justify-content-start',
  'justify-end': 'justify-content-end',
  'gap-1': 'gap-1', 'gap-2': 'gap-2', 'gap-3': 'gap-3', 'gap-4': 'gap-3', 'gap-6': 'gap-4', 'gap-8': 'gap-4', 'gap-12': 'gap-5',
  'w-full': 'w-100', 'h-full': 'h-100', 'min-h-screen': 'vh-100', 'h-screen': 'vh-100',
  'hidden': 'd-none', 'block': 'd-block', 'inline-block': 'd-inline-block',

  // Spacing (approximate mapping)
  'p-1': 'p-1', 'p-2': 'p-1', 'p-3': 'p-2', 'p-4': 'p-3', 'p-6': 'p-4', 'p-8': 'p-4', 'p-12': 'p-5', 'p-16': 'p-5',
  'px-1': 'px-1', 'px-2': 'px-1', 'px-3': 'px-2', 'px-4': 'px-3', 'px-6': 'px-4', 'px-8': 'px-4', 'px-12': 'px-5', 'px-20': 'px-5', 'px-24': 'px-5', 'px-40': 'px-5',
  'py-1': 'py-1', 'py-2': 'py-1', 'py-3': 'py-2', 'py-4': 'py-3', 'py-6': 'py-4', 'py-8': 'py-4', 'py-12': 'py-5', 'py-16': 'py-5', 'py-20': 'py-5', 'py-24': 'py-5',
  'm-auto': 'm-auto', 'mx-auto': 'mx-auto', 'my-auto': 'my-auto',
  'mt-1': 'mt-1', 'mt-2': 'mt-1', 'mt-3': 'mt-2', 'mt-4': 'mt-3', 'mt-6': 'mt-4', 'mt-8': 'mt-4', 'mt-10': 'mt-5', 'mt-12': 'mt-5', 'mt-auto': 'mt-auto',
  'mb-1': 'mb-1', 'mb-2': 'mb-1', 'mb-3': 'mb-2', 'mb-4': 'mb-3', 'mb-5': 'mb-4', 'mb-6': 'mb-4', 'mb-8': 'mb-4', 'mb-10': 'mb-5', 'mb-12': 'mb-5',
  'ml-1': 'ms-1', 'ml-3': 'ms-2',
  'mr-1': 'me-1', 'mr-3': 'me-2',

  // Typography
  'text-center': 'text-center', 'text-left': 'text-start', 'text-right': 'text-end',
  'font-bold': 'fw-bold', 'font-semibold': 'fw-bold', 'font-black': 'fw-bolder', 'font-medium': 'fw-medium',
  'text-xs': 'fs-6 text-muted', 'text-sm': 'fs-6', 'text-base': 'fs-6', 'text-lg': 'fs-5', 'text-xl': 'fs-4', 'text-2xl': 'fs-3', 'text-3xl': 'fs-2', 'text-4xl': 'fs-1', 'text-5xl': 'display-4', 'text-6xl': 'display-3',
  'uppercase': 'text-uppercase', 'capitalize': 'text-capitalize', 'tracking-tight': 'tracking-tight', 'tracking-wider': 'tracking-wider', 'tracking-widest': 'tracking-widest',
  'leading-tight': 'lh-sm', 'leading-relaxed': 'lh-lg',
  
  // Colors
  'text-white': 'text-white', 'text-black': 'text-black',
  'text-primary': 'text-primary', 'bg-primary': 'bg-primary',
  'bg-white': 'bg-white', 'bg-transparent': 'bg-transparent',
  'text-slate-50': 'text-light', 'text-slate-100': 'text-light', 'text-slate-200': 'text-light', 'text-slate-300': 'text-light', 'text-slate-400': 'text-secondary', 'text-slate-500': 'text-secondary', 'text-slate-600': 'text-secondary', 'text-slate-700': 'text-dark', 'text-slate-800': 'text-dark', 'text-slate-900': 'text-dark',
  'bg-slate-50': 'bg-light', 'bg-slate-100': 'bg-light', 'bg-slate-200': 'bg-light', 'bg-slate-800': 'bg-dark', 'bg-slate-900': 'bg-dark',

  // Borders
  'border': 'border border-light-subtle', 'border-t': 'border-top border-light-subtle', 'border-b': 'border-bottom border-light-subtle', 'border-l': 'border-start border-light-subtle', 'border-r': 'border-end border-light-subtle',
  'rounded': 'rounded', 'rounded-md': 'rounded-2', 'rounded-lg': 'rounded-3', 'rounded-xl': 'rounded-4', 'rounded-2xl': 'rounded-5', 'rounded-full': 'rounded-circle',

  // Position
  'relative': 'position-relative', 'absolute': 'position-absolute', 'fixed': 'position-fixed', 'sticky': 'sticky-top',
  'top-0': 'top-0', 'bottom-0': 'bottom-0', 'left-0': 'start-0', 'right-0': 'end-0',
  'top-1/2': 'top-50', '-translate-y-1/2': 'translate-middle-y',
  'inset-0': 'top-0 bottom-0 start-0 end-0',
  'z-10': 'z-1', 'z-20': 'z-2', 'z-30': 'z-3', 'z-40': 'z-3', 'z-50': 'z-3',

  // Others
  'overflow-hidden': 'overflow-hidden', 'overflow-y-auto': 'overflow-y-auto', 'overflow-x-hidden': 'overflow-x-hidden',
  'shadow-sm': 'shadow-sm', 'shadow': 'shadow', 'shadow-md': 'shadow', 'shadow-lg': 'shadow-lg',
  'transition-all': 'transition', 'transition-colors': 'transition', 'group': '', 'block': 'd-block',
  'max-w-md': 'max-w-md', 'flex-1': 'flex-grow-1', 'truncate': 'text-truncate'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Process className="..." or className={'...'} or className={`...`}
  // Instead of a perfect parser, regex works if we just target any word character sequences inside classNames
  
  content = content.replace(/className=(["'`])([\s\S]*?)\1|className=\{`([\s\S]*?)`\}/g, (match, q1, clList1, clList2) => {
    let quote = q1 || '`';
    let classList = clList1 !== undefined ? clList1 : clList2;
    
    // Split by spaces, including ignoring template vars like ${...} for now
    let parts = classList.split(/(\s+)/);
    for (let i = 0; i < parts.length; i++) {
        let cls = parts[i].trim();
        if (!cls || cls.includes('${') || cls.includes('}')) continue; // Skip template literals logic inside the str
        
        // Match base classes
        if (classMap[cls]) {
            parts[i] = classMap[cls];
            continue;
        }

        // Match breakpoints e.g. md:flex
        const bpMatch = cls.match(/^(sm|md|lg|xl|2xl):(.+)$/);
        if (bpMatch) {
            let bp = bpMatch[1] === 'sm' ? 'sm' : bpMatch[1] === 'md' ? 'md' : bpMatch[1] === 'lg' ? 'lg' : bpMatch[1] === 'xl' ? 'xl' : 'xxl';
            let innerCls = bpMatch[2];
            
            if (classMap[innerCls]) {
                let bsClass = classMap[innerCls];
                if (bsClass.startsWith('d-')) {
                    parts[i] = bsClass.replace('d-', `d-${bp}-`);
                } else if (bsClass.match(/^[a-z]+-\d+$/)) {
                    let cParts = bsClass.split('-');
                    if (cParts.length === 2 && !cParts[0].startsWith('fs') && !cParts[0].startsWith('z')) {
                        parts[i] = `${cParts[0]}-${bp}-${cParts[1]}`;
                    } else {
                        parts[i] = cls;
                    }
                } else if (bsClass.startsWith('text-')) {
                    // BS text breakpoints only exist for text-align (text-md-center)
                    if (bsClass.includes('center') || bsClass.includes('start') || bsClass.includes('end')) {
                        parts[i] = bsClass.replace('text-', `text-${bp}-`);
                    } else {
                        parts[i] = cls; // Skip, e.g. text-md-white doesn't exist
                    }
                } else if (bsClass.startsWith('w-')) {
                    parts[i] = bsClass.replace('w-', `w-${bp}-`);
                } else {
                    parts[i] = bsClass; // fallback to the non-breakpoint class
                }
                continue;
            }
            if (innerCls === 'w-1/2') parts[i] = `w-${bp}-50`;
            if (innerCls.startsWith('grid-cols-')) parts[i] = `row-cols-${bp}-${innerCls.split('-')[2]}`;
        }
        
        // Grid mapping
        if (cls === 'grid') parts[i] = 'row';
        if (cls.startsWith('grid-cols-')) parts[i] = `row-cols-${cls.split('-')[2]}`;
        if (cls.startsWith('col-span-')) parts[i] = `col-${cls.split('-')[2]}`;
        if (cls === 'w-1/2') parts[i] = 'w-50';
        if (cls === 'w-1/3') parts[i] = 'w-33'; // close enough
        
        // Important handling
        if (cls.startsWith('!')) {
            let noBang = cls.slice(1);
            if (classMap[noBang]) {
                parts[i] = classMap[noBang] + ' !important';
            }
        }
        
        // Hover handling
        if (cls.startsWith('hover:')) {
            let inner = cls.substring(6);
            if (inner === 'bg-primary/5') parts[i] = 'hover:bg-light';
            if (inner === 'text-primary') parts[i] = 'hover:text-primary';
        }
        // Dark handling
        if (cls.startsWith('dark:')) {
            parts[i] = ''; // Drop dark mode specific colors in bootstrap, rely on theming or just default
        }
    }
    
    // Filter empty
    let newClassList = parts.filter(p => !p.startsWith('dark:')).join('');
    // Remove multiple spaces manually if needed
    
    if (q1) {
        return `className=${quote}${newClassList}${quote}`;
    } else {
        return `className={\`${newClassList}\`}`;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir(srcDir);
console.log("Done converting utility classes.");
