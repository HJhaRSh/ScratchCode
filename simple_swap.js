const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const featStart = content.indexOf('      {/* Feature Highlights Section */}');
const visStart = content.indexOf('      {/* Code Visualizer Showcase Section */}');
const finalCta = content.indexOf('      {/* Final Call To Action */}');

if (featStart !== -1 && visStart !== -1 && finalCta !== -1) {
  let featSection = content.slice(featStart, visStart);
  let visSection = content.slice(visStart, finalCta);

  // Update numbering
  featSection = featSection.replace('[04] The Advantage', '[05] The Advantage');
  visSection = visSection.replace('[05] The Visualizer', '[04] The Visualizer');

  // Combine them with swapped order
  const newContent = content.slice(0, featStart) + visSection + featSection + content.slice(finalCta);
  fs.writeFileSync('src/app/page.tsx', newContent);
  console.log('Swap successful.');
} else {
  console.log('Tags not found!', { featStart, visStart, finalCta });
}
