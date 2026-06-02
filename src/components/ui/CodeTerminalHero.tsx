'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const snippets = [
  {
    lang: 'index.js',
    code: `function greet() {\n  return "Hello World!";\n}\n\nconsole.log(greet());`,
    output: `> Hello World!`
  },
  {
    lang: 'main.py',
    code: `def calculate_sum(a, b):\n    return a + b\n\nprint(calculate_sum(5, 7))`,
    output: `> 12`
  },
  {
    lang: 'app.go',
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Go Runtime")\n}`,
    output: `> Go Runtime`
  }
];

// Simple syntax highlighter
function highlightSyntax(text: string) {
  let highlighted = text;
  // Keywords
  highlighted = highlighted.replace(/function/g, '<span class="text-pink-500">function</span>');
  highlighted = highlighted.replace(/return/g, '<span class="text-pink-500">return</span>');
  highlighted = highlighted.replace(/def /g, '<span class="text-pink-500">def </span>');
  highlighted = highlighted.replace(/package /g, '<span class="text-pink-500">package </span>');
  highlighted = highlighted.replace(/import /g, '<span class="text-pink-500">import </span>');
  highlighted = highlighted.replace(/func /g, '<span class="text-pink-500">func </span>');
  
  // Built-ins
  highlighted = highlighted.replace(/console\.log/g, '<span class="text-cyan-400">console.log</span>');
  highlighted = highlighted.replace(/print/g, '<span class="text-cyan-400">print</span>');
  highlighted = highlighted.replace(/fmt\.Println/g, '<span class="text-cyan-400">fmt.Println</span>');
  
  // Strings
  highlighted = highlighted.replace(/("Hello World!")/g, '<span class="text-yellow-200">$1</span>');
  highlighted = highlighted.replace(/("fmt")/g, '<span class="text-yellow-200">$1</span>');
  highlighted = highlighted.replace(/("Go Runtime")/g, '<span class="text-yellow-200">$1</span>');
  
  return highlighted;
}

export default function CodeTerminalHero() {
  const [currentSnippetIdx, setCurrentSnippetIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    setShowOutput(false);
    setIsTyping(true);

    const currentSnippet = snippets[currentSnippetIdx];

    const typingInterval = setInterval(() => {
      if (i < currentSnippet.code.length) {
        setDisplayedText(currentSnippet.code.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Show output shortly after typing finishes
        setTimeout(() => setShowOutput(true), 400);
        
        // Wait, then fade out output and move to next language
        setTimeout(() => {
          setShowOutput(false);
          setTimeout(() => {
            setCurrentSnippetIdx((prev) => (prev + 1) % snippets.length);
          }, 400); // Time for output to fade before resetting code
        }, 3000); // Hold the output state for 3 seconds
      }
    }, 40); // Faster typing speed for loop

    return () => clearInterval(typingInterval);
  }, [currentSnippetIdx]);

  const currentSnippet = snippets[currentSnippetIdx];

  return (
    <div className="relative w-full max-w-lg mx-auto mt-12 lg:mt-0 perspective-[1000px]">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#06b6d4]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Terminal Window */}
      <motion.div 
        initial={{ opacity: 0, rotateX: 10, y: 20 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#0b0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col transform-gpu"
      >
        {/* Window Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] transition-colors">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <motion.div 
            key={currentSnippet.lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-4"
          >
            {currentSnippet.lang}
          </motion.div>
        </div>

        {/* Editor Area */}
        <div className="p-6 font-mono text-sm sm:text-base leading-relaxed text-slate-300 min-h-[240px]">
          <div className="flex">
            {/* Line Numbers */}
            <div className="flex flex-col text-slate-700 pr-4 select-none border-r border-white/5 mr-4 text-right">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
            {/* Code */}
            <div className="relative flex-1 whitespace-pre-wrap">
              <span dangerouslySetInnerHTML={{ __html: highlightSyntax(displayedText) }} />
              {isTyping && (
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-[#06b6d4] ml-1 align-middle"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Output Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={showOutput ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="absolute -bottom-8 -right-4 sm:-right-8 bg-black border border-[#06b6d4]/30 rounded-xl p-5 shadow-2xl shadow-[#06b6d4]/10 min-w-[240px] z-10"
      >
        <div className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-widest mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
          Execution Successful
        </div>
        <div className="font-mono text-sm text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
          {currentSnippet.output}
        </div>
      </motion.div>
    </div>
  );
}
