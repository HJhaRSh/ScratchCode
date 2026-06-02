'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  "const execute = () => {",
  "</>",
  "import { useState } from 'react';",
  "function compile() {",
  "return <App />;",
  "{...props}",
  "console.log('Success');",
  "let data = await fetch();",
  "if (status === 200)",
  "export default App;",
  "npm run dev",
  "git commit -m 'Initial'",
  "<div>Hello World</div>"
];

interface FloatingElement {
  id: number;
  snippet: string;
  x: number;
  y: number;
  xOffset: number;
  rotation: number;
  duration: number;
  delay: number;
}

export default function CodingBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate random positions only on the client to prevent hydration mismatch
    // Reduced length to 15 to make it more "spacious"
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      snippet: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * 100, // percentage width
      y: Math.random() * 100, // percentage height
      xOffset: (Math.random() - 0.5) * 100, // Random drift left/right up to 50px
      rotation: (Math.random() - 0.5) * 15, // Random slight rotation up to 7.5 degrees
      duration: 25 + Math.random() * 35, // Slower, more elegant animation (25-60s)
      delay: Math.random() * 15,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute font-mono text-xs sm:text-sm md:text-base text-white/5 whitespace-nowrap"
          style={{ left: `${el.x}%`, top: `${el.y}%` }}
          initial={{ opacity: 0, y: 20, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -150], // Float up further
            x: [0, el.xOffset], // Drift sideways
            rotate: [0, el.rotation] // Slowly rotate
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
        >
          {el.snippet}
        </motion.div>
      ))}
    </div>
  );
}
