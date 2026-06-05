const fs = require('fs');
let js = fs.readFileSync('generate_python_track.js', 'utf8');

// We can just use a simple state machine or careful regex to replace `exercise_description: "...",` 
// Wait, actually I will just write a small Node AST rewriter or just a simple regex
// `exercise_description: ((".*?")|('.*?')),` handles the quotes properly without breaking JS.
// But some of them have newlines or escaped quotes.
// Since the structure is quite simple, let me replace it using a better regex:
js = js.replace(/exercise_description:\s*(?:(["'])(?:(?=(\\?))\2.)*?\1)(?:\s*,)?/g, '');

fs.writeFileSync('generate_python_track.js', js);
