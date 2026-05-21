import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllFiles(dir, ext) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (entry.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const jsxFiles = getAllFiles('src/views', '.jsx');
console.log(`Found ${jsxFiles.length} .jsx files`);

let converted = 0;
let skipped = 0;

for (const jsxPath of jsxFiles) {
  const tsxPath = jsxPath.replace(/\.jsx$/, '.tsx');
  
  if (existsSync(tsxPath)) {
    unlinkSync(jsxPath);
    skipped++;
    continue;
  }

  let content = readFileSync(jsxPath, 'utf-8');

  // 1. Replace react-router-dom imports
  content = content.replace(
    /from\s+["']react-router-dom["']/g,
    'from "@tanstack/react-router"'
  );

  // 2. Check if React is directly referenced (not via import)
  const withoutImport = content.replace(/^import\s+React\b.*\n/gm, '');
  const needsReact = /[^.\w]React\./.test(withoutImport) || /[^.\w]React\b/.test(withoutImport);
  
  if (!needsReact) {
    // Remove: import React from "react";
    content = content.replace(
      /^import\s+React\s+from\s+["']react["'];\s*\n/gm,
      ''
    );
    // Handle: import React, { useState } from "react" -> import { useState } from "react"
    content = content.replace(
      /^import\s+React,\s*(\{[^}]+\})\s+from\s+(["'])react\2;\s*\n/gm,
      'import $1 from "react";\n'
    );
  }

  // 3. Clean up empty imports
  content = content.replace(/import\s+from\s+["']react["'];\s*\n/g, '');

  // 4. Add typing for useState with empty array
  content = content.replace(
    /const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState\(\s*\[\s*\]\s*\)/g,
    'const [$1, $2] = useState<any[]>([])'
  );

  // 5. Add typing for useState with empty object
  content = content.replace(
    /const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState\(\s*\{\s*\}\s*\)/g,
    'const [$1, $2] = useState<Record<string, any>>({})'
  );

  // 6. Add typing for useState with null
  content = content.replace(
    /const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState\(\s*null\s*\)/g,
    'const [$1, $2] = useState<any>(null)'
  );

  writeFileSync(tsxPath, content, 'utf-8');
  unlinkSync(jsxPath);
  converted++;
  
  if (converted % 20 === 0 || converted === jsxFiles.length) {
    console.log(`Progress: ${converted}/${jsxFiles.length}`);
  }
}

console.log(`\nDone: converted ${converted}, cleaned up ${skipped}`);
