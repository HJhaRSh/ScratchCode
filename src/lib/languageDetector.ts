export interface DetectionResult {
  language: string;
  confidence: number;
  monacoLanguage: string;
  judge0LanguageId: number;
  displayName: string;
  icon: string;
}

export function detectLanguage(code: string): DetectionResult {
  const patterns = {
    python: {
      signatures: ['def ', 'import ', 'print(', 'elif ',
                   '#!/usr/bin/env python', 'from ', '#include' ],
      keywords: ['def', 'lambda', 'None', 'True', 'False',
                 'elif', '__init__', 'self'],
      weight: 0
    },
    javascript: {
      signatures: ['const ', 'let ', 'var ', '=>',
                   'console.log', 'function ', 'require('],
      keywords: ['const', 'let', 'var', 'undefined',
                 'null', '=>', 'async', 'await'],
      weight: 0
    },
    typescript: {
      signatures: ['interface ', 'type ', ': string',
                   ': number', ': boolean', 'as ', '<T>'],
      keywords: ['interface', 'type', 'enum', 'implements',
                 'readonly', 'private', 'public'],
      weight: 0
    },
    java: {
      signatures: ['public class ', 'System.out.println',
                   'public static void main', 'import java.',
                   'new ArrayList', 'extends ', 'implements '],
      keywords: ['public', 'private', 'class', 'void',
                 'static', 'final', 'throws'],
      weight: 0
    },
    cpp: {
      signatures: ['#include <', 'cout <<', 'cin >>',
                   'int main()', 'std::', 'vector<', 'endl'],
      keywords: ['cout', 'cin', 'endl', 'namespace',
                 'template', 'nullptr'],
      weight: 0
    },
    c: {
      signatures: ['#include <stdio.h>', '#include <stdlib.h>',
                   'printf(', 'scanf(', 'int main('],
      keywords: ['printf', 'scanf', 'malloc', 'free',
                 'struct', 'typedef'],
      weight: 0
    },
    rust: {
      signatures: ['fn main()', 'let mut ', 'println!(',
                   'use std::', '->'],
      keywords: ['fn', 'let', 'mut', 'impl', 'trait',
                 'match', 'Some', 'None'],
      weight: 0
    },
    go: {
      signatures: ['package main', 'func main()', 'fmt.Println',
                   'import (', ':='],
      keywords: ['func', 'var', 'package', 'import',
                 'goroutine', 'chan', 'defer'],
      weight: 0
    }
  };

  // Score each language
  for (const [lang, data] of Object.entries(patterns)) {
    data.signatures.forEach(sig => {
      if (code.includes(sig)) data.weight += 3;
    });
    data.keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`);
      if (regex.test(code)) data.weight += 1;
    });
  }

  // Find highest score
  const sorted = Object.entries(patterns)
    .sort(([,a],[,b]) => b.weight - a.weight);
  const [detected, data] = sorted[0];

  const JUDGE0_IDS: Record<string, number> = {
    python: 71,      // Python 3.8
    javascript: 63,  // Node.js 12
    typescript: 74,  // TypeScript 3.7
    java: 62,        // Java OpenJDK 13
    cpp: 54,         // C++ GCC 9.2.0
    c: 50,           // C GCC 9.2.0
    rust: 73,        // Rust 1.40.0
    go: 60           // Go 1.13.5
  };

  const ICONS: Record<string, string> = {
    python: '🐍', javascript: '⚡', typescript: '🔷',
    java: '☕', cpp: '⚙️', c: '🔧', rust: '🦀', go: '🐹'
  };

  return {
    language: detected,
    confidence: Math.min(100, data.weight * 10),
    monacoLanguage: detected === 'cpp' ? 'cpp' : detected,
    judge0LanguageId: JUDGE0_IDS[detected] || 71,
    displayName: detected.charAt(0).toUpperCase() + detected.slice(1),
    icon: ICONS[detected] || '💻'
  };
}
