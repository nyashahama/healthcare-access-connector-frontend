import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllTsxFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const s = statSync(fullPath);
    if (s.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles('src/views');
console.log(`Processing ${files.length} files...`);
let totalFixes = 0;

for (const filePath of files) {
  if (filePath.includes('__tests__')) continue;
  
  let content = readFileSync(filePath, 'utf-8');
  let original = content;

  // Strategy: Fix untyped destructured props in function components
  // We target lines that look like: = ({ isOpen, onClose }) => {
  // And change to: = ({ isOpen, onClose }: any) => {
  // 
  // Approach: Work line by line to be safe
  
  const lines = content.split('\n');
  const newLines = [];
  let inDestructuredProps = false;
  let closeParensNeeded = 0;
  let componentLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip if line doesn't look like a component definition
    // Match: const Name = ({ ...or function Name({ ...or export default function Name({
    const isComponentStart = 
      /(?:const\s+\w+\s*=\s*|function\s+\w+|export\s+default\s+function\s+\w+)\s*\(\s*\{/.test(line);
    
    if (isComponentStart && !/:/.test(line.match(/\([^{]*\{[^}]*\}[^)]*\)/g)?.[0] || '')) {
      // Check if the destructured params already have a type annotation
      // The pattern is: ...({ props }) => or ...({ props }, ref) =>
      // We need to insert `: any` before the closing `)`
      
      const match = line.match(/^(.*?\(\s*\{[^}]*\}\s*)(\)\s*(?:=>.*)?)$/);
      if (match) {
        const beforeParen = match[1];
        const afterParen = match[2];
        // Check if not already typed
        if (!/:/.test(beforeParen.match(/\{[^}]*\}/)?.[0] || '')) {
          line = beforeParen.replace(/(\s*)$/, ': any$1') + afterParen;
        }
      }
    }
    
    // Fix array method callbacks: .map((item) => -> .map((item: any) =>
    if (/\.map\(\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.map\(\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=>/,
        '.map(($1: any, $2: number) =>'
      );
    } else if (/\.map\(\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.map\(\s*\(\s*(\w+)\s*\)\s*=>/,
        '.map(($1: any) =>'
      );
    }

    // Fix .filter((x) => 
    if (/\.filter\(\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.filter\(\s*\(\s*(\w+)\s*\)\s*=>/,
        '.filter(($1: any) =>'
      );
    }

    // Fix .find((x) =>
    if (/\.find\(\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.find\(\s*\(\s*(\w+)\s*\)\s*=>/,
        '.find(($1: any) =>'
      );
    }

    // Fix .forEach((x) =>
    if (/\.forEach\(\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.forEach\(\s*\(\s*(\w+)\s*\)\s*=>/,
        '.forEach(($1: any) =>'
      );
    }

    // Fix .sort((a, b) =>
    if (/\.sort\(\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.sort\(\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=>/,
        '.sort(($1: any, $2: any) =>'
      );
    }

    // Fix .reduce((acc, x) =>
    if (/\.reduce\(\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.reduce\(\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=>/,
        '.reduce(($1: any, $2: any) =>'
      );
    }

    // Fix .some((x) =>
    if (/\.some\(\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\.some\(\s*\(\s*(\w+)\s*\)\s*=>/,
        '.some(($1: any) =>'
      );
    }

    // Fix (prev) => setState 
    if (/\(\(\s*prev\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\(\(\s*prev\s*\)\s*=>/,
        '((prev: any) =>'
      );
    }

    // Fix (e) => in JSX event handlers - onChange={(e) => 
    if (/=\\{\(\s*e\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /=\\{\(\s*e\s*\)\s*=>/,
        '={(e: React.ChangeEvent<HTMLInputElement>) =>'
      );
    }

    // Fix (clinic) => or (field) => or (system) => function params
    // These are harder - common in callback handlers
    // Let's handle the most common ones
    if (/const\s+\w+\s*=\s*\(\s*\w+\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /(const\s+\w+\s*=\s*)\(\s*(\w+)\s*\)\s*=>/,
        '$1($2: any) =>'
      );
    }
    
    // Fix (props) => 
    if (/\(\s*props\s*\)\s*=>/.test(line) && !/props:\s*\w/.test(line)) {
      line = line.replace(
        /\(\s*props\s*\)\s*=>/,
        '(props: any) =>'
      );
    }
    
    // Fix (fallbackProps) =>
    if (/\(\s*fallbackProps\s*\)\s*=>/.test(line)) {
      line = line.replace(
        /\(\s*fallbackProps\s*\)\s*=>/,
        '(fallbackProps: any) =>'
      );
    }

    newLines.push(line);
  }
  
  content = newLines.join('\n');
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    totalFixes++;
  }
}

console.log(`Modified ${totalFixes} files`);
