const fs = require('fs');

const origContent = fs.readFileSync('original_page.tsx', 'utf8');
let currentContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// Find original Visualizer section
const origStart = origContent.indexOf('      {/* Code Visualizer Showcase Section */}');
const origEnd = origContent.indexOf('      {/* Final Call To Action */}');
let origVisSection = origContent.slice(origStart, origEnd);

// Update numbering in the extracted section
origVisSection = origVisSection.replace('[05] The Visualizer', '[04] The Visualizer');

// Find current Visualizer section
const currStart = currentContent.indexOf('      {/* Code Visualizer Showcase Section */}');
const currEnd = currentContent.indexOf('      {/* Feature Highlights Section */}');

// Replace the current visualizer section with the original one
const newContent = currentContent.slice(0, currStart) + origVisSection + '\\n' + currentContent.slice(currEnd);

fs.writeFileSync('src/app/page.tsx', newContent);
console.log('Successfully reverted Visualizer section.');
