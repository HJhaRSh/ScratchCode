const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add import
if (!content.includes('import CodeVisualizerMock from')) {
  content = content.replace(
    "import CodeTerminalHero from '@/components/ui/CodeTerminalHero';",
    "import CodeTerminalHero from '@/components/ui/CodeTerminalHero';\\nimport CodeVisualizerMock from '@/components/ui/CodeVisualizerMock';"
  );
}

// 2. Replace static Mock Visualizer UI with the new component
const mockStart = content.indexOf('{/* Mock visualizer UI */}');
const mockEnd = content.indexOf('{/* Feature pills */}');

if (mockStart !== -1 && mockEnd !== -1) {
  const staticMock = content.slice(mockStart, mockEnd);
  content = content.replace(staticMock, '{/* Mock visualizer UI */}\\n          <CodeVisualizerMock />\\n\\n          ');
  
  fs.writeFileSync('src/app/page.tsx', content);
  console.log('Successfully injected dynamic CodeVisualizerMock.');
} else {
  console.log('Could not find Mock visualizer UI section boundaries.', {mockStart, mockEnd});
}
