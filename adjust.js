const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Swap order
content = content.replace(
  'className="space-y-8 order-1 lg:order-1 lg:pr-12"',
  'className="space-y-8 order-2 lg:order-2 lg:pl-12"'
);

content = content.replace(
  'className="rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] w-full order-2 lg:order-2 overflow-x-auto"',
  'className="rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] w-full order-1 lg:order-1 overflow-x-auto"'
);

// 2. Make animation better and spaced
// Add a min-w wrapper to everything inside the motion.div to prevent squishing
const mockHeaderStart = content.indexOf('{/* Mock header bar */}');
const motionDivEnd = content.indexOf('</motion.div>', mockHeaderStart);

let innerMock = content.slice(mockHeaderStart, motionDivEnd);

// Increase code width to 50% for more space
innerMock = innerMock.replace('w-[45%]', 'w-[50%]');

// Add whitespace-nowrap to code lines
innerMock = innerMock.replace(
  'className={`flex-1 ${',
  'className={`flex-1 whitespace-nowrap ${'
);

// Add a min-w wrapper
innerMock = '<div className="min-w-[650px] w-full">\\n' + innerMock + '</div>\\n';

content = content.slice(0, mockHeaderStart) + innerMock + content.slice(motionDivEnd);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Successfully adjusted visualizer section.');
