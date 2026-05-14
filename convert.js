const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// basic tailwind to bootstrap mapping
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
  'gap-1': 'gap-1', 'gap-2': 'gap-2', 'gap-3': 'gap-2', 'gap-4': 'gap-3', 'gap-6': 'gap-4', 'gap-8': 'gap-4', 'gap-12': 'gap-5',
  'w-full': 'w-100', 'h-full': 'h-100', 'min-h-screen': 'vh-100',
  'hidden': 'd-none', 'block': 'd-block', 'inline-block': 'd-inline-block',

  // Spacing (approximate mapping)
  'p-1': 'p-1', 'p-2': 'p-1', 'p-3': 'p-2', 'p-4': 'p-3', 'p-6': 'p-4', 'p-8': 'p-4', 'p-12': 'p-5', 'p-16': 'p-5',
  'px-1': 'px-1', 'px-2': 'px-1', 'px-3': 'px-2', 'px-4': 'px-3', 'px-6': 'px-4', 'px-8': 'px-4', 'px-12': 'px-5', 'px-20': 'px-5', 'px-24': 'px-5', 'px-40': 'px-5',
  'py-1': 'py-1', 'py-2': 'py-1', 'py-3': 'py-2', 'py-4': 'py-3', 'py-6': 'py-4', 'py-8': 'py-4', 'py-12': 'py-5', 'py-16': 'py-5', 'py-20': 'py-5', 'py-24': 'py-5',
  'm-auto': 'm-auto', 'mx-auto': 'mx-auto', 'my-auto': 'my-auto',
  'mt-1': 'mt-1', 'mt-2': 'mt-1', 'mt-3': 'mt-2', 'mt-4': 'mt-3', 'mt-6': 'mt-4', 'mt-8': 'mt-4', 'mt-10': 'mt-5', 'mt-12': 'mt-5',
  'mb-1': 'mb-1', 'mb-2': 'mb-1', 'mb-3': 'mb-2', 'mb-4': 'mb-3', 'mb-6': 'mb-4', 'mb-8': 'mb-4', 'mb-10': 'mb-5', 'mb-12': 'mb-5',

  // Typography
  'text-center': 'text-center', 'text-left': 'text-start', 'text-right': 'text-end',
  'font-bold': 'fw-bold', 'font-semibold': 'fw-bold', 'font-black': 'fw-bolder', 'font-medium': 'fw-medium',
  'text-xs': 'fs-6 text-muted', 'text-sm': 'fs-6', 'text-base': 'fs-6', 'text-lg': 'fs-5', 'text-xl': 'fs-4', 'text-2xl': 'fs-3', 'text-3xl': 'fs-2', 'text-4xl': 'fs-1', 'text-5xl': 'display-4', 'text-6xl': 'display-3',
  'uppercase': 'text-uppercase', 'capitalize': 'text-capitalize',
  
  // Colors
  'text-white': 'text-white', 'text-black': 'text-black',
  'text-primary': 'text-primary', 'bg-primary': 'bg-primary',
  'bg-white': 'bg-white', 'bg-transparent': 'bg-transparent',
  'text-slate-50': 'text-light', 'text-slate-100': 'text-light', 'text-slate-200': 'text-light', 'text-slate-300': 'text-light', 'text-slate-400': 'text-secondary', 'text-slate-500': 'text-secondary', 'text-slate-600': 'text-secondary', 'text-slate-700': 'text-dark', 'text-slate-800': 'text-dark', 'text-slate-900': 'text-dark',
  'bg-slate-50': 'bg-light', 'bg-slate-100': 'bg-light', 'bg-slate-200': 'bg-light', 'bg-slate-800': 'bg-dark', 'bg-slate-900': 'bg-dark',

  // Borders
  'border': 'border', 'border-t': 'border-top', 'border-b': 'border-bottom', 'border-l': 'border-start', 'border-r': 'border-end',
  'rounded': 'rounded', 'rounded-md': 'rounded-2', 'rounded-lg': 'rounded-3', 'rounded-xl': 'rounded-4', 'rounded-2xl': 'rounded-5', 'rounded-full': 'rounded-circle',

  // Position
  'relative': 'position-relative', 'absolute': 'position-absolute', 'fixed': 'position-fixed', 'sticky': 'position-sticky',
  'top-0': 'top-0', 'bottom-0': 'bottom-0', 'left-0': 'start-0', 'right-0': 'end-0',
  'inset-0': 'top-0 bottom-0 start-0 end-0',
  'z-10': 'z-1', 'z-20': 'z-2', 'z-30': 'z-3', 'z-40': 'z-max', 'z-50': 'z-max', // rough mapping

  // Others
  'overflow-hidden': 'overflow-hidden', 'overflow-y-auto': 'overflow-y-auto', 'overflow-x-hidden': 'overflow-x-hidden',
  'shadow-sm': 'shadow-sm', 'shadow': 'shadow', 'shadow-md': 'shadow', 'shadow-lg': 'shadow-lg',
  'transition-all': 'transition', 'transition-colors': 'transition',
};

// Also handle dynamic classes via regex:
// lg:flex -> d-lg-flex
// md:w-1/2 -> w-md-50
// hover:text-primary -> can use some custom CSS or ignore for now if purely utilities.

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace ClassNames using regex match
  content = content.replace(/className=(["`'])(.*?)\1/g, (match, quote, classList) => {
    // skip dynamic class logic wrapped in expressions unless it's just pure string manipulation
    let classes = classList.split(/\s+/);
    let newClasses = classes.map(cls => {
      // Direct map
      if (classMap[cls]) return classMap[cls];

      // Handle breakpoints
      const bpMatch = cls.match(/^(sm|md|lg|xl|2xl):(.+)$/);
      if (bpMatch) {
         let bp = bpMatch[1] === 'sm' ? 'sm' : bpMatch[1] === 'md' ? 'md' : bpMatch[1] === 'lg' ? 'lg' : bpMatch[1] === 'xl' ? 'xl' : 'xxl';
         let innerCls = bpMatch[2];
         if (classMap[innerCls]) {
             let bsClass = classMap[innerCls];
             // inject breakpoint e.g. d-flex -> d-lg-flex
             if (bsClass.startsWith('d-')) return bsClass.replace('d-', `d-${bp}-`);
             if (bsClass.match(/^[a-z]+-\d+$/)) {
                 let parts = bsClass.split('-');
                 if (parts.length === 2) return `${parts[0]}-${bp}-${parts[1]}`;
             }
             if (bsClass.startsWith('text-')) return bsClass.replace('text-', `text-${bp}-`);
         }
      }

      // Keep unmapped tailwind classes just in case, or maybe map grid
      if (cls === 'grid') return 'row'; // crude grid mapping
      if (cls.startsWith('grid-cols-')) return `row-cols-${cls.split('-')[2]}`;
      if (cls.startsWith('col-span-')) return `col-${cls.split('-')[2]}`;
      
      return cls;
    });

    // Remove duplicates
    newClasses = [...new Set(newClasses)];
    return `className=${quote}${newClasses.join(' ')}${quote}`;
  });

  // 2. Replace components if possible (e.g. inject React Bootstrap import)
  // Let's import Container, Row, Col natively instead of manually writing them if requested
  // I'll skip auto-injecting Form, Card, Nav via script and do those specifically by hand for perfection,
  // or use the script to convert standard button mapping.

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
console.log("Done.");
