const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The goal: swap the layout, give the animation more space, remove scroll cutoff
// 1. Grid layout
content = content.replace(
  'grid xl:grid-cols-2 gap-16 items-center',
  'grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center'
);

// 2. Swapping the columns and adjusting the layout
// Text side:
content = content.replace(
  'className="space-y-8 order-2 lg:order-2 lg:pl-12"',
  'className="space-y-8 order-2 lg:order-2 lg:pl-8 xl:pl-12"'
);

// Animation side:
content = content.replace(
  'className="rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] w-full order-1 lg:order-1 overflow-x-auto"',
  'className="rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] w-full order-1 lg:order-1"'
);

// Remove the min-w wrapper so it naturally fits the wider column
content = content.replace('<div className="min-w-[650px] w-full">\\n', '');
content = content.replace('          </div>\\n</motion.div>', '</motion.div>');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Final fix applied successfully.');
