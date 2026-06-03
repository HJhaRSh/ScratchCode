const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The visualizer section is currently bg-black. I need to make it bg-[#111111].
// The feature highlights section is currently bg-[#111111]. I need to make it bg-black.

const visStart = content.indexOf('{/* Code Visualizer Showcase Section */}');
const featStart = content.indexOf('{/* Feature Highlights Section */}');
const finalStart = content.indexOf('{/* Final Call To Action */}');

if (visStart !== -1 && featStart !== -1 && finalStart !== -1) {
  let visSection = content.slice(visStart, featStart);
  let featSection = content.slice(featStart, finalStart);
  
  visSection = visSection.replace('bg-black', 'bg-[#111111]');
  featSection = featSection.replace('bg-[#111111]', 'bg-black');
  
  const newContent = content.slice(0, visStart) + visSection + featSection + content.slice(finalStart);
  fs.writeFileSync('src/app/page.tsx', newContent);
  console.log('Successfully swapped theme colors to maintain alternating pattern.');
} else {
  console.log('Could not find sections.');
}
