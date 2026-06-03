const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const featStart = content.indexOf('      {/* Feature Highlights Section */}');
const featEnd = content.indexOf('      {/* Code Visualizer Showcase Section */}');
const visEnd = content.indexOf('      {/* Final Call To Action */}');

if (featStart !== -1 && featEnd !== -1 && visEnd !== -1) {
  let featSection = content.slice(featStart, featEnd);
  let visSection = content.slice(featEnd, visEnd);
  
  // 1. Refactor Feature Highlights Section (Text left, cards right)
  featSection = featSection.replace('order-2 lg:order-1', 'order-2 lg:order-2');
  featSection = featSection.replace('order-1 lg:order-2 lg:pl-12', 'order-1 lg:order-1 lg:pr-12');
  // Update numbering since it will be section 5 now
  featSection = featSection.replace('[04] The Advantage', '[05] The Advantage');
  
  // 2. Refactor Visualizer Section (Text left, Mock UI right)
  // First, change color to emerald
  visSection = visSection.replace(/\bviolet\b/g, 'emerald');
  visSection = visSection.replace('[05] The Visualizer', '[04] The Visualizer');
  
  // Replace the container to be a grid
  visSection = visSection.replace(
    '<div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">',
    '<div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 grid xl:grid-cols-2 gap-16 items-center">'
  );
  
  // Re-structure header and mock UI
  const headerStart = visSection.indexOf('          {/* Header */}');
  const mockStart = visSection.indexOf('          {/* Mock visualizer UI */}');
  const mockEnd = visSection.indexOf('          {/* Feature pills */}');
  const pillsEnd = visSection.lastIndexOf('        </div>\\n      </motion.section>');

  const newHeader = `          {/* Left Column - Text */}
          <div className="space-y-8 order-1 lg:order-1 lg:pr-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
              [04] The Visualizer
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              See your code{' '}<br/>
              <span className="font-script text-emerald-400 font-normal italic pr-2">come alive.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our built-in Code Visualizer lets you step through every line of your Python code, watch variables change in real time, and understand memory — all inside the browser.
            </p>
          </div>
`;
  
  let mockUiStr = visSection.slice(mockStart, mockEnd);
  // Add order classes to mock UI
  mockUiStr = mockUiStr.replace(
    'max-w-5xl mx-auto"',
    'w-full order-2 lg:order-2 overflow-x-auto"'
  );

  // Combine
  let newVisSection = visSection.slice(0, headerStart) + newHeader + '\\n' + mockUiStr + '\\n        </div>\\n      </motion.section>\\n';
  
  // 3. Update Final CTA numbering
  let endSection = content.slice(visEnd);
  endSection = endSection.replace('[05] Start Your Journey', '[06] Start Your Journey');
  
  // 4. Swap and combine
  const newContent = content.slice(0, featStart) + newVisSection + '\\n' + featSection + endSection;
  
  fs.writeFileSync('src/app/page.tsx', newContent);
  console.log('Success');
} else {
  console.log('Tags not found');
}
